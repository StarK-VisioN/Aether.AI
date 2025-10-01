import OpenAI from "openai";
import sql from '../config/db.js';
import {clerkClient} from '@clerk/express';
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
  apiKey: process.env.GEMENI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue!!",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "user", content: prompt, },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;
    
    await sql`insert into creations (user_id, prompt, content, type) values (${userId}, ${prompt}, ${content}, 'article')`;

    if(plan !== 'premium') {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success:true, content});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue!!",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "user", content: prompt, },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;
    
    await sql`insert into creations (user_id, prompt, content, type) values (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if(plan !== 'premium') {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success:true, content});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    
    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    // Generate image using ClipDrop API
    const formData = new FormData();
    formData.append('prompt', prompt);
    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    // Upload directly to Cloudinary using stream method
    const buffer = Buffer.from(data, 'binary');
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: "ai_generated_images",
        resource_type: "image",
        transformation: [
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(buffer);
    });
    
    const secure_url = uploadResult.secure_url;

    // Store in database
    await sql`insert into creations (user_id, prompt, content, type, publish) values (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;  
    res.json({success:true, content: secure_url});
  } catch (error) {
    console.error("Error in generateImage:", error);
    res.status(500).json({success: false, message: error.message || "An unknown error occurred"});
  }
};


export const removeImageBackground = async (req, res) => {
  try {
    const {userId} = req.auth();
    const image = req.file;
    const plan = req.plan;

    if(plan!== 'premium') {
      return res.json({success: false, message: 'This feature is only available for premium subscriptions'})
    }

    const {secure_url} = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: 'background_removal',
          background_removal: 'remove_the_background'
        }
      ]
    })

    await sql`insert into creations (user_id, prompt, content, type) values (${userId}, 'Remove background from image', ${secure_url}, 'image')`;  
    res.json({success:true, content: secure_url});

  } catch (error) {
    console.error("Error in generateImage:", error);
    res.status(500).json({success: false, message: error.message || "An unknown error occurred"});
  }
}

export const removeImageObject= async (req, res) => {
  try {
    const {userId} = req.auth();
    const {object} = req.body;
    const image = req.file;
    const plan = req.plan;

    if(plan!== 'premium') {
      return res.json({success: false, message: 'This feature is only available for premium subscriptions'})
    }

    const {public_id} = await cloudinary.uploader.upload(image.path)

    // removing the object from the image
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{effect: `gen_remove:${object}`}],
      resource_type: 'image'
    })

    await sql`insert into creations (user_id, prompt, content, type) values (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;  
    res.json({success:true, content: imageUrl});

  } catch (error) {
    console.error("Error in generateImage:", error);
    res.status(500).json({success: false, message: error.message || "An unknown error occurred"});
  }
}


export const resumeReview = async (req, res) => {
  try {
    const {userId} = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if(plan !== 'premium') {
      return res.json({success: false, message: 'This feature is only available for premium subscriptions'})
    }

    // checking file size
    if(resume.size > 5 * 1024 * 1024) {   // 5mb max
      return res.json({success: false, message: 'Resume file size exceeds allowed size (5MB).'})
    }

    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)

    const prompt = `You are an expert resume reviewer. Analyze this resume and provide:
                    1. **ATS Score (0-100)**: Rate ATS compatibility
                    2. **Key Strengths**: List 3-5 strong points
                    3. **Areas for Improvement**: List 3-5 specific improvements needed
                    4. **Grammar & Spelling Issues**: Identify any errors found
                    5. **Keyword Analysis**: Mention important keywords present and missing for the role
                    6. **Overall Feedback**: Provide detailed recommendations

                    Format your response in clear markdown with headers.
                    Resume Content:
                    ${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    await sql`insert into creations (user_id, prompt, content, type) values (
      ${userId},
      'Review the uploaded resume',
      ${content},
      'resume-review'
    )`;
    
    res.json({success: true, content});

  } catch (error) {
    console.error("Error in resumeReview:", error);
    res.status(500).json({success: false, message: error.message || "An unknown error occurred"});
  }
}
import { useAuth } from '@clerk/clerk-react';
import {Edit, Hash, Sparkles, Copy, Check } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = [ 'General' ,"Technology", 'Business', 'Health', 'Lifestyle', 'Education', 'Travle', 'Food'];
  
  const [selectedCategory, setSeletedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate 5 creative blog title ideas for the keyword "${input}" in the "${selectedCategory}" category. Return them as a bulleted list.`;
      
      const response = await axios.post('/api/ai/generate-blog-title', 
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        }
      );
      
      // Fix: Check response.data instead of data
      if (response.data.success) {
        setContent(response.data.content);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left column */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>

        <input onChange={(e) =>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of AI is...' required />
        <p className='mt-4 text-sm font-medium'>Category</p>
      
        <div className='mt-4 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item)=> (
            <span onClick={()=> setSeletedCategory(item)} className={`text-sm px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`} key={item}>{item}</span>
          ) )}
        </div>
        
        <br />
        
        <button disabled={loading} className='flex w-full justify-center items-center gap-2 bg-[#226BFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Hash className='w-5' />
          }
          Generate Title
        </button>
      </form>

      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated Titles</h1>
          </div>
          {content && (
            <button 
              onClick={handleCopy}
              className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm rounded-lg transition-colors'
            >
              {copied ? (
                <>
                  <Check className='w-4 h-4' />
                  Copied
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4' />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-9 h-9' />
                <p>Enter a topic and click "Generated title" to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='markdown-content'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default BlogTitles
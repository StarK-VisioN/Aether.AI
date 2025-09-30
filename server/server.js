import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { clerkClient, clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import { auth } from './middlewares/auth.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// Connect to Cloudinary with error handling
try {
    await connectCloudinary();
} catch (error) {
    process.exit(1); // Exit if Cloudinary fails to initialize
}

// middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is Live!"));

// API routes - apply requireAuth to all API routes
app.use('/api', requireAuth());

// Apply the auth middleware to set plan and free_usage
app.use('/api', auth);
app.use('/api/user', userRouter)

// Use AI routes
app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
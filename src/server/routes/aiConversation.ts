import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../db/models/conversations';

dotenv.config();

const aiConversationRouter = Router();

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST Route => /api/aiConversation
aiConversationRouter.post('/', async (req: Request, res: Response) => {
  try{
    // Extract user input from request body

    // Advanced Prompt => specify a "type" of structured output in the prompt.

    // Combine user prompt with structuredInstructions

    // Call the Gemini API

    // Log the final prompt so we can see what's being sent

    // Call the model's text-generation

    // Store the result

    // Send the response to the client

    // Log any errors

  }
})

export default aiConversationRouter;

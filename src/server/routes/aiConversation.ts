import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../db/models/conversations';

dotenv.config();
const aiConversationRouter = Router();

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AIResponse {
  advice: string;
  tips: string[];
}

aiConversationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, prompt } = req.body;
    console.log('Received userId:', userId, 'Prompt:', prompt);

    const structuredInstruction = `
You are a social emotional adviser specializing in social anxiety disorders.
Knowledge base includes CBT, meditation, mindfulness, and therapeutic methods.

Your purpose is to provide coaching, anxiety reduction strategies, and empathetic support.

CRITICAL INSTRUCTION: Respond with ONLY a raw JSON object. Do not include markdown formatting, code blocks, or any other text.
EXACT FORMAT REQUIRED (replace example text with your response):
{"advice":"Your empathetic advice here","tips":["First specific tip","Second specific tip"]}`;

    const finalPrompt = `${structuredInstruction}\n\nUser message: ${prompt}`;

    // Get Gemini model response
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const generationResult = await model.generateContent(finalPrompt);
    const aiResponse = await generationResult.response.text();

    // Clean and parse response
    let parsedResponse: AIResponse;
    try {
      // Remove any potential formatting artifacts
      const cleanedResponse = aiResponse
        .replace(/```json\s*/g, '') // Remove JSON code block start
        .replace(/```/g, '') // Remove code block end
        .replace(/^\s*{\s*/, '{') // Clean up starting whitespace
        .replace(/\s*}\s*$/, '}') // Clean up ending whitespace
        .trim();

      parsedResponse = JSON.parse(cleanedResponse) as AIResponse;

      // Validate response structure
      if (!parsedResponse.advice || !Array.isArray(parsedResponse.tips)) {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn('Failed to parse AI response:', err);
      parsedResponse = {
        advice:
          "I apologize, but I'm having trouble processing that request. Please try again.",
        tips: [],
      };
    }

    // Store conversation with cleaned response
    const newConversation = await Conversation.create({
      user_id: userId,
      prompt,
      response: JSON.stringify(parsedResponse), // Store clean JSON
    });

    // Get the plain object representation
    const conversationData = newConversation.get({ plain: true });

    // Send clean response to client
    res.status(201).json({
      conversation: conversationData,
      structured: parsedResponse,
    });
  } catch (error) {
    console.error('[aiConversationRouter] Error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request',
      structured: {
        advice: 'I apologize, but I encountered an error. Please try again.',
        tips: [],
      },
    });
  }
});

export default aiConversationRouter;

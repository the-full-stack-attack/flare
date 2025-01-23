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
  try {
    // Extract user input from request body
    const { userId, prompt } = req.body;
    console.log('Received userId:', userId, 'Prompt:', prompt);

    // Advanced Prompt => specify a "type" of structured output in the prompt.
    const structuredInstruction = `
    You are a helpful Social Anxiety AI assistant.
    1. Provide a short piece of advice in the "advice" field.
    2. Provide 2 bullet point tips in the "tips" field (as an array).
    Respond in valid JSON only:
      {
        "advice": "string",
        "tips": ["string", "string"]
      }
    `;

    // Combine user prompt with structuredInstructions
    const finalPrompt = `
     ${structuredInstruction}
     User prompt: "${prompt}"
    `;

    // Call the Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    // Log the final prompt so we can see what's being sent
    console.log('Final prompt =>', finalPrompt);

    // Call the model's text-generation
    const generationResult = await model.generateContent(finalPrompt);
    const aiResponse = await generationResult.response.text();
    console.log('AI raw response =>', aiResponse);

    // Parse the structured JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(aiResponse);
    } catch (err) {
      console.warn('Failed to parse AI response as JSON =>', err);
      parsedJson = { advice: aiResponse, tips: [] };
    }

    // Store the result
    const newConversation = await Conversation.create({
      user_id: userId,
      prompt,
      response: aiResponse,
    });

    // Send the response to the client
    return res.status(201).json({
      conversation: newConversation,
      structured: parsedJson,
    });
    // Log any errors
  } catch (error) {
    console.error('[aiConversationRouter] Error =>', error);
    return res.sendStatus(500);
  }
});

export default aiConversationRouter;

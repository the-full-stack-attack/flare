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
    const { userId, prompt } = req.body;
    console.log('Received userId:', userId, 'Prompt:', prompt);

    // Advanced Prompt => specify a "type" of structured output in the prompt.
    const structuredInstruction = `
    You are a mental health adviser that specializes in social anxiety disorders.
    You have knowledge of:
    - Cognitive Behavioral Therapy (CBT)
    - Meditation
    - Mindfulness practices
    - Other therapeutic methods

    Your purpose is to:
    - Provide short coaching sessions
    - Offer strategies to reduce social anxiety symptoms
    - Assist users in preparing for events or calming nerves
    - Always maintain empathy and clarity in your replies

      Response Format Requirement:
      Provide **only** the JSON object below **without** any additional text or Markdown formatting.
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

    console.log('Final prompt:', finalPrompt);

    // Call the Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    // Call the model's text-generation
    const generationResult = await model.generateContent(finalPrompt);
    const aiResponse = await generationResult.response.text();
    console.log('AI raw response:', aiResponse);

    // Clean the AI response by removing Markdown codeblocks
    const aiResponseCleaned = aiResponse
      .replace(/```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    // Parse the structured JSON
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(aiResponseCleaned);
    } catch (err) {
      console.warn('Failed to parse AI response as JSON:', err);
      parsedJson = {
        advice: aiResponse,
        tips: [],
      };
    }

    // Store the result
    const newConversation = await Conversation.create({
      user_id: userId,
      prompt,
      response: aiResponse,
    });

    res.status(201).send({
      conversation: newConversation,
      structured: parsedJson,
    });
  } catch (error) {
    console.error('[aiConversationRouter] Error:', error);
    res.sendStatus(500);
  }
});

export default aiConversationRouter;

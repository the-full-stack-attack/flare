import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../db/models/conversations';
import Conversation_Session from '../db/models/conversation_session';
import { checkForFlares } from '../helpers/flares';

dotenv.config();
const aiConversationRouter = Router();

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AIResponse {
  advice: string;
  tips: string[];
}

// Main conversation route
aiConversationRouter.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, prompt } = req.body;

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
        response: JSON.stringify(parsedResponse),
        is_favorite: false,
      });

      // Get the plain object representation
      const conversationData = newConversation.get({ plain: true });

      // Send clean response to client
      res.status(201).send({
        conversation: conversationData,
        structured: parsedResponse,
      });
    } catch (error) {
      console.error('[aiConversationRouter] Error:', error);
      res.status(500).send({
        structured: {
          advice: 'I apologize, but I encountered an error. Please try again.',
          tips: [],
        },
      });
    }
  }
);

aiConversationRouter.post(
  '/save/:conversationId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { conversationId } = req.params;
      // Find the conversation by ID
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        res.status(404).send({ error: 'Conversation not found' });
        return;
      }

      // Update is_favorite to true
      await conversation.update({ is_favorite: true });
      res.send(conversation);
    } catch (error) {
      console.error('[saveConversation] Error:', error);
      res.status(500).send({ error: 'Failed to save conversation' });
    }
  }
);

aiConversationRouter.get(
  '/saved/:userId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const savedConversations = await Conversation_Session.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
      });
      res.send(savedConversations);
    } catch (error) {
      console.error('[getSavedConversations] Error:', error);
      res.status(500).send({ error: 'Failed to fetch saved conversations' });
    }
  }
);

// Save an entire conversation session to the database
aiConversationRouter.post(
  '/saveSession',
  async (req: any, res: Response): Promise<void> => {
    try {
      const { userId, conversation } = req.body;

      const savedSession = await Conversation_Session.create({
        user_id: userId,
        session_data: conversation,
      });
      checkForFlares(req.user);
      res.status(201).send(savedSession);
    } catch (error) {
      console.error('Error saving conversation session:', error);
      res.status(500).send({ error: 'Failed to save conversation' });
    }
  }
);

aiConversationRouter.delete(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await Conversation_Session.destroy({
        where: { id },
      });
      res.status(200).send({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('[deleteConversation] Error:', error);
      res.status(500).send({ error: 'Failed to delete conversation' });
    }
  }
);

export default aiConversationRouter;

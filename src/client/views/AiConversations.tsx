import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import HelpfulPrompts from './AiConversations/components/helpful-prompts';
import SavedConversations from './AiConversations/components/saved-conversations';
import cn from '../../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Basic ChatMessage Interface - used as core props for a message
interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface MessageWithFavorite extends ChatMessage {
  id?: number;
  isFavorite: boolean;
}

interface SavedConversation {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function AiConversations() {
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState<MessageWithFavorite[]>([]);

  const [userMessage, setUserMessage] = useState('');

  const [savedConversations, setSavedConversations] = useState<
    SavedConversation[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // GET Saved Conversations from DB
  const fetchSavedConversations = useCallback(async () => {
    try {
      if (!user || !user.id) return;
      const { data } = await axios.get<SavedConversation[]>(
        `/api/aiConversation/saved/${user.id}`
      );
      setSavedConversations(data);
    } catch (err) {
      console.error('Failed to fetch saved conversations:', err);
    }
  }, [user]);

  // Fetch saved conversations when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchSavedConversations();
    }
  }, [user.id, fetchSavedConversations]);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send user message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setIsLoading(true);

    const newUserMsg: MessageWithFavorite = {
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
      isFavorite: false,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setUserMessage('');

    try {
      const { data } = await axios.post('/api/aiConversation', {
        userId: user.id,
        prompt: userMessage,
      });
      const aiText =
        data.structured?.advice || 'Unable to process at the moment.';

      const newAiMsg: MessageWithFavorite = {
        sender: 'assistant',
        text: aiText,
        timestamp: new Date(),
        isFavorite: false,
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // In case of error, create an error message for the assistant
      const errorAiMsg: MessageWithFavorite = {
        sender: 'assistant',
        text: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        isFavorite: false,
      };
      setMessages((prev) => [...prev, errorAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the Current Conversation Session
  const handleSaveSession = async () => {
    if (!messages.length) return;
    try {
      const conversationPayload = {
        userId: user.id,
        conversation: {
          messages,
          createdAt: new Date(),
        },
      };

      await axios.post('/api/aiConversation/saveSession', conversationPayload);
      await fetchSavedConversations();

      // Optionally clear the current messages after saving
      setMessages([]);
    } catch (error) {
      console.error('Failed to save conversation session:', error);
    }
  };

  // Create a new Conversation Session
  const handleNewConversation = () => {
    setMessages([]);
  };

  const handleConversationSelect = (conv: SavedConversation) => {
    const userMsg: MessageWithFavorite = {
      sender: 'user',
      text: conv.prompt,
      timestamp: new Date(),
      isFavorite: false,
    };
    const aiMsg: MessageWithFavorite = {
      sender: 'assistant',
      text: conv.response,
      timestamp: new Date(),
      isFavorite: false,
    };
    setMessages([userMsg, aiMsg]);
  };

  const firstMessageTimestamp =
    messages.length > 0 ? messages[0].timestamp.getTime() : Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      {/* Container for the 3 columns in large, or stacked in small */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* For smaller devices: flex-col, for large screens: a grid with 3 columns */}
        <div className="grid grid-cols-1 lg:grid lg:grid-cols-12 gap-4">
          {/* Saved Conversations on the Left => col-span-3 */}
          <div className="lg:col-span-3">
            {/* Wrap SavedConversations in a scrollable div to get infinite scrolling */}
            <div className="h-[600px] overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/30">
              <SavedConversations
                conversations={savedConversations}
                onSelect={handleConversationSelect}
              />
            </div>
          </div>

          {/* Center => AI Chat => col-span-6 */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Chat Container */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 mb-2 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl"
              style={{ height: '600px' }}
            >
              <AnimatePresence>
                {messages.map((msg) => {
                  const key = msg.id
                    ? msg.id
                    : `${msg.timestamp.getTime()}-${msg.text}`;
                  const delay =
                    ((msg.timestamp.getTime() - firstMessageTimestamp) / 1000) *
                    0.05;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay }}
                      className={cn(
                        `mb-4 max-w-[80%] relative ${
                          msg.sender === 'user'
                            ? 'ml-auto text-right'
                            : 'mr-auto text-left'
                        }`
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-xl p-3',
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30'
                            : 'bg-white/10 border border-yellow-500/20'
                        )}
                      >
                        <p className="text-white">{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 p-3"
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </motion.div>
              )}
            </div>

            {/* Row with: Input + Send Button + Save Heart + New Conversation */}
            <div className="p-4 border-t border-orange-500/20">
              <Input
                className="flex gap-2"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="How can I help?"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white"
              >
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full" />
                ) : (
                  'Send'
                )}
              </Button>
              {/* Heart button that saves entire session */}
              <Button
                onClick={handleSaveSession}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white"
              >
                💖
              </Button>
              {/* New conversation button */}
              <Button
                onClick={handleNewConversation}
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white"
              >
                New Chat
              </Button>
            </div>
          </div>

          {/* Right => Recommended Prompts => col-span-3 */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <HelpfulPrompts
              onSelectPrompt={(prompt) => setUserMessage(prompt)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

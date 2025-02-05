import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import HelpfulPrompts from './AiConversations/components/helpful-prompts';
import SavedConversations, {
  MessageWithFavorite,
  SavedConversation,
} from './AiConversations/components/saved-conversations';
import cn from '../../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Basic ChatMessage Interface - used as core props for a message
interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
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
    if (!userMessage.trim() || isLoading) return;
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

      // Parse the response if it's a string
      let aiResponse = '';
      if (typeof data.structured === 'string') {
        try {
          const parsed = JSON.parse(data.structured);
          aiResponse = parsed.advice;
        } catch {
          aiResponse = data.structured;
        }
      } else if (data.structured?.advice) {
        aiResponse = data.structured.advice;
      } else {
        aiResponse = 'Unable to process response';
      }

      const newAiMsg: MessageWithFavorite = {
        sender: 'assistant',
        text: aiResponse,
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

      toast.success('Conversation saved successfully');
      setMessages([]);
    } catch (error) {
      console.error('Failed to save conversation session:', error);
      toast.error('Failed to save conversation');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new Conversation Session
  const handleNewConversation = () => {
    setMessages([]);
  };

  const handleConversationSelect = (conv: SavedConversation) => {
    if (conv.session_data?.messages) {
      setMessages(conv.session_data.messages);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await axios.delete(`/api/aiConversation/${id}`);
      // Refresh the conversations list
      await fetchSavedConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <Toaster position="top-center" theme="dark" />
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      {/* Container for the 3 columns in large, or stacked in small */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/** Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Saved Conversations on the Left => col-span-3 */}
          <div className="order-2 lg:order-1 lg:col-span-3 md:col-span-6">
            <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-yellow-500/20 p-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                Saved Conversations
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Your personal collection of helpful AI conversations. Reference
                them anytime you need a refresh.
              </p>
              <div className="h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/30">
                <SavedConversations
                  conversations={savedConversations}
                  onSelect={handleConversationSelect}
                  onDelete={handleDeleteConversation}
                />
              </div>
            </div>
          </div>

          {/* Center - Chat Area */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-orange-500/20 h-[820px] flex flex-col">
              {/* Chat Title */}
              <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-400">
                  Your personal AI guide for social events and planning. Ask
                  anything!
                </p>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 h-[300px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/30"
              >
                <AnimatePresence>
                  {messages.map((msg) => {
                    // Handle both string and Date timestamps
                    const timestamp =
                      typeof msg.timestamp === 'string'
                        ? new Date(msg.timestamp)
                        : msg.timestamp;

                    const key = msg.id
                      ? msg.id
                      : `${timestamp.getTime()}-${msg.text}`;

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                          'mb-4 max-w-[80%]',
                          msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-xl p-4',
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
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200" />
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-orange-500/20">
                <div className="flex gap-2">
                  <Input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="How can I help?"
                    className="flex-1 bg-black/50 border-transparent focus:ring-2 focus:ring-orange-500/50 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Send'
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveSession}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500"
                    title="Save Conversation"
                  >
                    💖
                  </Button>
                  <Button
                    onClick={handleNewConversation}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500"
                  >
                    New
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Recommended Prompts */}
          <div className="order-3 lg:col-span-3 md:col-span-6">
            <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-pink-500/20 p-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                Recommended Prompts
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Need inspiration? Try these conversation starters to get the
                most out of your AI assistant.
              </p>
              <div className="h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20">
                <HelpfulPrompts
                  onSelectPrompt={(prompt) => setUserMessage(prompt)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

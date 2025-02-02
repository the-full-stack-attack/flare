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
import HeartButton from './AiConversations/components/heart-button/heart-button';

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

interface Conversation {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

interface AIResponse {
  conversation: Conversation;
  structured: {
    advice: string;
    tips: string[];
  };
}

interface SavedConversation {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

interface ConversationSession {
  id?: number;
  messages: MessageWithFavorite[];
  createdAt: Date;
  isSaved: boolean;
}

export default function AiConversations() {
  const { user } = useContext(UserContext);

  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [currentConversationIndex, setCurrentConversationIndex] =
    useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState<
    SavedConversation[]
  >([]);
  const [userMessage, setUserMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversations.length === 0) {
      setConversations([
        { messages: [], createdAt: new Date(), isSaved: false },
      ]);
      setCurrentConversationIndex(0);
    }
  }, [conversations]);

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
    if (user.id) {
      fetchSavedConversations();
    }
  }, [user.id, fetchSavedConversations]);

  // Create a new Conversation Session
  const handleNewConversation = () => {
    const newSession: ConversationSession = {
      messages: [],
      createdAt: new Date(),
      isSaved: false,
    };
    setConversations((prev) => [...prev, newSession]);
    setCurrentConversationIndex(conversations.length);
  };

  // Save the Current Conversation Session
  const handleSaveCurrentConversation = async () => {
    const currentConversation = conversations[currentConversationIndex];
    if (!currentConversation) return;
    try {
      const { data } = await axios.post('/api/aiConversation/saveSession', {
        userId: user.id,
        conversation: {
          messages: currentConversation.messages,
          createdAt: currentConversation.createdAt,
        },
      });
      setConversations((prev) => {
        const updated = [...prev];
        updated[currentConversationIndex] = {
          ...updated[currentConversationIndex],
          id: data.id,
          isSaved: true,
        };
        return updated;
      });
      await fetchSavedConversations();
    } catch (error) {
      console.error('Failed to save conversation session:', error);
    }
  };

  // Send user message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setIsLoading(true);

    const newUserMessage: MessageWithFavorite = {
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
      isFavorite: false,
    };
    setConversations((prev) => {
      const updated = [...prev];
      const current = updated[currentConversationIndex];
      updated[currentConversationIndex] = {
        ...current,
        messages: [...current.messages, newUserMessage],
      };
      return updated;
    });

    setUserMessage('');

    try {
      const { data } = await axios.post<AIResponse>('/api/aiConversation', {
        userId: user.id,
        prompt: userMessage,
      });

      const newAImessage: MessageWithFavorite = {
        sender: 'assistant',
        text:
          data.structured?.advice ||
          'I apologize, but I am unable to process that request.',
        timestamp: new Date(),
        isFavorite: false,
        id: data.conversation?.id,
      };

      setConversations((prev) => {
        const updated = [...prev];
        const current = updated[currentConversationIndex];
        updated[currentConversationIndex] = {
          ...current,
          messages: [...current.messages, newAImessage],
        };
        return updated;
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // In case of error, create an error message for the assistant
      const errorMsg: MessageWithFavorite = {
        sender: 'assistant',
        text: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        isFavorite: false,
      };
      setConversations((prev) => {
        const updated = [...prev];
        const current = updated[currentConversationIndex];
        updated[currentConversationIndex] = {
          ...current,
          messages: [...current.messages, errorMsg],
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Triggered when user clicks the heart icon
  const toggleFavorite = async (messageIndex: number) => {
    const currentConv = conversations[currentConversationIndex];
    const message = currentConv.messages[messageIndex];
    if (!message.id) {
      console.warn('No conversation ID; cannot favorite this message.');
      return;
    }
    try {
      await axios.post(`/api/aiConversation/save/${message.id}`);
      setConversations((prev) => {
        const updated = [...prev];
        const current = updated[currentConversationIndex];
        const updatedMessages = current.messages.map((m, idx) =>
          idx === messageIndex ? { ...m, isFavorite: true } : m
        );
        updated[currentConversationIndex] = {
          ...current,
          messages: updatedMessages,
        };
        return updated;
      });
      // Optionally, refresh the saved conversations list
      await fetchSavedConversations();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversations, currentConversationIndex]);

  // Handle Recommended Prompt Click
  const handlePromptSelect = (selectedPrompt: string) => {
    setUserMessage(selectedPrompt);
  };

  const handleConversationSelect = (conversation: SavedConversation) => {
    console.log('Selected saved conversation:', conversation);
    setUserMessage(conversation.prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      {/* Background glow remains unchanged */}
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      {/* Main container */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* Conversation Tabs and Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {conversations.map((conv, index) => (
            <Button
              key={conv.createdAt.toISOString()}
              onClick={() => setCurrentConversationIndex(index)}
              variant={currentConversationIndex === index ? 'default' : 'ghost'}
            >
              {`Conversation ${index + 1}`}
            </Button>
          ))}
          <Button onClick={handleNewConversation}>New Conversation</Button>
          <Button onClick={handleSaveCurrentConversation}>
            Save Conversation
          </Button>
        </div>

        {/* Main content grid: Two columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Chat Area: occupies 9 columns on large screens */}
          <div className="lg:col-span-9 flex flex-col">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-yellow-500/20 mb-4"
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-gray-300">
                Ask me anything about events, planning, or get general
                assistance.
              </p>
            </motion.div>

            {/* Chat Container */}
            <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 flex flex-col h-[870px] mb-4">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/30"
              >
                <AnimatePresence>
                  {conversations[currentConversationIndex]?.messages.map(
                    (msg) => (
                      <motion.div
                        key={
                          msg.id
                            ? msg.id
                            : `${msg.timestamp.getTime()}-${msg.text}`
                        }
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                          'mb-4 max-w-[80%] relative group',
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
                          <p className="text-gray-100">{msg.text}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                            {msg.sender === 'assistant' && (
                              <div className="transition-transform hover:scale-110">
                                <HeartButton
                                  id={`heart-${msg.id ? msg.id : msg.timestamp.getTime()}`}
                                  checked={msg.isFavorite}
                                  onChange={() => {
                                    // Find the index of this message within the current session
                                    const idx = conversations[
                                      currentConversationIndex
                                    ].messages.findIndex(
                                      (m) =>
                                        m.timestamp.getTime() ===
                                          msg.timestamp.getTime() &&
                                        m.text === msg.text
                                    );
                                    toggleFavorite(idx);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
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

              {/* Input Area */}
              <div className="p-4 border-t border-orange-500/20">
                <div className="flex gap-2">
                  <Input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="How can I help?"
                    className="flex-1 bg-black/50 border-transparent text-white placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-500/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Recommended Prompts and Saved Conversations */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-4">
            {/* Recommended Prompts Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-orange-500/20"
            >
              <HelpfulPrompts onSelectPrompt={handlePromptSelect} />
            </motion.div>

            {/* Saved Conversations Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-yellow-500/20"
            >
              <SavedConversations
                conversations={savedConversations}
                onSelect={handleConversationSelect}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { BackgroundGlow } from '../../components/ui/background-glow';
import cn from '../../../lib/utils';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface StructuredData {
  advice?: string;
  tips?: string[];
}

function AiConversations() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    const newMessage = {
      sender: 'user' as const,
      text: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserMessage('');

    try {
      const response = await axios.post('/api/aiConversation', {
        userId: 1,
        prompt: userMessage,
      });

      const aiMessage = {
        sender: 'assistant' as const,
        text:
          response.data.structured?.advice ||
          'I apologize, but I am unable to process that request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 relative overflow-hidden">
      {/* Background Effect */}
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8 min-h-screen">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 h-[200px]"
            >
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Future Feature #1</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 h-[200px]"
            >
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Future Feature #2</p>
              </div>
            </motion.div>
          </div>

          {/* Main Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col h-full">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 mb-4"
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-gray-300">
                Ask me anything about events, planning, or get general assistance.
              </p>
            </motion.div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col">
              <div 
                ref={chatContainerRef}
                className="flex-1 backdrop-blur-lg bg-black/30 rounded-xl border border-white/20 overflow-y-auto p-6 mb-4"
              >
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
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
                            ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30' 
                            : 'bg-white/10 border border-white/20'
                        )}
                      >
                        <p className="text-gray-100">{msg.text}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 p-3"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  {isLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 h-[200px]"
            >
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Future Feature #3</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 h-[200px]"
            >
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Future Feature #4</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiConversations;

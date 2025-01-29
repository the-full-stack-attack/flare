import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { BackgroundGlow } from '../../components/ui/background-glow';
import { AnimatedTitle } from '../../components/ui/animated-title';
import { GlowBorder } from '../../components/ui/glow-border';
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
        text: response.data.structured?.advice || 'I apologize, but I am unable to process that request.',
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8 min-h-screen">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <GlowBorder>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-black/50 rounded-xl p-6 h-[200px]"
              >
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Future Feature #1</p>
                </div>
              </motion.div>
            </GlowBorder>

            <GlowBorder>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-black/50 rounded-xl p-6 h-[200px]"
              >
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Future Feature #2</p>
                </div>
              </motion.div>
            </GlowBorder>
          </div>

          {/* Main Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col h-full">
            {/* Title Card */}
            <GlowBorder>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-black/50 rounded-xl p-6"
              >
                <AnimatedTitle
                  text="AI Assistant"
                  className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 mt-2"
                >
                  Ask me anything about events, planning, or get general assistance.
                </motion.p>
              </motion.div>
            </GlowBorder>

            {/* Chat Container */}
            <GlowBorder className="flex-1 mt-4">
              <div
                ref={chatContainerRef}
                className="h-full backdrop-blur-lg bg-black/50 rounded-xl overflow-y-auto p-6"
              >
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'mb-4 max-w-[80%]',
                        msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-xl p-4 backdrop-blur-sm',
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-yellow-500/20 border border-pink-500/30'
                            : 'bg-white/10 border border-pink-500/20'
                        )}
                      >
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-100"
                        >
                          {msg.text}
                        </motion.p>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-xs text-gray-400 mt-2 block"
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </motion.span>
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
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 rounded-full"
                        animate={{
                          y: ["0%", "-50%", "0%"],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </GlowBorder>

            {/* Input Area */}
            <div className="flex gap-2 mt-4">
              <GlowBorder className="flex-1">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="How can I help?"
                  className="w-full bg-black/50 border-transparent text-white placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-pink-500/50"
                />
              </GlowBorder>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600 text-white px-6 py-2 rounded-xl"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Send"
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 md:col-span-2 space-y-4">
            <GlowBorder>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-black/50 rounded-xl p-6 h-[200px]"
              >
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Future Feature #3</p>
                </div>
              </motion.div>
            </GlowBorder>

            <GlowBorder>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-black/50 rounded-xl p-6 h-[200px]"
              >
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Future Feature #4</p>
                </div>
              </motion.div>
            </GlowBorder>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiConversations;

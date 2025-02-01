import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../contexts/UserContext';
import { BackgroundGlow } from '../../components/ui/background-glow';
import HelpfulPrompts from './AiConversations/components/helpful-prompts';
import SavedConversations from './AiConversations/components/saved-conversations';
import cn from '../../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function AiConversations() {
  const { user } = useContext(UserContext);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch saved conversations when component mounts
  useEffect(() => {
    if (user.id) {
      axios
        .get(`/api/aiConversation/saved/${user.id}`)
        .then(({ data }) => setSavedConversations(data))
        .catch((err) =>
          console.error('Failed to fetch saved conversations:', err)
        );
    }
  }, [user.id]);

  interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
    timestamp: Date;
  }

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/aiConversation', {
        userId: user.id,
        prompt,
      });
      setResponse(data.structured);

      const aiMessage = {
        sender: 'assistant' as const,
        text:
          response.data.structured?.advice ||
          'I apologize, but I am unable to process that request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (conversationId: number) => {
    try {
      await axios.post(`/api/aiConversation/save/${conversationId}`);
      // Refresh saved conversations
      const { data } = await axios.get(`/api/aiConversation/saved/${user.id}`);
      setSavedConversations(data);
    } catch (err) {
      console.error('Failed to save conversation:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Helpful Prompts Sidebar */}
          <div className="md:col-span-1">
            <HelpfulPrompts onSelectPrompt={setPrompt} />
          </div>

          {/* Main Chat Area */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 text-white"
                placeholder="Ask me anything about social situations..."
                rows={4}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-bold"
              >
                {loading ? 'Thinking...' : 'Get Advice'}
              </button>
            </form>

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Advice</h3>
                  <p className="text-gray-300">{response.advice}</p>
                </div>
                <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Action Steps
                  </h3>
                  <ul className="space-y-2">
                    {response.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-gray-300">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Saved Conversations Sidebar */}
          <div className="md:col-span-1">
            <SavedConversations
              conversations={savedConversations}
              onSelect={(conv) => setPrompt(conv.prompt)}
            />

            {/* Main Content Container */}
            <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Main Chat Area - Full width on mobile, 9 cols on desktop */}
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

                  {/* Fixed Height Chat Container */}
                  <div className="backdrop-blur-lg bg-black/30 rounded-xl border border-orange-500/20 flex flex-col h-[600px] mb-4">
                    {/* Messages Area with Scroll */}
                    <div
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/30"
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
                                  ? 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30'
                                  : 'bg-white/10 border border-yellow-500/20'
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
                          onKeyPress={(e) =>
                            e.key === 'Enter' && handleSendMessage()
                          }
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

                {/* Side Features - Stack below on mobile, 3 cols on desktop */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {/* Feature Card 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-orange-500/20 h-[200px]"
                  >
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Future Feature #1</p>
                    </div>
                  </motion.div>

                  {/* Feature Card 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-yellow-500/20 h-[200px]"
                  >
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Future Feature #2</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BackgroundGlow } from '../../components/ui/background-glow';
import { HelpfulPrompts } from './AiConversations/components/helpful-prompts';
import { SavedConversations } from './AiConversations/components/saved-conversations';

export default function AiConversations() {
  const { user } = useContext(UserContext);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);

  // Fetch saved conversations when component mounts
  useEffect(() => {
    if (user.id) {
      axios.get(`/api/aiConversation/saved/${user.id}`)
        .then(({ data }) => setSavedConversations(data))
        .catch(err => console.error('Failed to fetch saved conversations:', err));
    }
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/aiConversation', {
        userId: user.id,
        prompt
      });
      setResponse(data.structured);
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
                  <h3 className="text-xl font-bold text-white mb-4">Action Steps</h3>
                  <ul className="space-y-2">
                    {response.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-gray-300">• {tip}</li>
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
          </div>
        </div>
      </div>
    </div>
  );
}

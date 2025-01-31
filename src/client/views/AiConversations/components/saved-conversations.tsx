import React from 'react';
import { motion } from 'framer-motion';

interface SavedConversation {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

interface SavedConversationsProps {
  conversations: SavedConversation[];
  onSelect: (conversation: SavedConversation) => void;
}

function SavedConversations({
  conversations,
  onSelect,
}: SavedConversationsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
        Saved Conversations
      </h2>
      <div className="space-y-3">
        {conversations.map((conv, idx) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(conv)}
            className="cursor-pointer backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors"
          >
            <p className="text-gray-300 text-sm mb-2">
              {new Date(conv.createdAt).toLocaleDateString()}
            </p>
            <p className="text-white font-medium">{conv.prompt}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SavedConversations;

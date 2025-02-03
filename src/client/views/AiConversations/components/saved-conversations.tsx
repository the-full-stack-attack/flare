import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

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

export default function SavedConversations({
  conversations,
  onSelect,
}: SavedConversationsProps) {
  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6"
        >
          <div className="text-yellow-500/80 mb-3">✨</div>
          <p className="text-sm text-gray-400">
            Your saved conversations will appear here
          </p>
        </motion.div>
      ) : (
        conversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(conversation)}
            className="group w-full text-left"
          >
            <div
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-orange-500/20 
                          hover:border-orange-500/30 transition-all duration-200
                          hover:shadow-[0_0_15px_rgba(255,165,0,0.1)] space-y-2"
            >
              {/* Conversation Preview */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-200 line-clamp-2 group-hover:text-white transition-colors">
                    {conversation.prompt}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1 group-hover:text-gray-400 transition-colors">
                    {conversation.response.substring(0, 60)}...
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {format(new Date(conversation.createdAt), 'MMM d, yyyy')}
                  </span>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-orange-500/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}

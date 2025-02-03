import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface SavedConversation {
  id: number;
  user_id: number;
  session_data: {
    messages: {
      sender: 'user' | 'assistant';
      text: string;
      timestamp: string;
    }[];
    createdAt: string;
  };
  createdAt: string;
}

interface SavedConversationsProps {
  conversations: SavedConversation[];
  onSelect: (conversation: SavedConversation) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function SavedConversations({
  conversations,
  onSelect,
  onDelete,
}: SavedConversationsProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

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
        conversations.map((conversation) => (
          <motion.div key={conversation.id} className="group relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(conversation)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(conversation);
                }
              }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-orange-500/20 
                       hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-200 group-hover:text-white">
                    {conversation.session_data.messages[0]?.text ||
                      'No message'}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                    {conversation.session_data.messages[1]?.text?.substring(
                      0,
                      60
                    ) || ''}
                    ...
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {format(new Date(conversation.createdAt), 'MMM d, yyyy')}
                  </span>

                  {confirmingDelete === conversation.id ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conversation.id);
                          setConfirmingDelete(null);
                        }}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 
                                 px-2 py-1 rounded transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingDelete(null);
                        }}
                        className="text-xs bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 
                                 px-2 py-1 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmingDelete(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity
                               text-red-500 hover:text-red-400 p-1 rounded"
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

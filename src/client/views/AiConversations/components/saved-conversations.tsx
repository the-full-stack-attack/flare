import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X } from 'lucide-react';

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface MessageWithFavorite extends ChatMessage {
  id?: number;
  isFavorite: boolean;
}

export interface SavedConversation {
  id: number;
  user_id: number;
  session_data: {
    messages: MessageWithFavorite[];
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

  const DeleteConfirmationModal = ({ id, onClose }: { id: number; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 border border-yellow-500/20 rounded-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-white mb-2">
          Delete Conversation
        </h3>
        <p className="text-gray-400 mb-4">
          Are you sure you want to delete this conversation? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete(id);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

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
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-orange-500/20 hover:border-orange-500/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-200 group-hover:text-white">
                    {conversation.session_data.messages[0]?.text || 'No message'}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                    {conversation.session_data.messages[1]?.text?.substring(0, 60) || ''} ...
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {format(new Date(conversation.createdAt), 'MMM d, yyyy')}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingDelete(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white p-1 rounded"
                    aria-label="Delete conversation"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}

      {/* Modal Portal */}
      <AnimatePresence>
        {confirmingDelete && (
          <DeleteConfirmationModal
            id={confirmingDelete}
            onClose={() => setConfirmingDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

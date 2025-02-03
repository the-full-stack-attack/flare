import React from 'react';
import { motion } from 'framer-motion';

type HelpfulPromptsProps = {
  onSelectPrompt: (prompt: string) => void;
};

const helpfulPrompts = [
  {
    category: 'Social Anxiety',
    prompts: [
      'How can I feel more confident at social gatherings?',
      'What are some techniques to calm my nerves before a social event?',
      'How do I start conversations with new people?',
    ],
  },
  {
    category: 'Event Planning',
    prompts: [
      "I'm nervous about hosting an event, any tips?",
      'How do I decline an invitation without feeling guilty?',
      'What should I do if I feel overwhelmed at an event?',
    ],
  },
  {
    category: 'Self-Improvement',
    prompts: [
      'How can I build better social habits?',
      'What are some daily exercises for social confidence?',
      'How do I overcome fear of judgment?',
    ],
  },
];

function HelpfulPrompts({ onSelectPrompt }: HelpfulPromptsProps) {
  return (
    <div className="space-y-6">
      {helpfulPrompts.map((category, idx) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="backdrop-blur-lg bg-white/5 rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            {category.category}
          </h3>
          <div className="space-y-2">
            {category.prompts.map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPrompt(prompt)}
                className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default HelpfulPrompts;

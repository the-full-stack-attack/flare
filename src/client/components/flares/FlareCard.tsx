import React from 'react';
import { motion } from 'framer-motion';
import cn from '../../../../lib/utils';

type FlareCardType = {
  flare: FlareType;
  index: number;
}

type FlareType = {
  id: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  milestone: string;
  description: string;
  value: number;
};

function FlareCard({ flare, index }: FlareCardType) {
  return (
  <div className="backdrop-blur-lg rounded-xl p-6 border', 'bg-white/10 border-yellow-500/30">
    <div className="flex items-center mb-4">
      <h3 className="font-bold', 'text-white">{flare.name}</h3>
    </div>
    <p className="text-gray-400 text-sm">{flare.description}</p>
  </div>
  )
}

export default FlareCard;
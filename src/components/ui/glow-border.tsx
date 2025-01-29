import React from 'react';
import { motion } from 'framer-motion';

export const GlowBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className="relative group">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl blur-sm opacity-10 group-hover:opacity-20 transition duration-1000"
        animate={{
          background: [
            "linear-gradient(to right, rgba(236,72,153,0.1), rgba(249,115,22,0.1), rgba(234,179,8,0.1))",
            "linear-gradient(to right, rgba(234,179,8,0.1), rgba(236,72,153,0.1), rgba(249,115,22,0.1))",
            "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,179,8,0.1), rgba(236,72,153,0.1))",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className={`relative ${className}`}>
        {children}
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundGlowProps {
  className?: string;
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({ className }) => {
  return (
    <div className={`fixed inset-0 ${className}`}>
      {/* Create multiple glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen filter blur-xl pointer-events-none"
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
          style={{
            background: `radial-gradient(circle, rgba(255,165,0,0.4) 0%, rgba(255,69,0,0.1) 70%)`,
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

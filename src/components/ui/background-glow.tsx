import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface BackgroundGlowProps {
  className?: string;
}

export const BackgroundGlow = memo(function BackgroundGlow({ className = '' }: BackgroundGlowProps) {

  const orbPositions = useMemo(() =>
  [...Array(5)].map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  })), []
  );

  return (
    <div className={`fixed inset-0 ${className}`}>
      {orbPositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen filter blur-md pointer-events-none"
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
            left: position.left,
            top: position.top,
          }}
        />
      ))}
    </div>
  );
});

import { motion } from "framer-motion";
import cn from "../../../lib/utils";
import React from "react";
import GoldDrip from '../assets/logo/gold-drip.png';

interface LogoProps {
  className?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "navbar";
}

export const Logo = ({ className, animate = true, size = "sm" }: LogoProps) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-28",
    "2xl": "h-36",
    navbar: "h-50"
  };

  return (
    <motion.div
      className={cn("relative isolate", className)}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <motion.img
        src={GoldDrip}
        alt="Flare Logo"
        className={cn(
          "object-contain w-auto relative z-10",
          sizes[size]
        )}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
        }}
        whileHover={{
          scale: 1.05,
          filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.7))',
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  );
};

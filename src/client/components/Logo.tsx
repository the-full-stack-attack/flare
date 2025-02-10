import { motion } from "framer-motion";
import cn from "../../../lib/utils";
import React from "react";
import GradientLogo from '../assets/logo/gradient.png';

interface LogoProps {
  className?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "navbar";
}

export const Logo = ({ className, animate = true, size = "sm" }: LogoProps) => {
  const sizes = {
    sm: "h-5",
    md: "h-16",
    lg: "h-20",
    xl: "h-28",
    "2xl": "h-36",
    navbar: "h-50"
  };

  const containerVariants = {
    initial: { opacity: 1 },
    hover: { scale: 1.02, transition: { duration: 0.3 } }
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, filter: "brightness(1.2)", transition: { duration: 0.3 } }
  };

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className={cn("flex items-center", className)}
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
    >
      {/* Logo Container */}
      <div className="relative w-auto">
        <motion.div
          initial="initial"
          whileHover="hover"
          animate={animate ? "animate" : "initial"}
          variants={logoVariants}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            variants={glowVariants}
          />
          <motion.img
            src={GradientLogo}
            alt="Flare Logo"
            className={cn(
              "object-contain w-auto",
              sizes[size]
            )}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

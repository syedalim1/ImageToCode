import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroDescription() {
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic text size based on screen width
  const textSize = windowWidth < 640 ? "text-lg" : "text-xl";
  const paddingY = windowWidth < 640 ? "py-3" : "py-4";
  const paddingX = windowWidth < 640 ? "px-4" : "px-6";

  // Split text for animation
  const firstHalf =
    "Transform your visual designs into clean, production-ready code automatically.";
  const secondHalf =
    "Powered by AI for developers who value speed and precision.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      className="relative mb-12 mx-auto"
      style={{ willChange: "transform" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <motion.span
        className="absolute inset-0 rounded-xl -z-10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ willChange: "transform" }}
      >
        {/* Base gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10"
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated subtle patterns */}
        <svg
          className="absolute w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 dark:bg-blue-500/10"
          style={{ filter: "blur(40px)" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-purple-500/5 dark:bg-purple-500/10"
          style={{ filter: "blur(30px)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.span>

      {/* Enhanced text container with border effect */}
      <motion.div
        className={`max-w-3xl mx-auto ${paddingX} ${paddingY} relative overflow-hidden`}
        animate={isHovered ? { y: -2 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Subtle border effect on hover */}
        {isHovered && (
          <motion.span
            className="absolute inset-0 rounded-xl border border-purple-200/40 dark:border-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* First half of description */}
        <motion.p
          className={`${textSize} text-gray-600 dark:text-gray-300 mb-2 leading-relaxed font-bold text-xg`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {firstHalf}
        </motion.p>

        {/* Second half of description with highlight */}
        <motion.p
          className={`${textSize} text-gray-700 dark:text-gray-200 font-medium leading-relaxed`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span className="relative">
            {secondHalf}
            {/* Underline accent on hover */}
            {isHovered && (
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-300/40 to-blue-300/40 dark:from-purple-500/30 dark:to-blue-500/30 rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </span>
        </motion.p>

        {/* Decorative code icon */}
        <motion.div
          className="absolute top-2 right-2 text-purple-400/30 dark:text-purple-400/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Decorative dots */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-purple-400/50 dark:bg-purple-400/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

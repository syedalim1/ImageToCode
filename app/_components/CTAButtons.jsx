import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function CTAButtons() {
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false);
  const [isHoveredSecondary, setIsHoveredSecondary] = useState(false);
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

  // Responsive adjustments
  const buttonSize =
    windowWidth < 640 ? "text-base py-3 px-6" : "text-lg py-4 px-8";
  const iconSize = windowWidth < 640 ? "h-4 w-4" : "h-5 w-5";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        delay: 0.5,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
      style={{ willChange: "transform" }}
    >
      {/* Primary CTA Button with enhanced effects */}
      <motion.a
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        href="/dashboard"
        className={`bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white ${buttonSize} rounded-xl font-semibold shadow-xl flex items-center justify-center group relative overflow-hidden`}
        style={{ willChange: "transform" }}
        onMouseEnter={() => setIsHoveredPrimary(true)}
        onMouseLeave={() => setIsHoveredPrimary(false)}
      >
        {/* Button text */}
        <span className="relative z-10 flex items-center">
          Start Converting Now
          <SparklesIcon className={`${iconSize} ml-2 relative z-10`} />
        </span>

        {/* Gradient hover effect */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-purple-700 via-violet-700 to-blue-700"
          initial={{ x: "100%" }}
          animate={isHoveredPrimary ? { x: 0 } : { x: "100%" }}
          transition={{ duration: 0.4 }}
          style={{ willChange: "transform" }}
        />

        {/* Particle effects */}
        {isHoveredPrimary && (
          <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                initial={{
                  opacity: 0,
                  x: "50%",
                  y: "50%",
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() * 60 - 30)}%`,
                  y: `${50 + (Math.random() * 60 - 30)}%`,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Subtle light reflection effect */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10"
          initial={{ x: "-100%" }}
          animate={isHoveredPrimary ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.8 }}
          style={{ willChange: "transform" }}
        />
      </motion.a>

      {/* Secondary CTA Button with enhanced effects */}
      <motion.a
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        href="#demo"
        className={`bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800 ${buttonSize} rounded-xl font-semibold shadow-lg flex items-center justify-center group relative overflow-hidden`}
        style={{ willChange: "transform" }}
        onMouseEnter={() => setIsHoveredSecondary(true)}
        onMouseLeave={() => setIsHoveredSecondary(false)}
      >
        {/* Button text */}
        <span className="relative z-10 flex items-center">
          Watch Demo
          {/* Animated play icon */}
          <motion.svg
            className={`${iconSize} ml-2`}
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={
              isHoveredSecondary
                ? { scale: [1, 1.2, 1], rotate: [0, 0, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{
              duration: 1,
              repeat: isHoveredSecondary ? Infinity : 0,
            }}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </motion.svg>
        </span>

        {/* Background hover effect */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10"
          initial={{ opacity: 0 }}
          animate={isHoveredSecondary ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Border glow effect */}
        {isHoveredSecondary && (
          <motion.span
            className="absolute -inset-px rounded-xl opacity-50"
            initial={{ opacity: 0 }}
            style={{
              background: "linear-gradient(45deg, #9333ea, #3b82f6, #9333ea)",
              backgroundSize: "200% 200%",
              filter: "blur(2px)",
              backgroundPosition: "0% 0%"
            }}
            animate={{
              opacity: 1,
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.a>

      {/* Decorative element */}
      <motion.div
        className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          className="w-12 h-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          animate={{ scaleX: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

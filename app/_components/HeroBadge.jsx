import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroBadge() {
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

  // Responsive text size based on screen width
  const textSize = windowWidth < 640 ? "text-xs" : "text-sm";
  const padding = windowWidth < 640 ? "px-3 py-1" : "px-4 py-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="inline-block mb-6 relative"
      style={{ willChange: "transform" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient with more vibrant colors */}
      <motion.span
        className={`inline-flex items-center ${padding} rounded-full ${textSize} font-medium shadow-xl relative overflow-hidden`}
        style={{
          background: "linear-gradient(135deg, #7928CA, #4361EE, #3A86FF)",
          color: "#ffffff",
          borderWidth: "1px",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {/* Animated background patterns */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Pulsing dot animation with enhanced effects */}
        <motion.span
          className="relative flex h-3 w-3 mr-2"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
          }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>

          {/* Extra glow around the dot on hover */}
          {isHovered && (
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 4px 2px rgba(236, 72, 153, 0.6)",
                  "0 0 8px 4px rgba(236, 72, 153, 0.4)",
                  "0 0 4px 2px rgba(236, 72, 153, 0.6)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.span>

        {/* Text content with animated icon */}
        <span className="relative z-10 flex items-center font-bold text-lg">
          New AI Model Released
          {/* Animated decorative icon */}
          <motion.svg
            className="ml-2 h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            animate={isHovered ? { rotate: [0, 15, 0, -15, 0] } : {}}
            transition={isHovered ? { duration: 1.5, repeat: Infinity } : {}}
          >
           
          </motion.svg>
        </span>

        {/* Enhanced animated glow effect */}
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 5px 2px rgba(107, 70, 193, 0.5)",
              "0 0 20px 10px rgba(63, 81, 181, 0.3)",
              "0 0 5px 2px rgba(107, 70, 193, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ willChange: "box-shadow" }}
        />

        {/* Multiple sparkle effects that appear on hover */}
        {isHovered && (
          <>
            {/* First sparkle */}
            <motion.span
              className="absolute h-1 w-1 rounded-full bg-white"
              initial={{ opacity: 0, scale: 0, x: "10%", y: "20%" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: ["10%", "5%"],
                y: ["20%", "10%"],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Second sparkle */}
            <motion.span
              className="absolute h-1 w-1 rounded-full bg-white"
              initial={{ opacity: 0, scale: 0, x: "80%", y: "50%" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: ["80%", "85%"],
                y: ["50%", "40%"],
              }}
              transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }}
            />

            {/* Additional sparkles */}
            <motion.span
              className="absolute h-1.5 w-1.5 rounded-full bg-yellow-200"
              initial={{ opacity: 0, scale: 0, x: "30%", y: "70%" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: ["30%", "25%"],
                y: ["70%", "75%"],
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
            />

            <motion.span
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              initial={{ opacity: 0, scale: 0, x: "60%", y: "30%" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: ["60%", "65%"],
                y: ["30%", "25%"],
              }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.7 }}
            />
          </>
        )}

        {/* Particle effect that triggers on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-blue-200"
                initial={{
                  opacity: 0,
                  x: "50%",
                  y: "50%",
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [`${50 + (Math.random() * 40 - 20)}%`],
                  y: [`${50 + (Math.random() * 40 - 20)}%`],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.span>

      {/* Enhanced floating decorative elements */}
      <motion.div
        className="absolute -right-3 -top-2 h-6 w-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.8, 1, 0.8],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Additional decorative elements */}
      <motion.div
        className="absolute -left-2 -bottom-1 h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-500"
        initial={{ scale: 0.6, opacity: 0.7 }}
        animate={{
          scale: [0.6, 0.9, 0.6],
          opacity: [0.7, 1, 0.7],
          y: [0, -3, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />

      {/* Animated rings that appear on hover */}
      {isHovered && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-white pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [1, 1.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-white pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [1, 1.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.5,
            }}
          />
        </>
      )}
    </motion.div>
  );
}

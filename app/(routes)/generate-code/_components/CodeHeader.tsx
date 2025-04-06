"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Sparkles,
  Code,
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  Layers,
} from "lucide-react";

interface CodeHeaderProps {
  imageUrl?: string;
  description?: string;
  onBackClick?: () => void;
}

const CodeHeader: React.FC<CodeHeaderProps> = ({
  imageUrl,
  description,
  onBackClick,
}) => {
  // Add typing animation effect
  const [typedText, setTypedText] = useState("");
  const fullText =
    description ||
    "Transform your ideas into executable code with AI-powered generation";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <motion.header
      className="mb-8 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-xl shadow-xl border border-white/20 dark:border-gray-800/40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced decorative elements with more vibrant colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-gradient-to-tl from-blue-400 to-cyan-300 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-400 to-fuchsia-500 opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-l from-green-400 to-emerald-500 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Animated circuit board pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="circuit"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 10 L80 10 L80 40 L60 40 L60 60 L40 60 L40 80 L20 80 Z"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="20" cy="10" r="3" fill="white" />
            <circle cx="80" cy="10" r="3" fill="white" />
            <circle cx="80" cy="40" r="3" fill="white" />
            <circle cx="60" cy="40" r="3" fill="white" />
            <circle cx="60" cy="60" r="3" fill="white" />
            <circle cx="40" cy="60" r="3" fill="white" />
            <circle cx="40" cy="80" r="3" fill="white" />
            <circle cx="20" cy="80" r="3" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Enhanced animated dots with more particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.max(2, Math.random() * 6)}px`,
              height: `${Math.max(2, Math.random() * 6)}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Floating icons */}
        <motion.div
          className="absolute top-2 right-10 text-white/30"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Terminal className="h-8 w-8" />
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-16 text-white/20"
          animate={{
            y: [0, 8, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Cpu className="h-10 w-10" />
        </motion.div>

        <div className="flex items-center mb-6 space-x-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-inner"
          >
            <Code className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200 flex items-center space-x-2">
            <span>Code Generation Studio</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Zap className="h-6 w-6 text-yellow-300" />
            </motion.div>
          </h1>
        </div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative group">
            <p className="text-white/90 dark:text-gray-200 max-w-2xl text-base leading-relaxed backdrop-blur-sm bg-white/10 p-4 rounded-lg shadow-inner border border-white/10 transition-all duration-300 group-hover:bg-white/20">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
            <motion.div
              className="absolute -right-2 -top-2 w-5 h-5 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/30"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="flex space-x-3">
            <motion.div
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg relative overflow-hidden group"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Layers className="h-5 w-5 mr-2 text-white" />
              <span className="font-medium">Code Templates</span>
            </motion.div>

            <motion.div
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg relative overflow-hidden group"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent w-1/2 h-full transform -skew-x-12 animate-shimmer"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
              <span className="font-medium">AI Generated</span>
            </motion.div>
          </div>
        </motion.div>

        {onBackClick && (
          <motion.button
            onClick={onBackClick}
            className="absolute top-4 left-4 p-2.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/10"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      {/* Interactive code particle effect at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-8 flex items-end overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white opacity-50 rounded-t-sm mx-0.5"
            style={{
              height: `${Math.max(4, Math.random() * 24)}px`,
              width: `${Math.max(2, Math.random() * 6)}px`,
            }}
            animate={{
              height: [
                `${Math.max(4, Math.random() * 24)}px`,
                `${Math.max(8, Math.random() * 32)}px`,
                `${Math.max(4, Math.random() * 24)}px`,
              ],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.header>
  );
};

export default CodeHeader;

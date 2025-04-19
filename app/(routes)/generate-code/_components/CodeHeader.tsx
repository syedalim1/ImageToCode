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
  const [isDesktop, setIsDesktop] = useState(true);
  const fullText =
    description ||
    "Transform your ideas into executable code with AI-powered generation";

  useEffect(() => {
    // Handle responsive behavior
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Typing animation
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [fullText]);

  return (
    <motion.header
      className="mb-4 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-white/20 dark:border-gray-800/40"
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
        {/* Back button with improved animation and styling */}
        {onBackClick && (
          <motion.button
            onClick={onBackClick}
            className="flex items-center gap-2 mb-4 sm:mb-6 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Back to Designs</span>
          </motion.button>
        )}

      </div>

      {/* Modern Code Generation Panel */}
      <motion.div
        className="relative overflow-hidden  mt-2 md:mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated particle effects - reduced for mobile */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(isDesktop ? 15 : 8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-60"
              style={{
                width: Math.random() * (isDesktop ? 10 : 6) + 5,
                height: Math.random() * (isDesktop ? 10 : 6) + 5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -70 - 20],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          ))}
        </div>

        <div className=" rounded-xl p-2 sm:p-4 md:p-4 border border-white/20 relative z-10">
        
        

        

          <motion.h3
            className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to Create Magic!
          </motion.h3>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white mb-2 sm:mb-4 text-center font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            If you want to generate code, click the <span className="font-semibold text-yellow-300">Generate Code</span> button.
            <br className="hidden sm:block" />After clicking, all code will be displayed here.
          </motion.p>

        </div>
      </motion.div>
    </motion.header>
  );
};

export default CodeHeader;

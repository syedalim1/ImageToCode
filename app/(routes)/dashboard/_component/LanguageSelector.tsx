"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

// Animated floating particles component
const FloatingParticles = () => {
  return (
    <>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(
              Math.random() * 100
            ) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.3)`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            scale: [1, Math.random() * 0.5 + 1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

// Decorative background elements
const BackgroundElements = () => {
  return (
    <>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-r from-green-300/10 to-teal-300/10 rounded-full blur-2xl"></div>
      
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-indigo-300/30 rounded-full"></div>
      <div className="absolute bottom-10 left-20 w-12 h-12 border border-purple-300/40 rounded-full"></div>
      
      <motion.div 
        className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-pink-300/30 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
    </>
  );
};

const languages = [
  // Frontend frameworks
  {
    id: "react-tailwind",
    name: "React + Tailwind",
    icon: <SiReact className="text-4xl text-[#61DAFB]" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Modern, responsive components with utility-first CSS",
    gradient: "from-[#61DAFB]/10 to-[#06B6D4]/10",
    hoverGradient: "from-[#61DAFB]/20 to-[#06B6D4]/20",
    bgColor: "bg-[#61DAFB]/5",
    category: "frontend",
    popularity: 96,
    color: "text-[#61DAFB]",
    secondaryColor: "text-[#06B6D4]",
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    icon: <SiNextdotjs className="text-4xl text-black dark:text-white" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Full-stack React framework with optimized styling",
    gradient: "from-black/10 to-[#06B6D4]/10",
    hoverGradient: "from-black/20 to-[#06B6D4]/20",
    bgColor: "bg-black/5 dark:bg-white/5",
    category: "frontend",
    popularity: 92,
    color: "text-black dark:text-white",
    secondaryColor: "text-[#06B6D4]",
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: <SiHtml5 className="text-4xl text-[#E34F26]" />,
    secondaryIcon: <SiCss3 className="text-4xl text-[#1572B6]" />,
    description: "Clean, semantic markup with modern CSS",
    gradient: "from-[#E34F26]/10 to-[#1572B6]/10",
    hoverGradient: "from-[#E34F26]/20 to-[#1572B6]/20",
    bgColor: "bg-[#E34F26]/5",
    category: "frontend",
    popularity: 98,
    color: "text-[#E34F26]",
    secondaryColor: "text-[#1572B6]",
  },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  // Animation for selection effect
  useEffect(() => {
    if (selectedLanguage) {
      return;
    }
  }, [selectedLanguage]);

  // Get current language details
  const currentLanguage = languages.find((l) => l.id === selectedLanguage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
      className="w-full h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-purple-100/60 via-indigo-100/40 to-blue-100/60 dark:from-purple-900/30 dark:via-indigo-900/40 dark:to-blue-900/30 backdrop-blur-md shadow-2xl border border-white/30 dark:border-white/10 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <BackgroundElements />
      <FloatingParticles />

      {/* Main content container with z-index to stay above decorative elements */}
      <div className="relative z-10">
        {/* Header section with interactive elements */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text relative"
          >
            <span className="relative inline-block">
              Choose Your Tech Stack
              <motion.span 
                className="absolute -top-6 -right-6 text-2xl"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto"
          >
            Select the technologies you want to use for your next amazing
            project
          </motion.p>

          {/* Decorative tech icons floating around the header */}
          <div className="relative h-8 mb-4">
            {languages.map((lang, index) => (
              <motion.div
                key={`float-${lang.id}`}
                className="absolute"
                style={{ left: `${(index + 1) * 25}%` }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="scale-75 opacity-70">{lang.icon}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl overflow-hidden">
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              onMouseEnter={() => setHoveredLanguage(lang.id)}
              onMouseLeave={() => setHoveredLanguage(null)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center p-6 transition-all duration-300 cursor-pointer rounded-xl w-full overflow-hidden ${
                selectedLanguage === lang.id
                  ? `bg-gradient-to-r from-${lang.color.replace('text-', '')}/20 to-${lang.secondaryColor.replace('text-', '')}/20 border-l-4 border-${lang.color.replace('text-', '')}`
                  : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border-l-4 border-transparent"
              }`}
            >
              {/* Background animation */}
              <AnimatePresence>
                {(selectedLanguage === lang.id || hoveredLanguage === lang.id) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-hidden"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white dark:bg-gray-300"
                        style={{
                          width: Math.random() * 10 + 5,
                          height: Math.random() * 10 + 5,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          x: [0, Math.random() * 40 - 20],
                          y: [0, Math.random() * 40 - 20],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main content */}
              <motion.div 
                className={`p-4 rounded-full bg-gradient-to-br from-white/90 to-white/30 dark:from-gray-700/90 dark:to-gray-900/30 shadow-md mb-4 relative ${
                  selectedLanguage === lang.id ? "ring-2 ring-purple-400 ring-offset-2" : ""
                }`}
                animate={
                  selectedLanguage === lang.id 
                    ? { 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 4px 6px rgba(124, 58, 237, 0.1)",
                          "0 8px 12px rgba(124, 58, 237, 0.3)",
                          "0 4px 6px rgba(124, 58, 237, 0.1)"
                        ]
                      } 
                    : {}
                }
                transition={{ duration: 2, repeat: selectedLanguage === lang.id ? Infinity : 0 }}
              >
                {lang.icon}
                <motion.div 
                  className="absolute -right-1 -bottom-1 scale-75 opacity-80"
                  animate={
                    selectedLanguage === lang.id 
                      ? { rotate: [0, 360] } 
                      : {}
                  }
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {lang.secondaryIcon}
                </motion.div>
              </motion.div>

              <div className="flex-1 text-center">
                <motion.h3 
                  className={`font-bold text-lg mb-1 ${
                    selectedLanguage === lang.id 
                    ? `text-gray-800 dark:text-white ` 
                      : "text-gray-800 dark:text-white"
                  }`}
                  animate={
                    selectedLanguage === lang.id 
                      ? { scale: [1, 1.05, 1] } 
                      : {}
                  }
                  transition={{ duration: 2, repeat: selectedLanguage === lang.id ? Infinity : 0 }}
                >
                  {lang.name}
                </motion.h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {lang.description}
                </p>
              </div>

              {/* Popularity indicator */}
              <div className="w-full mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Popularity</span>
                  <span className="font-medium">{lang.popularity}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.popularity}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      selectedLanguage === lang.id
                      ? `bg-purple-500`
                        : "bg-purple-500"
                    }`}
                  />
                </div>
              </div>

              {/* Selection indicator */}
              {selectedLanguage === lang.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;

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



// Decorative background elements


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

    color: "text-[#61DAFB]",
    secondaryColor: "text-[#06B6D4]",
  },
  // {
  //   id: "nextjs-tailwind",
  //   name: "Next.js + Tailwind",
  //   icon: <SiNextdotjs className="text-4xl text-black dark:text-white" />,
  //   secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
  //   description: "Full-stack React framework with optimized styling",
  //   gradient: "from-black/10 to-[#06B6D4]/10",
  //   hoverGradient: "from-black/20 to-[#06B6D4]/20",
  //   bgColor: "bg-black/5 dark:bg-white/5",
  //   category: "frontend",
  //   popularity: 92,
  //   color: "text-black dark:text-white",
  //   secondaryColor: "text-[#06B6D4]",
  // },
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

      {/* Main content container with z-index to stay above decorative elements */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text relative"
        >
          <span className=" ">
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

      </div>

      <div className="relative z-10">
        {/* Header section with interactive elements */}


        <div className="flex flex-col justify-between md:flex-row gap-4 rounded-xl overflow-hidden">
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              onMouseEnter={() => setHoveredLanguage(lang.id)}
              onMouseLeave={() => setHoveredLanguage(null)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={` flex flex-col items-center p-6 transition-all duration-300 cursor-pointer rounded-xl w-full overflow-hidden ${selectedLanguage === lang.id || hoveredLanguage === lang.id
                  ? `bg-gradient-to-r from-${lang.color.replace('text-', '')}/20 to-${lang.secondaryColor.replace('text-', '')}/20 border-l-4 border-${lang.color.replace('text-', '')}`
                  : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border-l-4 border-transparent"
                }`}
            >

              {/* Main content */}
              <motion.div
                className={`p-4 rounded-full bg-gradient-to-br from-white/90 to-white/30 dark:from-gray-700/90 dark:to-gray-900/30 shadow-md mb-4 relative ${selectedLanguage === lang.id ? "ring-2 ring-purple-400 ring-offset-2" : ""
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
                  className={`font-bold text-lg mb-1 ${selectedLanguage === lang.id
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

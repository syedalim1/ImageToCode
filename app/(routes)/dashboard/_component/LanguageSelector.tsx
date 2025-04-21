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

interface Language {
  id: string;
  name: string;
  icon: React.ReactNode;
  secondaryIcon: React.ReactNode;
  description: string;
  gradient: string;
  hoverGradient: string;
  bgColor: string;
  category: string;
  color: string;
  secondaryColor: string;
}

const languages: Language[] = [
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

  // Animation for selection effect - properly handle null/undefined values and set default
  useEffect(() => {
    // If selectedLanguage is null/undefined or invalid, set default language
    if (!selectedLanguage || !languages.some(lang => lang.id === selectedLanguage)) {
      // Set default language to first language in the list
      setSelectedLanguage(languages[0].id);
    }
  }, [selectedLanguage, setSelectedLanguage]);

  // Get current language details with fallback to first language if none selected
  const currentLanguage = languages.find((l) => l.id === selectedLanguage) || languages[0];

  // Decorative elements - floating particles
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
      className="w-full h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-purple-100/60 via-indigo-100/40 to-blue-100/60 dark:from-purple-900/30 dark:via-indigo-900/40 dark:to-blue-900/30 backdrop-blur-md shadow-2xl border border-white/30 dark:border-white/10 relative overflow-hidden"
    >
      {/* Decorative floating particles */}
      {particles.map((i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full bg-white/30 dark:bg-white/10 ${i % 2 === 0 ? "h-12 w-12" : "h-8 w-8"
            }`}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Main content container with z-index to stay above decorative elements */}
      <div className="relative z-10">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text relative"
          >
            <span>
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

        <div className="flex flex-col justify-between md:flex-row gap-4 rounded-xl overflow-hidden">
          <AnimatePresence>
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              const isHovered = hoveredLanguage === lang.id;

              return (
                <motion.div
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  onMouseEnter={() => setHoveredLanguage(lang.id)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex flex-col items-center p-6 transition-all duration-300 
                    cursor-pointer rounded-xl w-full overflow-hidden
                    ${isSelected ? 'shadow-lg' : 'shadow'}
                    ${isSelected || isHovered
                      ? `bg-gradient-to-br ${lang.hoverGradient} border-l-4 border-${lang.color.replace('text-', '')}`
                      : `bg-gradient-to-br ${lang.gradient} border-l-4 border-transparent`
                    }
                  `}
                >
                  {/* Icon container */}
                  <motion.div
                    className={`
                      p-4 rounded-full bg-gradient-to-br 
                      from-white/90 to-white/30 dark:from-gray-700/90 dark:to-gray-900/30 
                      shadow-md mb-4 relative
                      ${isSelected ? "ring-2 ring-purple-400 ring-offset-2" : ""}
                    `}
                    animate={
                      isSelected
                        ? {
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 4px 6px rgba(124, 58, 237, 0.1)",
                            "0 8px 12px rgba(124, 58, 237, 0.3)",
                            "0 4px 6px rgba(124, 58, 237, 0.1)"
                          ]
                        }
                        : isHovered
                          ? { scale: 1.05 }
                          : { scale: 1 }
                    }
                    transition={{
                      duration: isSelected ? 2 : 0.3,
                      repeat: isSelected ? Infinity : 0
                    }}
                  >
                    {lang.icon}
                    <motion.div
                      className="absolute -right-1 -bottom-1 scale-75 opacity-80"
                      animate={
                        isSelected
                          ? { rotate: [0, 360] }
                          : isHovered
                            ? { rotate: [0, 15, 0] }
                            : {}
                      }
                      transition={{
                        duration: isSelected ? 8 : 1,
                        repeat: isSelected ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      {lang.secondaryIcon}
                    </motion.div>
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 text-center">
                    <motion.h3
                      className={`font-bold text-lg mb-1 ${isSelected || isHovered
                          ? `${lang.color}`
                          : "text-gray-800 dark:text-white"
                        }`}
                      animate={
                        isSelected
                          ? { scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: isSelected ? Infinity : 0
                      }}
                    >
                      {lang.name}
                    </motion.h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {lang.description}
                    </p>
                  </div>

                
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
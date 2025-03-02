"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const languages = [
  {
    id: "react-tailwind",
    name: "React + Tailwind",
    icon: <SiReact className="text-4xl text-[#61DAFB]" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Modern, responsive components with utility-first CSS",
    gradient: "from-[#61DAFB]/10 to-[#06B6D4]/10",
    hoverGradient: "from-[#61DAFB]/20 to-[#06B6D4]/20",
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    icon: <SiNextdotjs className="text-4xl text-black dark:text-white" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Full-stack React framework with optimized styling",
    gradient: "from-black/10 to-[#06B6D4]/10",
    hoverGradient: "from-black/20 to-[#06B6D4]/20",
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: <SiHtml5 className="text-4xl text-[#E34F26]" />,
    secondaryIcon: <SiCss3 className="text-4xl text-[#1572B6]" />,
    description: "Clean, semantic markup with modern CSS",
    gradient: "from-[#E34F26]/10 to-[#1572B6]/10",
    hoverGradient: "from-[#E34F26]/20 to-[#1572B6]/20",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <SiJavascript className="text-4xl text-[#F7DF1E]" />,
    secondaryIcon: null,
    description: "Dynamic, interactive web applications",
    gradient: "from-[#F7DF1E]/10 to-[#F7DF1E]/5",
    hoverGradient: "from-[#F7DF1E]/20 to-[#F7DF1E]/10",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: <SiTypescript className="text-4xl text-[#3178C6]" />,
    secondaryIcon: null,
    description: "Strongly-typed JavaScript for robust applications",
    gradient: "from-[#3178C6]/10 to-[#3178C6]/5",
    hoverGradient: "from-[#3178C6]/20 to-[#3178C6]/10",
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: <SiVuedotjs className="text-4xl text-[#4FC08D]" />,
    secondaryIcon: null,
    description: "Progressive JavaScript framework for UI building",
    gradient: "from-[#4FC08D]/10 to-[#4FC08D]/5",
    hoverGradient: "from-[#4FC08D]/20 to-[#4FC08D]/10",
  },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
}) => {
  return (
    <div className="w-full h-full max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-purple-100/50 to-indigo-100/50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
        Choose Your Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <motion.div
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.id)}
            className={`relative p-6 rounded-xl transition-all cursor-pointer transform hover:scale-105 ${
              selectedLanguage === lang.id
                ? "ring-2 ring-purple-500 bg-gradient-to-br " + lang.gradient
                : "hover:bg-gradient-to-br " + lang.hoverGradient
            }`}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              {lang.icon}
              {lang.secondaryIcon && lang.secondaryIcon}
            </div>

            <h3 className="text-xl font-bold text-center mb-2">{lang.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              {lang.description}
            </p>
            {selectedLanguage === lang.id && (
              <motion.div
                className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white/30 dark:bg-black/20 rounded-lg">
        <p className="text-center text-sm font-medium">
          Selected:{" "}
          <span className="font-bold text-purple-600">
            {languages.find((l) => l.id === selectedLanguage)?.name || "None"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LanguageSelector;

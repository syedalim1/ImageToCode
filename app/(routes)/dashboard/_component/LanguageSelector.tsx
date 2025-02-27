"use client";

import { motion } from "framer-motion";
import { SiReact, SiNextdotjs, SiTailwindcss, SiHtml5, SiCss3 } from "react-icons/si";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const languages = [
  {
    id: "react-tailwind",
    name: "React + Tailwind",
    icon: <SiReact className="text-[#61DAFB] h-8 w-8" />,
    secondaryIcon: <SiTailwindcss className="text-[#06B6D4] h-6 w-6" />,
    description: "Modern, responsive components with utility-first CSS",
    gradient: "from-[#61DAFB]/10 to-[#06B6D4]/10",
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    icon: <SiNextdotjs className="text-black dark:text-white h-8 w-8" />,
    secondaryIcon: <SiTailwindcss className="text-[#06B6D4] h-6 w-6" />,
    description: "Full-stack React framework with optimized styling",
    gradient: "from-black/10 to-[#06B6D4]/10",
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: <SiHtml5 className="text-[#E34F26] h-8 w-8" />,
    secondaryIcon: <SiCss3 className="text-[#1572B6] h-6 w-6" />,
    description: "Clean, semantic markup with modern CSS",
    gradient: "from-[#E34F26]/10 to-[#1572B6]/10",
  }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Choose Your Stack
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedLanguage(lang.id)}
            className={`relative p-6 rounded-xl transition-all ${
              selectedLanguage === lang.id
                ? "ring-2 ring-purple-500 bg-gradient-to-br " + lang.gradient
                : "hover:bg-gradient-to-br " + lang.gradient
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {lang.icon}
              {lang.secondaryIcon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{lang.name}</h3>
            <p className="text-sm text-gray-600">{lang.description}</p>
            {selectedLanguage === lang.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 
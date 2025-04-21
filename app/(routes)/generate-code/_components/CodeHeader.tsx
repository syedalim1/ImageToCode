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


      {/* Modern Code Generation Panel */}
      <motion.div
        className="relative overflow-hidden  mt-2 md:mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >

        <div className=" rounded-xl p-2 sm:p-4 md:p-4  relative z-10">


          <motion.h3
            className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to Create Magic!
          </motion.h3>

          <motion.p
            className="text-base sm:text-lg md:text-2xl text-white mb-2 sm:mb-4 text-center font-light leading-relaxed"
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

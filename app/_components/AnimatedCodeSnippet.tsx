"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimatedCodeSnippetProps {
  code: string;
}

const AnimatedCodeSnippet: React.FC<AnimatedCodeSnippetProps> = ({ code }) => {
  const [visibleCode, setVisibleCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setVisibleCode(code.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [code, currentIndex]);

  return (
    <pre className="text-left overflow-hidden">
      <code className="text-xs sm:text-sm text-green-400 font-mono">
        {visibleCode}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-green-400 ml-1"
        />
      </code>
    </pre>
  );
};

export default AnimatedCodeSnippet;

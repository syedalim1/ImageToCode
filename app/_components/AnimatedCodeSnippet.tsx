"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import React from "react";

interface AnimatedCodeSnippetProps {
  code: string;
  typeSpeed?: number;
  highlightSyntax?: boolean;
}

const AnimatedCodeSnippet: React.FC<AnimatedCodeSnippetProps> = ({
  code,
  typeSpeed = 30,
  highlightSyntax = true,
}) => {
  const [visibleCode, setVisibleCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setVisibleCode(code.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typeSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [code, currentIndex, typeSpeed]);

  // Simple syntax highlighting
  const getHighlightedCode = () => {
    if (!highlightSyntax) return visibleCode;

    // Replace common code patterns with highlighted spans
    return visibleCode
      .replace(
        /(import|export|from|function|return|const|let|var|if|else|for|while)/g,
        '<span class="text-purple-400">$1</span>'
      )
      .replace(
        /(className|href|viewBox|fill|stroke|src|alt|type|onClick|onChange)/g,
        '<span class="text-yellow-300">$1</span>'
      )
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-300">$1</span>')
      .replace(/(&lt;.*?&gt;|<.*?>)/g, '<span class="text-blue-300">$1</span>')
      .replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        '<span class="text-gray-400">$1</span>'
      )
      .replace(
        /(\{|\}|\(|\)|\[|\]|;|,|\.)/g,
        '<span class="text-gray-300">$1</span>'
      );
  };

  return (
    <pre className="text-left overflow-hidden rounded-lg bg-gray-950 p-4 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 px-2 py-0.5 rounded bg-gray-800"
          >
            {Math.round(code.length / 10)} lines
          </motion.div>
        )}
      </div>

      {highlightSyntax ? (
        <code
          className="text-xs sm:text-sm font-mono text-gray-300 block leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
        />
      ) : (
        <code className="text-xs sm:text-sm text-gray-300 font-mono block leading-relaxed">
          {visibleCode}
        </code>
      )}

      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
        />
      )}
    </pre>
  );
};

export default AnimatedCodeSnippet;

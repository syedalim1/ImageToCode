"use client";

import { motion } from "framer-motion";
import {
  RefreshCw,
  Sparkles,
  Info,

} from "lucide-react";
import { useState, useEffect } from "react";


interface ActionButtonsProps {
  onSave: () => void;
  onGenerate?: () => void;
  isLoading: boolean;
  hasCode: boolean;
  regenerationCount: number;
  maxRegenerations: number;
  code?: string;
  onFormatCode?: () => void;
  onPreviewCode?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({

  onGenerate,
  isLoading,
  hasCode,
  regenerationCount,
  maxRegenerations,
  code = "",

}) => {
  const [showTooltip, setShowTooltip] = useState("");

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  const pulse = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 4px 6px rgba(0, 0, 0, 0.1)",
      "0 8px 15px rgba(50, 50, 255, 0.3)",
      "0 4px 6px rgba(0, 0, 0, 0.1)",
    ],
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "easeInOut",
    },
  };

  // Tooltip handler
  const handleTooltip = (tip: string) => {
    setShowTooltip(tip);
  };

  // Tooltip timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showTooltip) setShowTooltip("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [showTooltip]);

  console.log(regenerationCount);

  return (
    <div className="space-y-4">
      {/* Main buttons container */}
      <motion.div
        className="flex flex-wrap gap-3 justify-end"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {regenerationCount <= maxRegenerations && onGenerate && (
          <motion.button
            onClick={onGenerate}
            className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all`}
            variants={item}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={!hasCode ? pulse : {}}
            disabled={isLoading}
            onMouseEnter={() => handleTooltip("generate")}
            onMouseLeave={() => handleTooltip("")}
          >
            {hasCode ? (
              <RefreshCw className="h-5 w-5" />
            ) : (
              <motion.div
                animate={{
                  rotate: [0, 360],
                  transition: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            )}
            <span className="text-xl font-bold">
              {isLoading ? `Processing... ` : "Generate Code"}
            </span>
          </motion.button>
        )}
      </motion.div>


      {/* Status indicators */}
      <div className="flex flex-wrap gap-3 justify-end">
        {regenerationCount >= maxRegenerations && hasCode && (
          <motion.div
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 rounded-lg shadow-md border border-yellow-200"
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Info className="h-5 w-5 text-yellow-600" />
            <span className="text-xl font-bold">
              Max regenerations reached ({maxRegenerations}/{maxRegenerations})
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;

"use client";

import { is } from "drizzle-orm";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Code,
  Download,
  Share2,
  Copy,
  ExternalLink,
  FileCode2,
  Sparkles,
  Palette,
  Github,
  Monitor,
  CheckCircle,
  ThumbsUp,
  Award,
  Info,
  Import,
} from "lucide-react";
import { useState, useEffect } from "react";
import { log } from "console";

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
  onSave,
  onGenerate,
  isLoading,
  hasCode,
  regenerationCount,
  maxRegenerations,
  code = "",
  onFormatCode,
  onPreviewCode,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [colorTheme, setColorTheme] = useState("default");
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const success = {
    scale: [1, 1.2, 1],
    rotate: [0, 5, 0, -5, 0],
    transition: { duration: 0.5 },
  };

  // Color themes
  const colorThemes = {
    default: {
      save: "from-green-500 to-green-700 hover:from-green-600 hover:to-green-800",
      generate:
        "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
      download:
        "from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
      copy: "from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800",
      share:
        "from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800",
      format:
        "from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800",
      preview:
        "from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800",
      github: "from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900",
    },
    ocean: {
      save: "from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800",
      generate:
        "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
      download:
        "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      copy: "from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
      share:
        "from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700",
      format: "from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800",
      preview:
        "from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700",
      github:
        "from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950",
    },
    sunset: {
      save: "from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800",
      generate:
        "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
      download:
        "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      copy: "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
      share: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      format:
        "from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700",
      preview:
        "from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600",
      github:
        "from-neutral-600 to-stone-800 hover:from-neutral-700 hover:to-stone-900",
    },
    neon: {
      save: "from-green-400 to-lime-600 hover:from-green-500 hover:to-lime-700",
      generate:
        "from-fuchsia-500 to-purple-700 hover:from-fuchsia-600 hover:to-purple-800",
      download:
        "from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700",
      copy: "from-violet-500 to-purple-700 hover:from-violet-600 hover:to-purple-800",
      share:
        "from-pink-400 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-700",
      format:
        "from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700",
      preview:
        "from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700",
      github: "from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black",
    },
  };

  // Handle download functionality
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/javascript" });
    element.href = URL.createObjectURL(file);
    element.download = "generated-code.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show success animation
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

 
  // Handle share functionality
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Generated Code",
          text: "Check out this code I generated!",
          url: window.location.href,
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  // Handle save with animation
  const handleSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
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

  return (
    <div className="space-y-4">
      {/* Main buttons container */}
      <motion.div
        className="flex flex-wrap gap-3 justify-end"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* {hasCode && (
          <motion.button
            onClick={handleSave}
            className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
              colorThemes[colorTheme as keyof typeof colorThemes].save
            } text-white rounded-lg shadow-lg transition-all`}
            variants={item}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={saveSuccess ? success : {}}
            disabled={isLoading}
            onMouseEnter={() => handleTooltip("save")}
            onMouseLeave={() => handleTooltip("")}
          >
            {saveSuccess ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span className="font-medium">
              {saveSuccess ? "Saved!" : "Save Code"}
            </span>
            {showTooltip === "save" && (
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Save your code changes
              </motion.div>
            )}
          </motion.button>
        )} */}

        {onGenerate && !hasCode && (
          <motion.button
            onClick={onGenerate}
            className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
              colorThemes[colorTheme as keyof typeof colorThemes].generate
            } text-white rounded-lg shadow-lg transition-all`}
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
            <span className="font-medium">
              {isLoading ? `Processing... ` : "Generate Code"}
            </span>
          </motion.button>
        )}
      </motion.div>
      {hasCode && (
        <>
          {/* <div className="flex gap-4">
            
            <motion.button
              onClick={handleDownload}
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
                colorThemes[colorTheme as keyof typeof colorThemes].download
              } text-white rounded-lg shadow-lg transition-all`}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              onMouseEnter={() => handleTooltip("download")}
              onMouseLeave={() => handleTooltip("")}
            >
              {isDownloaded ? (
                <motion.div animate={success}>
                  <FileCode2 className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <Download className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isDownloaded ? "Downloaded!" : "Download"}
              </span>
              {showTooltip === "download" && (
                <motion.div
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Download as .js file
                </motion.div>
              )}
            </motion.button>

            <motion.button
              onClick={handleCopy}
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
                colorThemes[colorTheme as keyof typeof colorThemes].copy
              } text-white rounded-lg shadow-lg transition-all`}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || isCopied}
              onMouseEnter={() => handleTooltip("copy")}
              onMouseLeave={() => handleTooltip("")}
            >
              {isCopied ? (
                <motion.div animate={success}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isCopied ? "Copied!" : "Copy Code"}
              </span>
              {showTooltip === "copy" && (
                <motion.div
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Copy to clipboard
                </motion.div>
              )}
            </motion.button>

            <motion.button
              onClick={handleShare}
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
                colorThemes[colorTheme as keyof typeof colorThemes].share
              } text-white rounded-lg shadow-lg transition-all`}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              onMouseEnter={() => handleTooltip("share")}
              onMouseLeave={() => handleTooltip("")}
            >
              {isShared ? (
                <motion.div animate={success}>
                  <ExternalLink className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <Share2 className="h-5 w-5" />
              )}
              <span className="font-medium">
                {isShared ? "Link Copied!" : "Share"}
              </span>
              {showTooltip === "share" && (
                <motion.div
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Share with others
                </motion.div>
              )}
            </motion.button>
          </div> */}

          {/* New Format Code button */}
          {/* {onFormatCode && (
            <motion.button
              onClick={onFormatCode}
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
                colorThemes[colorTheme as keyof typeof colorThemes].format
              } text-white rounded-lg shadow-lg transition-all`}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              onMouseEnter={() => handleTooltip("format")}
              onMouseLeave={() => handleTooltip("")}
            >
              <Code className="h-5 w-5" />
              <span className="font-medium">Format Code</span>
              {showTooltip === "format" && (
                <motion.div
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Prettify and format code
                </motion.div>
              )}
            </motion.button>
          )} */}

          {/* New Preview Code button */}
          {/* {onPreviewCode && (
            <motion.button
              onClick={onPreviewCode}
              className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${
                colorThemes[colorTheme as keyof typeof colorThemes].preview
              } text-white rounded-lg shadow-lg transition-all`}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              onMouseEnter={() => handleTooltip("preview")}
              onMouseLeave={() => handleTooltip("")}
            >
              <Monitor className="h-5 w-5" />
              <span className="font-medium">Preview</span>
              {showTooltip === "preview" && (
                <motion.div
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  See code in action
                </motion.div>
              )}
            </motion.button>
          )} */}
        </>
      )}

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
            <span className="font-medium text-sm">
              Max regenerations reached ({maxRegenerations}/{maxRegenerations})
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;

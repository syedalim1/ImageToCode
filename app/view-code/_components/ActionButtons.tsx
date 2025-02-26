"use client";
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
  Sparkles
} from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onSave: () => void;
  onGenerate?: () => void;
  isLoading: boolean;
  hasCode: boolean;
  regenerationCount: number;
  maxRegenerations: number;
  code?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onGenerate,
  isLoading,
  hasCode,
  regenerationCount,
  maxRegenerations,
  code = "",
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

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
          title: 'Generated Code',
          text: 'Check out this code I generated!',
          url: window.location.href,
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <motion.div
      className="flex flex-wrap gap-3 justify-end mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {hasCode && (
        <motion.button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-lg shadow-lg transition-all"
          variants={item}
          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          title="Save your code changes"
        >
          <Save className="h-5 w-5" />
          <span className="font-medium">Save Code</span>
        </motion.button>
      )}

      {onGenerate && (!hasCode || regenerationCount < maxRegenerations) && (
        <motion.button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all"
          variants={item}
          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          title={hasCode ? "Generate a new version of the code" : "Generate code from your image"}
        >
          {hasCode ? <RefreshCw className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          <span className="font-medium">
            {hasCode ? `Regenerate (${regenerationCount}/${maxRegenerations})` : "Generate Code"}
          </span>
        </motion.button>
      )}

      {hasCode && (
        <>
          <motion.button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg shadow-lg transition-all"
            variants={item}
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            title="Download the generated code as a JavaScript file"
          >
            {isDownloaded ? (
              <>
                <FileCode2 className="h-5 w-5 text-white" />
                <span className="font-medium">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span className="font-medium">Download</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-lg shadow-lg transition-all"
            variants={item}
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || isCopied}
            title="Copy code to clipboard"
          >
            {isCopied ? (
              <>
                <Copy className="h-5 w-5 text-white" />
                <span className="font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="font-medium">Copy Code</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg shadow-lg transition-all"
            variants={item}
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            title="Share this code with others"
          >
            {isShared ? (
              <>
                <ExternalLink className="h-5 w-5 text-white" />
                <span className="font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share</span>
              </>
            )}
          </motion.button>
        </>
      )}

      {regenerationCount >= maxRegenerations && hasCode && (
        <motion.div
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg shadow-md border border-yellow-200"
          variants={item}
        >
          <span className="font-medium text-sm">Max regenerations reached ({maxRegenerations}/{maxRegenerations})</span>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg shadow-md"
          variants={item}
          animate={{ 
            boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 10px 15px rgba(0, 0, 0, 0.2)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
            transition: { repeat: Infinity, duration: 2 }
          }}
        >
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="font-medium">Processing...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActionButtons;

"use client";
import { motion } from "framer-motion";
import {
  Image,
  Sparkles,
  Code,
  ArrowLeft,
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
  return (
    <motion.header
      className="mb-8 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-xl shadow-lg border border-white/20 dark:border-gray-800/40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400 opacity-10 rounded-full blur-xl"></div>
      </div>
      
      {/* Animated dots */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-40"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center mb-6 space-x-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-inner"
          >
            <Code className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200 flex items-center space-x-2">
            <span>Code Generation Studio</span>
          </h1>
        </div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <p className="text-white/90 dark:text-gray-200 max-w-2xl text-base leading-relaxed backdrop-blur-sm bg-white/10 p-3 rounded-lg shadow-inner">
              {"Transform your ideas into executable code with AI-powered generation"}
            </p>
            <motion.div 
              className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="flex space-x-3">
            {imageUrl && (
              <motion.button
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md group"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image className="h-5 w-5 mr-2 text-white" />
                </motion.div>
                <span className="font-medium">View Image</span>
              </motion.button>
            )}

            <motion.div
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent w-1/2 h-full transform -skew-x-12 animate-shimmer"></div>
              <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
              <span className="font-medium">AI Generated</span>
            </motion.div>
          </div>
        </motion.div>

        {onBackClick && (
          <motion.button
            onClick={onBackClick}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default CodeHeader;

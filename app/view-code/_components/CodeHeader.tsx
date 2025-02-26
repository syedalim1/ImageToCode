"use client";
import { motion } from "framer-motion";
import { Code, Download, Copy, Image, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CodeHeaderProps {
  imageUrl?: string;
  description?: string;
}

const CodeHeader: React.FC<CodeHeaderProps> = ({ imageUrl, description }) => {
  return (
    <motion.header 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-2">
        <Link href="/dashboard" className="mr-2 text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <Code className="h-8 w-8 mr-2 text-blue-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
            Code Generation Studio
          </span>
        </h1>
      </div>
      
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          {description || "Transform your ideas into executable code with AI-powered generation"}
        </p>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          {imageUrl && (
            <motion.button 
              className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="h-4 w-4 mr-1" />
              <span className="text-sm">View Image</span>
            </motion.button>
          )}
          <motion.div
            className="flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-sm">AI Generated</span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />
    </motion.header>
  );
};

export default CodeHeader;

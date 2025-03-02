"use client";

import { motion } from "framer-motion";
import { Brain, Workflow } from "lucide-react";

export const ProductPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className="mt-8 rounded-3xl shadow-2xl overflow-hidden border-8 border-white mx-auto max-w-5xl relative"
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="bg-gray-900 p-6 h-[450px] flex items-center justify-center relative">
        <ProductPreviewContent />
      </div>
    </motion.div>
  );
};

const ProductPreviewContent = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-auto h-full flex items-center justify-center"></div>
    </div>
  );
};

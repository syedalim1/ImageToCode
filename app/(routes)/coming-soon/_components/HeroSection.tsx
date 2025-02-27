"use client";

import { motion } from "framer-motion";
import { Bell, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block mb-4"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 mr-2"></span>
          Coming Soon
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center justify-center">
          <Zap className="h-10 w-10 md:h-14 md:w-14 mr-3 text-indigo-600" />
          CODENOVATECH
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
            size="lg"
          >
            Get Notified
            <Bell className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="bg-white text-purple-600 border-2 border-purple-200 px-6 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
            size="lg"
          >
            Learn More
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}; 
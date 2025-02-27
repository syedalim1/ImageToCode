"use client";

import { motion } from "framer-motion";
import { Clock, Zap, Info } from "lucide-react";

interface TabNavigationProps {
  activeTab: "packages" | "history" | "explainer";
  setActiveTab: (tab: "packages" | "history" | "explainer") => void;
}

export const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-gray-100 rounded-full p-1">
        <motion.button
          onClick={() => setActiveTab("packages")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
            activeTab === "packages"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-4 w-4 mr-1" />
          Buy Credits
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
            activeTab === "history"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Clock className="h-4 w-4 mr-1" />
          History
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("explainer")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
            activeTab === "explainer"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info className="h-4 w-4 mr-1" />
          How Credits Work
        </motion.button>
      </div>
    </div>
  );
}; 
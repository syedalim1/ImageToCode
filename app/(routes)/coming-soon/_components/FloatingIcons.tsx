"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";

export const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute bottom-[30%] left-[20%] w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Server className="w-7 h-7 text-blue-600" />
      </motion.div>
    </div>
  );
}; 
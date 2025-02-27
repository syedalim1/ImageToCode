"use client";
import { Sparkles, Zap, Code2, Palette } from "lucide-react";
import { motion } from "framer-motion";

const HeaderSection = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-pink-400 opacity-20 blur-3xl"></div>
      </motion.div>

      <div className="relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Image2Code Studio
              </h1>
            </div>
            <p className="text-blue-100 max-w-xl">
              Transform your visual designs into clean, production-ready code with AI-powered generation
            </p>
          </div>

          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <Code2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm">Multiple Frameworks</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <Palette className="h-5 w-5 text-pink-300" />
              <span className="text-sm">Modern Design</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeaderSection;

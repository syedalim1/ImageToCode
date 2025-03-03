// File: HeroTitle.jsx

import { motion } from "framer-motion";

export default function HeroTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-8 leading-tight tracking-tight"
      style={{ willChange: "transform" }}
    >
      Turn Designs into Code
      <br />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative"
        style={{ willChange: "transform" }}
      >
        in Seconds
        <motion.span
          className="absolute -right-16 -top-1 text-2xl"
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.3, duration: 0.5, type: "spring" }}
          style={{ willChange: "transform" }}
        >
          ✨
        </motion.span>
      </motion.span>
    </motion.h1>
  );
}

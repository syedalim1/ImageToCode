// File: AbstractShapes.jsx
import { memo } from "react";
import { motion } from "framer-motion";

const AbstractShapes = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Larger gradient circle */}
      <div
        className="absolute transform -translate-x-64 -translate-y-64 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"
        style={{ willChange: "transform" }}
      />

      {/* Small decorative elements */}
      <motion.div
        className="absolute transform translate-x-32 translate-y-16 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg rotate-12 opacity-40"
        animate={{
          y: [0, -15, 0],
          rotate: [12, 45, 12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      />

      <motion.div
        className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50 blur-md"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* Code symbols background */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-8xl font-mono text-purple-200/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 2 }}
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {"{"}
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-8xl font-mono text-blue-200/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 2 }}
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {"}"}
      </motion.div>
    </div>
  );
});

AbstractShapes.displayName = "AbstractShapes";

export default AbstractShapes;

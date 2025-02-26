"use client";
import { motion } from "framer-motion";

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: ["-10%", "10%"],
            x: ["-5%", "5%"],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          style={{
            width: `${Math.random() * 100 + 20}px`,
            height: `${Math.random() * 100 + 20}px`,
            background: `radial-gradient(circle, rgba(${Math.floor(
              Math.random() * 100 + 100
            )}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
              Math.random() * 200 + 55
            )}, 0.3) 0%, rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
              Math.random() * 100 + 100
            )}, ${Math.floor(Math.random() * 200 + 55)}, 0) 70%)`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;

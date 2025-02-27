"use client";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, BoltIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface HomeCreditBalanceCardProps {
  balance: number;
}

const HomeCreditBalanceCard: React.FC<HomeCreditBalanceCardProps> = ({ balance }) => {
  const [showParticles, setShowParticles] = useState(false);
  const [animateValue, setAnimateValue] = useState(0);
  
  // Animate the credit value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateValue(balance);
    }, 500);
    return () => clearTimeout(timer);
  }, [balance]);
  
  // Show particles effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate percentage for progress bar
  const percentage = Math.min(100, (balance / 100) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <motion.h3 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-purple-100"
          >
            Credit Balance
          </motion.h3>
          <div className="relative">
            <motion.p 
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Animated counter */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.4
                }}
              >
                {animateValue}
              </motion.span>
            </motion.p>
            
            {/* Particle effects */}
            <AnimatePresence>
              {showParticles && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 100 - 50}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -20],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                      }}
                    >
                      <SparklesIcon className="h-3 w-3 text-yellow-200" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <motion.div 
          className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/10"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.5
          }}
        >
          <SparklesIcon className="h-6 w-6 text-white" />
        </motion.div>
      </div>
      
      {/* Animated progress bar */}
      <div className="h-3 bg-white/20 rounded-full mb-2 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 to-white rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.6
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 3,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-purple-100 mb-4">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          0
        </motion.span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center"
        >
          <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
          <span>100</span>
        </motion.div>
      </div>
      
      <motion.button
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-2 w-full py-2.5 bg-white text-indigo-600 rounded-lg font-medium flex items-center justify-center shadow-lg"
      >
        <BoltIcon className="h-4 w-4 mr-2" />
        Buy More Credits
      </motion.button>
    </motion.div>
  );
};

export default HomeCreditBalanceCard;

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, SparklesIcon, BoltIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface PricingCardProps {
  title: string;
  price: number;
  originalPrice?: number | string;
  credits: string;
  features: string[];
  popular: boolean;
  cta: string;
  save?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  originalPrice,
  credits,
  features,
  popular,
  cta,
  save,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract the numeric value from credits string for animation
  const creditsValue = parseInt(credits.match(/\d+/)?.[0] || "0");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        scale: 1.02,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`rounded-2xl overflow-hidden relative ${
        popular
          ? "bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-600 text-white shadow-xl border-4 border-white"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {/* Background decorative elements */}
      {popular && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pricingGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pricingGrid)" />
            </svg>
          </div>
        </>
      )}
      
      {popular && (
        <motion.div 
          className="bg-indigo-700 text-white text-center py-2 text-sm font-semibold relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
          <div className="relative z-10 flex items-center justify-center">
            <SparklesIcon className="h-4 w-4 mr-1" />
            MOST POPULAR
          </div>
        </motion.div>
      )}
      
      <div className="p-8 relative z-10">
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl font-bold mb-4 ${
            popular ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </motion.h3>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {originalPrice && (
            <span
              className={`text-2xl font-bold line-through mr-2 ${
                popular ? "text-indigo-200" : "text-gray-500"
              }`}
            >
              ₹{originalPrice}
            </span>
          )}
          <motion.span 
            className="text-4xl font-bold relative"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            ₹{price}
            
            {/* Sparkle animation on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  className="absolute -top-2 -right-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <SparklesIcon className={`h-5 w-5 ${popular ? "text-yellow-300" : "text-yellow-500"}`} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        </motion.div>

        {/* Display Credits with animation */}
        <motion.div 
          className="mb-6 relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`${
            popular 
              ? "bg-white/10 backdrop-blur-sm border border-white/20" 
              : "bg-indigo-50 border border-indigo-100"
            } rounded-lg px-4 py-3`}
          >
            <div className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <BoltIcon className={`h-5 w-5 mr-2 ${
                  popular ? "text-yellow-300" : "text-indigo-500"
                }`} />
              </motion.div>
              <span
                className={`${
                  popular ? "text-white" : "text-indigo-700"
                } text-lg font-medium`}
              >
                {credits}
              </span>
            </div>
            
            {/* Credit value visualization */}
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${popular ? "bg-white" : "bg-indigo-500"} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (creditsValue / 200) * 100)}%` }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {save && (
          <motion.div 
            className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.6
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: -5
            }}
          >
            {save}
          </motion.div>
        )}

        <motion.ul 
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {features.map((feature: string, index: number) => (
            <motion.li 
              key={index} 
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + (index * 0.1) }}
              whileHover={{ x: 5 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    repeatDelay: 5 + index
                  }}
                  className={`absolute inset-0 ${
                    popular ? "bg-indigo-300" : "bg-green-400"
                  } rounded-full opacity-30 blur-sm`}
                ></motion.div>
                <CheckCircleIcon
                  className={`h-5 w-5 mr-2 flex-shrink-0 relative z-10 ${
                    popular ? "text-indigo-200" : "text-green-500"
                  }`}
                />
              </div>
              <span
                className={`${popular ? "text-indigo-100" : "text-gray-600"}`}
              >
                {feature}
              </span>
            </motion.li>
          ))}
        </motion.ul>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center ${
            popular 
              ? "bg-white text-indigo-600 shadow-lg" 
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
          }`}
        >
          <BoltIcon className="h-4 w-4 mr-2" />
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PricingCard;

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Zap, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface CreditBalanceCardProps {
  onViewHistory: () => void;
  onBuyCredits: () => void;
}

const CreditBalanceCard: React.FC<CreditBalanceCardProps> = ({
  onViewHistory,
  onBuyCredits,
}) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSparkle, setShowSparkle] = useState<boolean>(false);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user?.emailAddresses) {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/user?email=${user.emailAddresses[0].emailAddress}`);
          setCredits(response.data.credits);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching credits:", error);
          setIsLoading(false);
        }
      }
    };

    fetchCredits();
  }, [user?.emailAddresses]);

  // Trigger sparkle effect every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 2000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  // Calculate how many pages can be generated
  const pagesCanGenerate = Math.floor(credits / 10);

  // Particle animation variants
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-10 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <motion.h2 
              className="text-2xl font-bold mb-2 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CreditCard className="mr-2 h-6 w-6" />
              Your Credit Balance
            </motion.h2>
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Credits are used to generate designs. Each page requires 10
              credits to generate.
            </motion.p>
          </div>

          <div className="flex items-center">
            <div className="relative">
              {/* Credit display with animated container */}
              <motion.div 
                className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-5xl font-bold flex items-center">
                  {/* Animated zap icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Zap className="mr-3 h-10 w-10 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  </motion.div>
                  
                  {/* Animated counter */}
                  {isLoading ? (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-12 w-16 bg-white/20 rounded-md"
                    />
                  ) : (
                    <motion.span
                      key={credits}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 15 
                      }}
                      className="relative"
                    >
                      {credits}
                      
                      {/* Sparkle effect */}
                      <AnimatePresence>
                        {showSparkle && (
                          <>
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                  top: `${Math.random() * 100 - 50}%`,
                                  left: `${Math.random() * 100 - 50}%`,
                                }}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={particleVariants}
                                transition={{
                                  duration: 0.8,
                                  delay: i * 0.05,
                                }}
                              >
                                <Sparkles className="h-3 w-3 text-yellow-300" />
                              </motion.div>
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-blue-100 mt-1 text-center">Available Credits</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              What you can do
            </h3>
            <div className="space-y-3">
              <motion.div 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                    className="absolute inset-0 bg-green-400 rounded-full opacity-30 blur-sm"
                  ></motion.div>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0 relative z-10" />
                </div>
                <p className="text-gray-600">
                  Generate <span className="font-semibold text-green-600">{pagesCanGenerate}</span> more pages
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 7 }}
                    className="absolute inset-0 bg-green-400 rounded-full opacity-30 blur-sm"
                  ></motion.div>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0 relative z-10" />
                </div>
                <p className="text-gray-600">Access all available AI models</p>
              </motion.div>
              
              <motion.div 
                className="flex items-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 9 }}
                    className="absolute inset-0 bg-green-400 rounded-full opacity-30 blur-sm"
                  ></motion.div>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0 relative z-10" />
                </div>
                <p className="text-gray-600">
                  Edit and customize generated code
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
              Need more credits?
            </h3>
            <p className="text-gray-600 mb-4">
              Purchase additional credits to continue creating amazing designs
              with our AI.
            </p>
            <div className="flex gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onBuyCredits}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Buy Credits
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={onViewHistory}
                  className="border-gray-300 hover:border-gray-400 shadow-sm hover:shadow transition-all duration-300"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </motion.div>
              
             
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditBalanceCard;

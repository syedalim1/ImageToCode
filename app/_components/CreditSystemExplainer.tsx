"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  DollarSign,
  Sparkles,
  Info,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import Constants from "@/data/Constants";

const CreditSystemExplainer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [showSparkles, setShowSparkles] = useState<boolean>(false);

  // Auto-rotate through sections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Periodically show sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Credit packages from Constants
  const creditPackages = Constants.CREDIT_COSTS.PRICING_PLANS;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="explainerGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#explainerGrid)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center">
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="mr-4 bg-white/20 p-3 rounded-full backdrop-blur-sm"
          >
            <Info className="h-8 w-8 text-white" />
          </motion.div>

          <div>
            <motion.h2
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Understanding the Credit System
            </motion.h2>
            <motion.p
              className="text-blue-100 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Here's how our credit system works
            </motion.p>
          </div>
        </div>

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 5,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-full p-1 inline-flex">
            {["Usage Costs"].map((tab, index) => (
              <motion.button
                key={tab}
                onClick={() => setActiveSection(index)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                  activeSection === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {activeSection === index && (
                  <AnimatePresence>
                    {showSparkles && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Usage Costs Section */}
        <AnimatePresence mode="wait">
          {activeSection === 0 && (
            <motion.div
              key="usage-costs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Normal Mode */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 relative overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                  <div className="flex items-start">
                    <motion.div
                      className="mr-4 bg-blue-100 p-3 rounded-full"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <Zap className="h-6 w-6 text-blue-600" />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-2">
                        Normal Mode
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Standard image-to-code conversion with basic features
                      </p>

                      <div className="flex items-center">
                        <motion.div
                          className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mr-4"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 5,
                          }}
                        >
                          <span className="text-2xl font-bold text-blue-600">
                            {Constants.CREDIT_COSTS.NORMAL_MODE}
                          </span>
                        </motion.div>
                        <div>
                          <p className="text-lg font-semibold text-blue-800">
                            Credits per page
                          </p>
                          <p className="text-blue-600 text-sm">
                            Efficient and economical
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Expert Mode */}
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 relative overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                  <div className="flex items-start">
                    <motion.div
                      className="mr-4 bg-purple-100 p-3 rounded-full"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                    >
                      <Star className="h-6 w-6 text-purple-600" />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-purple-800 mb-2">
                        Expert Mode
                      </h3>
                      <p className="text-purple-700 mb-4">
                        Advanced conversion with premium features and
                        optimizations
                      </p>

                      <div className="flex items-center">
                        <motion.div
                          className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mr-4"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 5,
                          }}
                        >
                          <span className="text-2xl font-bold text-purple-600">
                            {Constants.CREDIT_COSTS.EXPERT_MODE}
                          </span>
                        </motion.div>
                        <div>
                          <p className="text-lg font-semibold text-purple-800">
                            Credits per page
                          </p>
                          <p className="text-purple-600 text-sm">
                            Professional quality output
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600 italic">
                  Choose the mode that best fits your project requirements and
                  budget
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Benefits Section */}
          {activeSection === 2 && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  {
                    title: "Flexible Usage",
                    description:
                      "Use credits whenever you need them, with no expiration date",
                    icon: Zap,
                    color: "blue",
                  },
                  {
                    title: "Cost Effective",
                    description:
                      "Purchase larger packages for better value per credit",
                    icon: DollarSign,
                    color: "green",
                  },
                  {
                    title: "Premium Features",
                    description:
                      "Access advanced features and optimizations with Expert Mode",
                    icon: Star,
                    color: "purple",
                  },
                  {
                    title: "Transparent Pricing",
                    description:
                      "Clear credit costs with no hidden fees or subscriptions",
                    icon: CheckCircle,
                    color: "pink",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={`benefit-${index}`}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    className={`p-6 rounded-xl bg-gradient-to-br ${
                      benefit.color === "blue"
                        ? "from-blue-50 to-indigo-50 border border-blue-100"
                        : benefit.color === "green"
                        ? "from-green-50 to-emerald-50 border border-green-100"
                        : benefit.color === "purple"
                        ? "from-purple-50 to-indigo-50 border border-purple-100"
                        : "from-pink-50 to-rose-50 border border-pink-100"
                    }`}
                  >
                    <div className="flex">
                      <motion.div
                        className={`mr-4 p-3 rounded-full ${
                          benefit.color === "blue"
                            ? "bg-blue-100"
                            : benefit.color === "green"
                            ? "bg-green-100"
                            : benefit.color === "purple"
                            ? "bg-purple-100"
                            : "bg-pink-100"
                        }`}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3 + index,
                        }}
                      >
                        <benefit.icon
                          className={`h-6 w-6 ${
                            benefit.color === "blue"
                              ? "text-blue-600"
                              : benefit.color === "green"
                              ? "text-green-600"
                              : benefit.color === "purple"
                              ? "text-purple-600"
                              : "text-pink-600"
                          }`}
                        />
                      </motion.div>

                      <div>
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            benefit.color === "blue"
                              ? "text-blue-800"
                              : benefit.color === "green"
                              ? "text-green-800"
                              : benefit.color === "purple"
                              ? "text-purple-800"
                              : "text-pink-800"
                          }`}
                        >
                          {benefit.title}
                        </h3>
                        <p
                          className={
                            benefit.color === "blue"
                              ? "text-blue-700"
                              : benefit.color === "green"
                              ? "text-green-700"
                              : benefit.color === "purple"
                              ? "text-purple-700"
                              : "text-pink-700"
                          }
                        >
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="ctaGrid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#ctaGrid)" />
                  </svg>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Ready to get started?
                    </h3>
                    <p className="text-indigo-100">
                      Purchase credits now and start creating amazing designs
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center shadow-lg"
                  >
                    Buy Credits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>

                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CreditSystemExplainer;

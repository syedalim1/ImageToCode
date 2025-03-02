"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import Authentication from "./Authentication";
import { motion, AnimatePresence, Variant, Variants } from "framer-motion";
import {
  X,
  Sparkles,
  Zap,
  Home,
  Paintbrush,
  CircleDollarSign,
  Star,
  Bookmark,
  Flame,
  Save,
  Crown,
  Gift,
  Rocket,
  Heart,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);

  // Get sidebar context
  const sidebar = useSidebar();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // More frequent and vibrant sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 3000);
    }, 6000); // More frequent sparkles

    return () => clearInterval(interval);
  }, []);

  // Handle save functionality
  const handleSave = () => {
    // Simulate save operation
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Animation variants
  const pulseAnimation: Variants = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const zapAnimation: Variants = {
    pulse: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -5, 0],
      filter: [
        "drop-shadow(0 0 2px #4f46e5)",
        "drop-shadow(0 0 8px #4f46e5)",
        "drop-shadow(0 0 2px #4f46e5)",
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const saveAnimation: Variants = {
    success: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, 0],
      transition: {
        duration: 0.7,
      },
    },
  };

  const floatAnimation: Variants = {
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // Rainbow gradient colors for animated background
  const rainbowGradient = scrolled
    ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 backdrop-blur-lg"
    : "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${rainbowGradient} ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Decorative elements - top rainbow line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"></div>
      <div className="flex items-center justify-between w-full px-4 py-3 relative">
        {/* Left section with menu and logo on mobile */}
        <div className="flex items-center space-x-3">
          {/* Menu button for sidebar toggle with enhanced hover effect */}
          {isMobile && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <SidebarTrigger className="h-10 w-10 text-indigo-700 hover:bg-indigo-100 rounded-full p-2 hover:text-indigo-900 transition-all duration-300" />
            </motion.div>
          )}

          {/* Enhanced Logo on mobile with stronger glow effect */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="text-lg font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                <motion.div variants={zapAnimation} animate="pulse">
                  <Rocket className="h-5 w-5 mr-1.5 text-purple-600 drop-shadow-md" />
                </motion.div>
                CodeNovaTech
              </div>
              <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10"></div>
              <div className="absolute -inset-3 bg-blue-400/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Center logo with 3D effect - visible on larger screens */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
          onMouseEnter={() => setHoverEffect(true)}
          onMouseLeave={() => setHoverEffect(false)}
        >
          <div className="relative">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center drop-shadow-sm">
              <motion.div variants={zapAnimation} animate="pulse">
                <Rocket className="h-7 w-7 mr-2 text-indigo-600 drop-shadow-lg" />
              </motion.div>
              CodeNovaTech
              <motion.div
                variants={floatAnimation}
                animate="float"
                className="ml-2"
              >
                <Crown className="h-5 w-5 text-amber-500" />
              </motion.div>
            </div>

            {/* Multiple layered glow effects behind logo */}
            <div className="absolute -inset-2 bg-indigo-400/30 rounded-full blur-xl -z-10"></div>
            <div className="absolute -inset-3 bg-purple-400/20 rounded-full blur-2xl -z-20 animate-pulse"></div>
            <div className="absolute -inset-4 bg-pink-400/10 rounded-full blur-3xl -z-30"></div>

            {/* Enhanced sparkle effects with more animation */}
            <AnimatePresence>
              {(showSparkles || hoverEffect) && (
                <>
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={`header-sparkle-${i}`}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 150 - 75}%`,
                        left: `${Math.random() * 150 - 25}%`,
                        zIndex: 20,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, Math.random() * 0.5 + 0.7, 0],
                        rotate: [0, Math.random() * 90 - 45],
                      }}
                      transition={{
                        duration: Math.random() * 1 + 1,
                        delay: i * 0.1,
                        times: [0, 0.5, 1],
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      {i % 5 === 0 ? (
                        <Star className="h-4 w-4 text-yellow-400" />
                      ) : i % 5 === 1 ? (
                        <Sparkles className="h-4 w-4 text-purple-400" />
                      ) : i % 5 === 2 ? (
                        <Heart className="h-4 w-4 text-pink-400" />
                      ) : i % 5 === 3 ? (
                        <Flame className="h-4 w-4 text-orange-400" />
                      ) : (
                        <Gift className="h-4 w-4 text-green-400" />
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right section with enhanced animated buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Heart/favorite button */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 hover:text-pink-900 transition-all duration-300"
            >
              <Heart className="h-5 w-5" />
              <div className="absolute inset-0 bg-pink-400/10 rounded-full animate-ping opacity-75"></div>
            </Button>
          </motion.div>

          {/* Save button with enhanced animation */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            animate={saveSuccess ? "success" : ""}
            variants={saveAnimation}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full transition-all duration-300 ${
                saveSuccess
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                  : "bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-700 hover:text-blue-900"
              }`}
              onClick={handleSave}
            >
              <Save className="h-5 w-5" />
              {saveSuccess && (
                <motion.div
                  className="absolute inset-0 bg-green-400/20 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: [1, 0] }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </Button>
          </motion.div>

          {/* Bookmarks button with glow */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:text-amber-900 transition-all duration-300"
            >
              <Bookmark className="h-5 w-5" />
              <div className="absolute inset-0 bg-amber-400/10 rounded-full"></div>
            </Button>
          </motion.div>

          {/* Enhanced Authentication component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Authentication />
          </motion.div>
        </div>
      </div>

      {/* Enhanced Navigation Menu with active states and more colorful gradients */}
      {!isMobile && (
        <div className="px-4 pb-3 border-t border-blue-100">
          <div className="flex justify-between items-center py-2 max-w-3xl mx-auto">
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 relative ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-indigo-200 to-blue-200 text-indigo-800 font-medium shadow-sm"
                  : "hover:bg-blue-50 text-gray-700 hover:scale-105"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <motion.div
                variants={pulseAnimation}
                animate={activeTab === "dashboard" ? "pulse" : ""}
              >
                <Home
                  className={`h-5 w-5 mr-2 ${
                    activeTab === "dashboard"
                      ? "text-indigo-600"
                      : "text-blue-500"
                  }`}
                />
              </motion.div>
              <span className="font-medium">Dashboard</span>
              {activeTab === "dashboard" && (
                <motion.div
                  className="absolute inset-0 border-2 border-indigo-400/30 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="activeTab"
                />
              )}
            </Link>

            <Link
              href="/designs"
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 relative ${
                activeTab === "designs"
                  ? "bg-gradient-to-r from-purple-200 to-fuchsia-200 text-purple-800 font-medium shadow-sm"
                  : "hover:bg-purple-50 text-gray-700 hover:scale-105"
              }`}
              onClick={() => setActiveTab("designs")}
            >
              <motion.div
                variants={pulseAnimation}
                animate={activeTab === "designs" ? "pulse" : ""}
              >
                <PenTool
                  className={`h-5 w-5 mr-2 ${
                    activeTab === "designs"
                      ? "text-purple-600"
                      : "text-purple-500"
                  }`}
                />
              </motion.div>
              <span className="font-medium">Designs</span>
              {activeTab === "designs" && (
                <motion.div
                  className="absolute inset-0 border-2 border-purple-400/30 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="activeTab"
                />
              )}
            </Link>

            <Link
              href="/credits"
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 relative ${
                activeTab === "credits"
                  ? "bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800 font-medium shadow-sm"
                  : "hover:bg-amber-50 text-gray-700 hover:scale-105"
              }`}
              onClick={() => setActiveTab("credits")}
            >
              <motion.div
                variants={pulseAnimation}
                animate={activeTab === "credits" ? "pulse" : ""}
              >
                <CircleDollarSign
                  className={`h-5 w-5 mr-2 ${
                    activeTab === "credits"
                      ? "text-amber-600"
                      : "text-amber-500"
                  }`}
                />
              </motion.div>
              <span className="font-medium">Credits</span>
              {activeTab === "credits" && (
                <motion.div
                  className="absolute inset-0 border-2 border-amber-400/30 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="activeTab"
                />
              )}
            </Link>
          </div>
        </div>
      )}
      {/* Enhanced animated border with multi-layered rainbow gradient effect */}
      <div className="relative h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: scrolled ? 1 : 0.8,
          }}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-sm"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: 1,
            opacity: scrolled ? 0.5 : 0.3,
          }}
          transition={{ delay: 0.3 }}
        />

        {/* Moving light effect on the border */}
        <motion.div
          className="absolute bottom-0 h-full w-20 bg-white blur-md"
          initial={{ left: "-10%", opacity: 0.5 }}
          animate={{
            left: ["0%", "100%"],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.header>
  );
}

export default AppHeader;

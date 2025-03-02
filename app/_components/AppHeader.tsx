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
  Image,
  Code,
  Cpu,
  Layers,
  Wand2,
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
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

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

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'features', label: 'Features', icon: Wand2, color: 'from-purple-500 to-pink-500' },
    { id: 'pricing', label: 'Pricing', icon: CircleDollarSign, color: 'from-amber-500 to-orange-500' },
    { id: 'examples', label: 'Examples', icon: Layers, color: 'from-emerald-500 to-teal-500' },
  ];

  // Enhanced rainbow gradient for animated background
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
      {/* Decorative elements - top rainbow line with animation */}
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-white opacity-30"
          animate={{
            x: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </div>

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

          {/* Enhanced Logo with stronger glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <motion.div variants={zapAnimation} animate="pulse">
                <Image className="h-6 w-6 mr-1.5 text-purple-600 drop-shadow-md" />
              </motion.div>
              <span className="hidden sm:inline">ImageToCode</span>
              <span className="sm:hidden">I2C</span>
            </div>
            <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10"></div>
            <div className="absolute -inset-3 bg-blue-400/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
          </motion.div>
        </div>

        {/* Center navigation - visible on larger screens */}
        <nav className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
          <AnimatePresence>
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredNavItem(item.id)}
                onMouseLeave={() => setHoveredNavItem(null)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`#${item.id}`}>
                  <motion.div
                    className={`px-4 py-2 rounded-full mx-1 font-medium flex items-center relative z-10 ${
                      activeTab === item.id ? 'text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className={`h-4 w-4 mr-1.5 ${hoveredNavItem === item.id ? 'text-white' : ''}`} />
                    <span>{item.label}</span>
                    
                    {/* Background gradient that appears on hover */}
                    {hoveredNavItem === item.id && (
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} -z-10`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                </Link>
                
                {/* Animated indicator for active tab */}
                {activeTab === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>

        {/* Right section with authentication */}
        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 mr-2"
              onClick={handleSave}
            >
              <motion.div
                variants={saveAnimation}
                animate={saveSuccess ? "success" : ""}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Try Now</span>
              </motion.div>
            </Button>
          </motion.div>

          {/* Authentication component */}
          <Authentication />
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMobile && (
          <motion.div 
            className="flex overflow-x-auto scrollbar-hide py-2 px-4 space-x-2 bg-white/80 backdrop-blur-sm border-t border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Link href={`#${item.id}`}>
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                    activeTab === item.id 
                      ? `bg-gradient-to-r ${item.color} text-white` 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <item.icon className="h-3.5 w-3.5 mr-1.5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default AppHeader;

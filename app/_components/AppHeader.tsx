"use client";

import React, { useState, useEffect } from "react";
import Authentication from "./Authentication";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
  Menu,
  ChevronRight,
  Bell,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

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
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        sidebarOpen &&
        target &&
        !target.closest(".mobile-sidebar") &&
        !target.closest(".menu-button")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Handle save functionality
  const handleSave = () => {
    // Simulate save operation
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Animation variants
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  const zapAnimation = {
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
        repeatType: "loop" as const,
      },
    },
  };

  const saveAnimation = {
    success: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, 0],
      transition: {
        duration: 0.7,
      },
    },
  };

  const floatAnimation = {
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
    },

    {
      id: "credits",
      label: "Pricing",
      icon: CircleDollarSign,
      color: "from-amber-500 to-orange-500",
    },
  ];

  // Additional items for mobile sidebar
  const sidebarItems = [
    ...navItems,
    {
      id: "designs",
      label: "My Projects",
      icon: PenTool,
      color: "from-cyan-500 to-blue-500",
    },

    {
      id: "profile",
      label: "Settings",
      icon: Settings,
      color: "from-gray-600 to-gray-800",
    },
  ];

  // Enhanced rainbow gradient for animated background
  const rainbowGradient = scrolled
    ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 backdrop-blur-lg"
    : "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50";

  return (
    <>
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
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full px-4 py-3 relative">
          {/* Left section with logo and mobile menu button */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md menu-button"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>

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
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onHoverStart={() => setHoveredNavItem(item.id)}
                onHoverEnd={() => setHoveredNavItem(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/${item.id}`}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === item.id
                      ? "text-white bg-gradient-to-r " + item.color
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
        kk          </nav>

          {/* Right section with actions */}
          <div className="flex items-center space-x-2">
            {/* Save button with success animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={saveAnimation}
              animate={saveSuccess ? "success" : undefined}
            >
              <Button
                onClick={handleSave}
                size="sm"
                className={`hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-md ${
                  saveSuccess ? "bg-green-500" : ""
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </motion.div>

            {/* Authentication component */}
            <Authentication />
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 z-50 rounded-r-2xl shadow-2xl overflow-hidden mobile-sidebar md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-purple-700">
                  <div className="flex items-center">
                    <Image className="h-6 w-6 mr-2 text-white" />
                    <span className="text-xl font-bold text-white">
                      ImageToCode
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-purple-800/50"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>
                </div>

                {/* User profile section */}
                <div className="flex items-center space-x-3 p-4 border-b border-purple-700">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Welcome back!</p>
                    <p className="text-purple-200 text-sm">Pro Member</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="flex-grow overflow-y-auto py-2 space-y-1">
                  {sidebarItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/${item.id}`}
                        className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg text-sm font-medium 
                          ${
                            activeTab === item.id
                              ? `bg-gradient-to-r ${item.color} text-white`
                              : "text-white hover:bg-white/10"
                          }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-white/10 mr-3`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating graphics elements */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-16 right-8 z-30 pointer-events-none"
          >
            <motion.div
              variants={floatAnimation}
              animate="float"
              className="text-purple-500"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AppHeader;

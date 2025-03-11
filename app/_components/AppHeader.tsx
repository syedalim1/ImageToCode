"use client";

import React, { useState, useEffect, useRef } from "react";
import Authentication from "./Authentication";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  X,
  Sparkles,
  Home,
  CircleDollarSign,
  PenTool,
  Image,
  Cpu,
  Menu,
  ChevronRight,
  Bell,
  Settings,
  Star,
  Crown,
  Zap,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  
  const logoControls = useAnimation();
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Enhanced responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Enhanced scroll effect with hide/show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY.current + 20 && currentScrollY > 100) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
      setScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // More dynamic and engaging sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 3000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // More elaborate confetti effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target;
      if (
        sidebarOpen &&
        target &&
        !(target as HTMLElement).closest(".mobile-sidebar") &&
        !(target as HTMLElement).closest(".menu-button")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Logo animation effect
  useEffect(() => {
    if (logoHovered) {
      logoControls.start({
        rotateY: [0, 180, 360],
        scale: [1, 1.2, 1],
        transition: { duration: 1.5 }
      });
    }
  }, [logoHovered, logoControls]);

  // Enhanced animation variants
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  const zapAnimation = {
    pulse: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, 0],
      filter: ["blur(0)", "blur(2px)", "blur(0)"],
      transition: {
        duration: 0.5,
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

  const shimmerAnimation = {
    shimmer: {
      x: ["0%", "100%"],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const bounceAnimation = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // Enhanced sidebar animations
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      },
    },
  };

  const sidebarItemVariants = {
    open: {
      x: 0,
      opacity: 1,
    },
    closed: {
      x: -20,
      opacity: 0,
    }
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

  // Enhanced nav items with more creative icons and colors
  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      hoverEffect: "hover:shadow-blue-300/50"
    },
    {
      id: "designs",
      label: "My Projects",
      icon: Layers,
      color: "from-violet-500 to-purple-600",
      hoverEffect: "hover:shadow-purple-300/50"
    },
    {
      id: "credits",
      label: "Pricing",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      hoverEffect: "hover:shadow-amber-300/50"
    },
    {
      id: "profile",
      label: "Settings",
      icon: Settings,
      color: "from-gray-600 to-gray-800",
      hoverEffect: "hover:shadow-gray-300/50"
    },
  ];

  // Additional items for mobile sidebar
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "designs",
      label: "My Projects",
      icon: Layers,
      color: "from-violet-500 to-purple-600",
    },
    {
      id: "credits",
      label: "Pricing",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "ai",
      label: "AI Features",
      icon: Cpu,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Star,
      color: "from-yellow-500 to-amber-600",
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
    ? "bg-gradient-to-r from-indigo-100/90 via-purple-100/90 to-pink-100/90 backdrop-blur-lg"
    : "bg-gradient-to-r from-white/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-sm";

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: headerVisible ? 0 : -100, 
          opacity: headerVisible ? 1 : 0 
        }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${rainbowGradient} ${
          scrolled ? "shadow-xl shadow-purple-200/20" : "shadow-md shadow-blue-100/10"
        }`}
      >
        {/* Decorative elements - enhanced rainbow line with shimmer effect */}
        <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-white opacity-40"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-white opacity-30"
            animate={{
              x: ["100%", "0%", "100%"],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full px-4 py-3 relative">
          {/* Left section with logo and mobile menu button */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button with enhanced gradient */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-md shadow-purple-300/30 menu-button"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>

            {/* Enhanced Logo with 3D effect and interactive animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative perspective-1000"
              onHoverStart={() => setLogoHovered(true)}
              onHoverEnd={() => setLogoHovered(false)}
            >
              <Link href="/" className="flex items-center">
                <motion.div 
                  className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 mr-2 shadow-lg shadow-purple-300/30"
                  animate={logoControls}
                >
                  <Image className="h-5 w-5 text-white drop-shadow-md" />
                </motion.div>
                <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center relative">
                  <span className="hidden sm:inline tracking-tight">ImageToCode</span>
                  <span className="sm:hidden">I2C</span>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatDelay: 5
                    }}
                    className="absolute -right-7 top-0"
                  >
                    <Zap className="h-4 w-4 text-amber-500" />
                  </motion.div>
                </div>
                <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10"></div>
                <div className="absolute -inset-3 bg-blue-400/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
              </Link>
            </motion.div>
          </div>

          {/* Center navigation - enhanced visual design */}
          <nav className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            <div className="p-1 rounded-2xl bg-white/50 shadow-sm backdrop-blur-sm flex items-center">
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
                    className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? `text-white bg-gradient-to-r ${item.color} shadow-md ${item.hoverEffect}`
                        : "text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {activeTab === item.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </Link>
                  {hoveredNavItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Right section with enhanced actions */}
          <div className="flex items-center space-x-2">
            {/* Notification icon with enhanced counter and animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative mr-1"
            >
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full p-2 relative hover:bg-white/50 hover:shadow-sm"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notificationCount > 0 && (
                  <motion.div
                    variants={pulseAnimation}
                    animate="pulse"
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full text-white text-xs flex items-center justify-center shadow-md shadow-red-300/30"
                  >
                    {notificationCount}
                  </motion.div>
                )}
              </Button>
            </motion.div>

            {/* Authentication component */}
            <Authentication />
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar with enhanced styling and animations */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop with enhanced blur effect */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Enhanced Sidebar */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 z-50 rounded-r-2xl shadow-2xl overflow-hidden mobile-sidebar md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Enhanced Header with glow effect */}
                <div className="flex items-center justify-between p-4 border-b border-purple-700/50 relative">
                  <Link href="/" className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/10 mr-3 shadow-inner shadow-purple-800/50">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      ImageToCode
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-purple-800/50"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>
                  
                  {/* Decorative glow element */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
                </div>

                {/* Enhanced menu items with staggered animation and visual indicators */}
                <div className="flex-grow overflow-y-auto py-4 space-y-2 px-3">
                  {sidebarItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={sidebarItemVariants}
                      custom={index}
                      whileHover={{ 
                        x: 5, 
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/${item.id}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium relative overflow-hidden
                          ${activeTab === item.id
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : "text-white hover:shadow-md hover:shadow-purple-800/20"
                          }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        {activeTab === item.id && (
                          <motion.div 
                            className="absolute inset-0 opacity-20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [1, 1.5, 1.2],
                              opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          />
                        )}
                        <div className="flex items-center z-10">
                          <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-white/10'} mr-3`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4 z-10" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Version info */}
                <div className="p-4 text-white/50 text-xs text-center border-t border-purple-700/30">
                  <p>ImageToCode v2.5.0</p>
                  <p className="mt-1">Transform designs into code with AI</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced floating graphics elements */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="fixed z-30 pointer-events-none"
                style={{
                  top: `${20 + Math.random() * 50}px`,
                  right: `${40 + Math.random() * 100}px`,
                }}
              >
                <motion.div
                  variants={floatAnimation}
                  animate="float"
                  className="text-purple-500"
                >
                  <Sparkles className={`h-${4 + i * 2} w-${4 + i * 2}`} />
                </motion.div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Enhanced confetti effect with better distribution and colors */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                initial={{
                  opacity: 1,
                  y: -20,
                  x: Math.random() * window.innerWidth,
                }}
                animate={{
                  opacity: [1, 1, 0],
                  y: window.innerHeight * 0.8,
                  x: Math.random() * window.innerWidth,
                  rotate: Math.random() * 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 4,
                  ease: "easeOut",
                  delay: Math.random() * 3,
                }}
                className="fixed top-0 z-20 pointer-events-none"
                style={{
                  width: Math.random() * 10 + 5 + "px",
                  height: Math.random() * 15 + 5 + "px",
                  backgroundColor: [
                    `rgba(239, 68, 68, ${0.7 + Math.random() * 0.3})`, // red
                    `rgba(59, 130, 246, ${0.7 + Math.random() * 0.3})`, // blue
                    `rgba(250, 204, 21, ${0.7 + Math.random() * 0.3})`, // yellow
                    `rgba(16, 185, 129, ${0.7 + Math.random() * 0.3})`, // green
                    `rgba(168, 85, 247, ${0.7 + Math.random() * 0.3})`, // purple
                    `rgba(236, 72, 153, ${0.7 + Math.random() * 0.3})`, // pink
                  ][Math.floor(Math.random() * 6)],
                  borderRadius: Math.random() > 0.5 ? "50%" : `${Math.random() * 5}px`,
                  boxShadow: `0 0 ${Math.random() * 10}px rgba(255,255,255,0.3)`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Enhanced feature spotlight with animated glow effect */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.7 }}
        className="fixed bottom-6 right-6 z-30 md:block hidden"
      >
        <motion.div
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-gradient-to-r from-violet-600 to-purple-700 rounded-full py-2 px-4 text-white shadow-lg flex items-center space-x-2 group"
        >
          <motion.div
            animate={{ 
              rotate: [0, 180],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Cpu className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">New AI Features!</span>
          
          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10 group-hover:bg-purple-400/40 transition-colors"></div>
          <div className="absolute -inset-2 bg-violet-400/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default AppHeader;

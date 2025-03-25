"use client";

import React, { useState, useEffect, useRef } from "react";
import Authentication from "./Authentication";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  X,
  Sparkles,
  Home,
  Image,
  Cpu,
  Menu,
  ChevronRight,
  Settings,
  Star,
  Crown,
  Zap,
  Layers,
  Palette,
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
        transition: { duration: 1.5 },
      });
    }
  }, [logoHovered, logoControls]);

  // Enhanced nav items with more creative icons and colors
  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      color: {
        gradient: "from-blue-500 to-cyan-500",
        activeBackground: "bg-gradient-to-tr from-blue-600 to-cyan-400",
        activeGlow: "shadow-xl shadow-blue-500/50 ring-2 ring-blue-300/50",
      },
    },
    {
      id: "designs",
      label: "My Designs",
      icon: Layers,
      color: {
        gradient: "from-violet-500 to-purple-600",
        activeBackground: "bg-gradient-to-tr from-violet-600 to-purple-500",
        activeGlow: "shadow-xl shadow-purple-500/50 ring-2 ring-purple-300/50",
      },
    },
    {
      id: "credits",
      label: "Pricing",
      icon: Crown,
      color: {
        gradient: "from-amber-500 to-orange-500",
        activeBackground: "bg-gradient-to-tr from-amber-600 to-orange-400",
        activeGlow: "shadow-xl shadow-orange-500/50 ring-2 ring-orange-300/50",
      },
    },
    {
      id: "profile",
      label: "Settings",
      icon: Settings,
      color: {
        gradient: "from-gray-600 to-gray-800",
        activeBackground: "bg-gradient-to-tr from-gray-700 to-gray-900",
        activeGlow: "shadow-xl shadow-gray-500/50 ring-2 ring-gray-300/50",
      },
    },
  ];
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        staggerDirection: -1,
      },
    },
  };

  const sidebarItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
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

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      color: {
        active: "from-emerald-500 to-teal-600",
        gradient: "bg-gradient-to-r from-emerald-400 to-teal-500",
        glow: "shadow-emerald-500/50",
      },
    },
    {
      id: "designs",
      label: "My Designs",
      icon: Layers,
      color: {
        active: "from-fuchsia-600 to-pink-500",
        gradient: "bg-gradient-to-r from-fuchsia-500 to-pink-600",
        glow: "shadow-fuchsia-500/50",
      },
    },
    {
      id: "credits",
      label: "Pricing",
      icon: Crown,
      color: {
        active: "from-amber-600 to-orange-500",
        gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
        glow: "shadow-amber-500/50",
      },
    },
    {
      id: "profile",
      label: "Settings",
      icon: Settings,
      color: {
        active: "from-indigo-600 to-blue-500",
        gradient: "bg-gradient-to-r from-indigo-500 to-blue-600",
        glow: "shadow-indigo-500/50",
      },
    },
  ];
  // Navbar Component


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
          opacity: headerVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${rainbowGradient} ${
          scrolled
            ? "shadow-xl shadow-purple-200/20"
            : "shadow-md shadow-blue-100/10"
        }`}
      >
        <div className="flex items-center justify-between w-full px-4 py-3 relative">
          {/* Left section with logo and mobile menu button */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button with enhanced gradient */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)",
              }}
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
                  <span className="hidden sm:inline tracking-tight">
                    ImageToCode
                  </span>
                  <span className="sm:hidden">I2C</span>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className="absolute -right-7 top-0"
                  >
                    <Zap className="h-4 w-4 text-amber-500" />
                  </motion.div>
                </div>
                <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10"></div>
                <div className="absolute -inset-3 bg-blue-400/20 rounded-full blur-2xl -z-10"></div>
              </Link>
            </motion.div>
          </div>

          {/* Center navigation - enhanced visual design */}
          <nav className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            <div className="p-1 rounded-2xl  shadow-lg  flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="p-1.5 rounded-3xl "
              >
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="relative"
                      onHoverStart={() => setHoveredNavItem(item.id)}
                      onHoverEnd={() => setHoveredNavItem(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/${item.id}`}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                    flex items-center px-4 py-2.5 rounded-2xl text-sm font-semibold 
                    transition-all duration-300 group relative overflow-hidden
                    ${
                      activeTab === item.id
                        ? `${item.color.activeBackground} text-white ${item.color.activeGlow}`
                        : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                    }
                  `}
                      >
                        {/* Subtle background effect for active state */}
                        {activeTab === item.id && (
                          <motion.span
                            layoutId="nav-bubble"
                            className="absolute inset-0 bg-white/20 rounded-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}

                        <item.icon
                          className={`
                      h-5 w-5 mr-2 
                      ${
                        activeTab === item.id
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-700"
                      }
                    `}
                        />
                        {item.label}

                        {/* Active indicator */}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="active-dot"
                            className="ml-2 w-2 h-2 rounded-full bg-white/80"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hover underline effect */}
              <AnimatePresence>
                {hoveredNavItem && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: "100%",
                      transition: { duration: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      transition: { duration: 0.2 },
                    }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                  />
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right section with enhanced actions */}
          <div className="flex items-center space-x-2">
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
                <div className="flex items-center justify-between p-4 border-b border-purple-700/30 relative overflow-hidden">
                  <Link
                    href="/"
                    className="flex items-center group transition-all duration-300"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-800/30 mr-4 shadow-md shadow-purple-800/40 group-hover:scale-105 transition-transform">
                      <Palette className="h-7 w-7 text-white opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span
                      className="text-2xl font-extrabold text-white tracking-tight 
      bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 
      group-hover:from-purple-200 group-hover:to-purple-400 transition-all duration-300"
                    >
                      ImageToCode
                    </span>
                  </Link>

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(126,34,206,0.3)", // More vibrant purple hover
                    }}
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2.5 rounded-full hover:bg-purple-800/40  transition-all duration-300 group relative"
                  >
              

                    {/* Subtle hover effect */}
                    <span
                      className="absolute inset-0 rounded-full border border-purple-500/30 
      opacity-0 group-hover:opacity-100 animate-ping"
                    ></span>
                  </motion.button>

                  {/* Enhanced decorative glow elements */}
                  <div
                    className="absolute -top-12 -right-12 w-24 h-24 
    bg-gradient-to-br from-purple-400/20 via-purple-600/10 to-transparent 
    rounded-full blur-2xl animate-pulse"
                  ></div>

                  <div
                    className="absolute -bottom-8 -left-8 w-20 h-20 
    bg-gradient-to-tr from-purple-500/10 via-purple-700/5 to-transparent 
    rounded-full blur-xl"
                  ></div>
                </div>

                {/* Enhanced menu items with staggered animation and visual indicators */}
                <div className="flex-grow overflow-y-auto py-4 space-y-2 px-3 pt-6">
                  {sidebarItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={sidebarItemVariants}
                      custom={index}
                      whileHover={{
                        x: 5,
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/${item.id}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium relative overflow-hidden
                          ${
                            activeTab === item.id
                              ? `${item.color.gradient} text-white ${item.color.glow} shadow-lg`
                              : "text-white/80 hover:bg-white/10 hover:text-white"
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
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                        )}
                        <div className="flex items-center z-10">
                          <div
                            className={`p-2 rounded-lg ${
                              activeTab === item.id
                                ? "bg-white/30"
                                : "bg-white/10"
                            } mr-3`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4 z-10" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Version info with decorative elements */}
                <div className="p-4 text-white/50 text-xs text-center border-t border-purple-700/30 bg-black/10">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-fuchsia-500 to-amber-500 opacity-50"></div>
                  <p className="font-semibold">ImageToCode v2.5.0</p>
                  <p className="mt-1 text-white/40">
                    Transform designs into code with AI
                  </p>
                </div>
              </div>
            </motion.div>
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
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-gradient-to-r from-violet-600 to-purple-700 rounded-full py-2 px-4 text-white shadow-lg flex items-center space-x-2 group"
        >
          <motion.div
            animate={{
              rotate: [0, 180],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Cpu className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">
            New AI Features!
          </span>

          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-purple-400/30 rounded-full blur-xl -z-10 group-hover:bg-purple-400/40 transition-colors"></div>
          <div className="absolute -inset-2 bg-violet-400/20 rounded-full blur-2xl -z-10"></div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default AppHeader;

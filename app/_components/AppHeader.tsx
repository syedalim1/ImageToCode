"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import Authentication from "./Authentication";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  X,
  Sparkles,
  Zap,
  Home,
  Paintbrush,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get sidebar context
  const sidebar = useSidebar();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Hide search on small screens by default
      setSearchVisible(window.innerWidth >= 640);
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

  // Periodically show sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Toggle search on mobile
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      // Focus the search input when it becomes visible
      setTimeout(() => {
        const searchInput = document.getElementById("header-search");
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between w-full px-4 py-3 relative">
        {/* Left section with menu and logo on mobile */}
        <div className="flex items-center space-x-3">
          {/* Menu button for sidebar toggle */}
          {isMobile && (
            <SidebarTrigger className="h-9 w-9 text-gray-700 hover:bg-gray-100 hover:text-gray-900" />
          )}
          {/* <SidebarTrigger className="h-9 w-9 text-gray-700 hover:bg-gray-100 hover:text-gray-900" /> */}

          {/* Logo on mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="text-lg font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center">
                <Zap className="h-4 w-4 mr-1 text-indigo-600" />
                CodeNovaTech
              </div>
            </motion.div>
          )}
        </div>

        {/* Center logo - visible on larger screens */}
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
        >
          <div className="relative">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center">
              <Zap className="h-5 w-5 mr-1.5 text-indigo-600" />
              CodeNovaTech
            </div>

            {/* Sparkle effects */}
            <AnimatePresence>
              {showSparkles && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`header-sparkle-${i}`}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 100 - 50}%`,
                        left: `${Math.random() * 100}%`,
                        zIndex: 20,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: [0, 15, -15, 0],
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                      }}
                    >
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right section with search toggle, notifications and authentication */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search toggle on mobile */}
          {isMobile && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={toggleSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Notification bell */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-700 hover:bg-gray-100 hover:text-gray-900 relative"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <motion.span
                  className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                  }}
                >
                  {notifications}
                </motion.span>
              )}
            </Button>
          </motion.div>

          {/* Authentication component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Authentication />
          </motion.div>
        </div>
      </div>

      {/* Search bar - can be toggled on mobile, always visible on larger screens */}
      <AnimatePresence>
        {(searchVisible || !isMobile) && (
          <motion.div
            className="px-4 pb-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative flex items-center w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="header-search"
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 text-gray-500"
                  onClick={() => setSearchVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu - only visible on mobile */}
      {!isMobile && (
        <div className="px-4 pb-3 border-t border-gray-200">
          <div className="flex justify-between items-center py-2">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-medium text-gray-700">Dashboard</span>
            </Link>

            <Link
              href="/designs"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Paintbrush className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium text-gray-700">Designs</span>
            </Link>

            <Link
              href="/credits"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CircleDollarSign className="h-5 w-5 text-amber-600 mr-2" />
              <span className="font-medium text-gray-700">Credits</span>
            </Link>
          </div>
        </div>
      )}

      {/* Animated border at bottom */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: 1,
          opacity: scrolled ? 1 : 0.7,
        }}
        transition={{ delay: 0.4 }}
      />
    </motion.header>
  );
}

export default AppHeader;

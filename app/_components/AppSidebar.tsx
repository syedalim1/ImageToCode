"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CircleDollarSign,
  Home,
  Paintbrush,
  Settings,
  Sparkles,
  Code,
  ChevronRight,
  LogOut,
  HelpCircle,
  User,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    description: "Your project dashboard"
  },
  {
    title: "Design",
    url: "/designs",
    icon: Paintbrush,
    color: "from-purple-500 to-pink-500",
    description: "Browse your designs"
  },
  {
    title: "Credits",
    url: "/credits",
    icon: CircleDollarSign,
    color: "from-amber-500 to-orange-500",
    description: "Manage your credits"
  },
];

export function AppSidebar() {
  const path = usePathname();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const [creditBalance, setCreditBalance] = useState(75);
  
  // Get sidebar state from context
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded";
  
  // Periodically show sparkle effects on logo
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 2000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "80px" }
  };
  
  const itemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }),
    exit: { x: -20, opacity: 0 }
  };
  
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 15
      }
    }
  };
  
  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sidebarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sidebarGrid)" />
        </svg>
      </div>
      
      <SidebarHeader className="relative z-10">
        <div className="p-4 flex flex-col items-center justify-center">
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate={["animate", "pulse"]}
            className="relative"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center justify-center">
              <Code className="h-6 w-6 mr-2 text-indigo-600" />
              CodeNovaTech
            </div>
            
            {/* Sparkle effects */}
            <AnimatePresence>
              {showSparkles && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 100 - 50}%`,
                        left: `${Math.random() * 100}%`,
                        zIndex: 20
                      }}
                      variants={sparkleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 text-center mt-1 font-medium"
          >
            Image To Code Generator
          </motion.h2>
        </div>
        
        {/* Credit balance indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mb-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <Zap className="h-4 w-4 text-amber-500 mr-1" />
              </motion.div>
              <span className="text-xs font-medium text-gray-700">Credits</span>
            </div>
            <span className="text-sm font-bold text-indigo-700">{creditBalance}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (creditBalance / 100) * 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent className="relative z-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 px-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    custom={index}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="mb-2 relative"
                  >
                    <Link
                      href={item.url}
                      className={`p-3 text-base flex items-center rounded-lg transition-all duration-200 relative overflow-hidden ${
                        path === item.url 
                          ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 font-medium border border-indigo-100" 
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {/* Background highlight effect for active item */}
                      {path === item.url && (
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500"
                          layoutId="activeItemIndicator"
                        />
                      )}
                      
                      {/* Icon with gradient background */}
                      <div className={`mr-3 p-2 rounded-md bg-gradient-to-br ${item.color} text-white`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      
                      <span>{item.title}</span>
                      
                      {/* Show chevron on hover or active */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: hoveredItem === index || path === item.url ? 1 : 0,
                          x: hoveredItem === index || path === item.url ? 0 : -10
                        }}
                        className="ml-auto"
                      >
                        <ChevronRight className="h-4 w-4 text-indigo-500" />
                      </motion.div>
                    </Link>
                    
                    {/* Tooltip with description */}
                    <AnimatePresence>
                      {hoveredItem === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg z-50 w-32"
                          style={{ pointerEvents: "none" }}
                        >
                          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                          {item.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="relative z-10 border-t border-gray-100 pt-4">
        {/* User profile section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-4 mb-4"
        >
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white mr-3">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Syed Ali M</p>
              <p className="text-xs text-gray-500 truncate">Developer</p>
            </div>
            <Settings className="h-4 w-4 text-gray-400" />
          </div>
        </motion.div>
        
        {/* Footer links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-4 mb-4 space-y-1"
        >
          <a href="#" className="flex items-center p-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
            <HelpCircle className="h-3.5 w-3.5 mr-2 text-gray-500" />
            Help & Support
          </a>
          <a href="#" className="flex items-center p-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
            <Settings className="h-3.5 w-3.5 mr-2 text-gray-500" />
            Settings
          </a>
          <a href="#" className="flex items-center p-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
            <LogOut className="h-3.5 w-3.5 mr-2 text-gray-500" />
            Sign Out
          </a>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="p-4 text-gray-400 text-xs text-center"
        >
          <p>© 2025 CodeNovaTech</p>
          <p className="mt-1">Created by Syed Ali M</p>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}

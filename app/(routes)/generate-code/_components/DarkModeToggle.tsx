"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import ClientOnly from "./ClientOnly";

interface DarkModeToggleProps {
  initialDarkMode?: boolean;
}

export default function DarkModeToggle({ initialDarkMode = false }: DarkModeToggleProps) {
  // Initialize state but don't apply it until after hydration
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  
  // Apply dark mode class on client-side only
  useEffect(() => {
    // Check if user has a preference stored
    const storedPreference = localStorage.getItem("darkMode");
    const prefersDark = storedPreference 
      ? storedPreference === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", String(newValue));
      
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newValue;
    });
  };

  return (
    <ClientOnly>
      <motion.button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600" />
        )}
      </motion.button>
    </ClientOnly>
  );
}

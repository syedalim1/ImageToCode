"use client";

import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Zap, 
  Sparkles, 
  Rocket, 
  Award, 
  Shield, 
  Clock, 
  Code, 
  FileCode, 
  Download, 
  Star, 
  Cpu, 
  HelpCircle,
  Info,
  BarChart2,
  Lock
} from "lucide-react";

interface ModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

interface ModeInfo {
  id: string;
  name: string;
  description: string;
  credits: number;
  features: string[];
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
  tag?: string;
  tagColor?: string;
  popularity: number;
  recommended?: boolean;
}



// Animated floating particles component
const FloatingParticles = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(
              Math.random() * 100
            ) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.3)`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            scale: [1, Math.random() * 0.5 + 1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  setSelectedMode,
}) => {
  const { user } = useUser();
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModeComparison, setShowModeComparison] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<{[key: string]: number}>({});
  const [showUsageStats, setShowUsageStats] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Define available modes with enhanced information
  const modes: ModeInfo[] = [
    {
      id: "normal",
      name: "Standard Mode",
      description: "Basic code generation with standard features",
      credits: 10,
      features: [
        "Standard code generation",
        "Basic documentation",
        "Simple responsive layouts",
        "Standard components"
      ],
      icon: <Code className="h-5 w-5 text-blue-500" />,
      gradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
      tag: "BASIC",
      tagColor: "from-yellow-300 to-yellow-500 text-indigo-900",
      popularity: 65,
      recommended: false
    },
    {
      id: "export",
      name: "Premium Mode",
      description: "Advanced features with premium export options",
      credits: 30,
      features: [
        "Advanced export options",
        "Premium components",
        "Advanced animations",
        "Comprehensive documentation",
        "Performance optimizations"
      ],
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700",
      tag: "PREMIUM",
      tagColor: "from-yellow-300 to-yellow-500 text-purple-900",
      popularity: 85,
      recommended: true
    },
    {
      id: "turbo",
      name: "Turbo Mode",
      description: "Ultra-fast generation with advanced AI models",
      credits: 50,
      features: [
        "Ultra-fast generation",
        "Advanced AI models",
        "Complex layouts",
        "Optimized code",
        "Premium animations",
        "SEO optimizations"
      ],
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      gradient: "from-amber-500 to-orange-600",
      hoverGradient: "from-amber-600 to-orange-700",
      tag: "ULTRA",
      tagColor: "from-green-300 to-green-500 text-green-900",
      popularity: 45
    }
  ];

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load usage stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('modeUsageStats');
    if (savedStats) {
      try {
        setUsageStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error parsing usage stats:', e);
        setUsageStats({});
      }
    } else {
      // Initialize with default values if none exist
      const initialStats = {
        normal: 65,
        export: 85,
        turbo: 45
      };
      setUsageStats(initialStats);
      localStorage.setItem('modeUsageStats', JSON.stringify(initialStats));
    }
  }, []);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (user?.primaryEmailAddress) {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/user?email=${user.primaryEmailAddress.emailAddress}`);
          setUserCredits(response.data.credits);
        } catch (error) {
          console.error("Error fetching user credits:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchUserCredits();
    }
  }, [user]);
  
  // Update usage stats when mode changes
  useEffect(() => {
    if (selectedMode && !isLoading) {
      const newStats = { ...usageStats };
      newStats[selectedMode] = (newStats[selectedMode] || 0) + 1;
      setUsageStats(newStats);
      localStorage.setItem('modeUsageStats', JSON.stringify(newStats));
    }
  }, [selectedMode]);
  
  // Helper function to handle mode selection
  const handleModeSelect = (modeId: string) => {
    // Check if user has enough credits
    const selectedModeInfo = modes.find(mode => mode.id === modeId);
    if (selectedModeInfo && userCredits >= selectedModeInfo.credits) {
      setSelectedMode(modeId);
    } else if (selectedModeInfo) {
      // Show not enough credits tooltip
      setShowTooltip(`insufficient-${modeId}`);
      setTimeout(() => setShowTooltip(null), 3000);
    }
  };
  
  // Helper function to render tooltip
  const renderTooltip = (id: string) => {
    if (!showTooltip || !showTooltip.includes(id)) return null;
    
    if (showTooltip.startsWith('insufficient')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium"
          ref={tooltipRef}
        >
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            <span>Not enough credits!</span>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-red-500"></div>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium"
        ref={tooltipRef}
      >
        <div className="flex items-center">
          <Info className="w-4 h-4 mr-2" />
          <span>{id === 'info' ? 'Mode information' : 'Feature details'}</span>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-indigo-600"></div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl p-6 shadow-xl border-2 border-purple-300 relative overflow-hidden bg-gradient-to-br from-white to-purple-50"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingParticles />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full filter blur-3xl opacity-20 transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20 transform -translate-x-20 translate-y-20"></div>
      </div>
  
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative mr-3"
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
            >
              <Settings className="w-8 h-8 text-indigo-600 filter drop-shadow-md" />
              <motion.div 
                className="absolute inset-0 bg-indigo-400 rounded-full" 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <div>
              <motion.h2 
                className="text-2xl font-bold text-indigo-800 flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                Select Generation Mode
                <motion.span 
                  className="ml-2 text-yellow-500 text-xl"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-sm text-indigo-600 mt-1 opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Choose how you want your code to be generated
              </motion.p>
            </div>
          </motion.div>
          
          {/* Credits display and action buttons */}
          <div className="flex space-x-3">
            {/* Usage stats button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUsageStats(!showUsageStats)}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              <span>Stats</span>
            </motion.button>

            {/* Compare button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModeComparison(!showModeComparison)}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Cpu className="w-5 h-5 mr-2" />
              <span>Compare</span>
            </motion.button>

            {/* Credits display button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.button
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                animate={{ 
                  boxShadow: ['0 4px 6px rgba(99, 102, 241, 0.3)', '0 8px 12px rgba(99, 102, 241, 0.5)', '0 4px 6px rgba(99, 102, 241, 0.3)'] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-5 h-5 mr-2 text-yellow-200" />
                {isLoading ? (
                  <span className="flex items-center">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-white mx-1"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-white mx-1"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-white mx-1"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </span>
                ) : (
                  <>
                    <span className="mr-1 font-bold">{userCredits}</span>
                    <span>Credits</span>
                  </>
                )}
              </motion.button>
              {/* Decorative elements around credit button */}
              <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-yellow-300 animate-ping opacity-75"></div>
              <div className="absolute -left-2 -bottom-2 w-3 h-3 rounded-full bg-green-300 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Usage statistics panel */}
        <AnimatePresence>
          {showUsageStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-indigo-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-indigo-800 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Mode Usage Statistics
                </h3>
                <button 
                  onClick={() => setShowUsageStats(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {modes.map(mode => (
                  <div key={mode.id} className="bg-white rounded p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{mode.name}</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {usageStats[mode.id] || 0} uses
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-gradient-to-r ${mode.gradient}`}
                        style={{ width: `${Math.min(100, ((usageStats[mode.id] || 0) / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mode comparison panel */}
        <AnimatePresence>
          {showModeComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-indigo-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-indigo-800 flex items-center">
                  <Cpu className="w-4 h-4 mr-2" />
                  Mode Comparison
                </h3>
                <button 
                  onClick={() => setShowModeComparison(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-indigo-100">
                      <th className="py-2 text-left">Feature</th>
                      {modes.map(mode => (
                        <th key={mode.id} className="py-2 text-center">{mode.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-indigo-50">
                      <td className="py-2">Credits Cost</td>
                      {modes.map(mode => (
                        <td key={mode.id} className="py-2 text-center font-medium">{mode.credits}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-indigo-50">
                      <td className="py-2">Generation Speed</td>
                      {modes.map(mode => (
                        <td key={mode.id} className="py-2 text-center">
                          {mode.id === 'normal' && '⭐'}
                          {mode.id === 'export' && '⭐⭐⭐'}
                          {mode.id === 'turbo' && '⭐⭐⭐⭐⭐'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-indigo-50">
                      <td className="py-2">Code Quality</td>
                      {modes.map(mode => (
                        <td key={mode.id} className="py-2 text-center">
                          {mode.id === 'normal' && '⭐⭐'}
                          {mode.id === 'export' && '⭐⭐⭐⭐'}
                          {mode.id === 'turbo' && '⭐⭐⭐⭐⭐'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-indigo-50">
                      <td className="py-2">Documentation</td>
                      {modes.map(mode => (
                        <td key={mode.id} className="py-2 text-center">
                          {mode.id === 'normal' && '⭐'}
                          {mode.id === 'export' && '⭐⭐⭐'}
                          {mode.id === 'turbo' && '⭐⭐⭐⭐⭐'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="flex items-center justify-center mb-4 bg-indigo-50 py-2 px-4 rounded-lg border border-indigo-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Info className="w-5 h-5 text-indigo-500 mr-2" />
          <p className="text-indigo-700 text-sm font-medium">
            Choose the perfect mode for your code generation
            <motion.span 
              className="inline-block ml-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >✨</motion.span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dynamically render mode cards */}
          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;
            const textColor = isSelected ? 'text-white' : 'text-gray-700';
            const lightTextColor = isSelected ? 
              (mode.id === 'normal' ? 'text-blue-100' : 
               mode.id === 'export' ? 'text-pink-100' : 'text-amber-100') : 
              'text-gray-500';
            
            return (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                  isSelected
                    ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg transform scale-105`
                    : `bg-white hover:bg-gradient-to-r hover:bg-opacity-10 hover:${mode.hoverGradient} text-gray-700 border border-${mode.id === 'normal' ? 'blue' : mode.id === 'export' ? 'purple' : 'amber'}-200 hover:shadow-md`
                }`}
                onClick={() => handleModeSelect(mode.id)}
              >
                {/* Animated background elements */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-white"
                          style={{
                            width: Math.random() * 8 + 4,
                            height: Math.random() * 8 + 4,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            x: [0, Math.random() * 50 - 25],
                            y: [0, Math.random() * 50 - 25],
                            opacity: [0.7, 0.2],
                          }}
                          transition={{
                            duration: Math.random() * 5 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </>
                )}
                
                {/* Tooltip for this mode */}
                <AnimatePresence>
                  {showTooltip === mode.id && renderTooltip(mode.id)}
                </AnimatePresence>
              
                <input
                  type="radio"
                  id={mode.id}
                  value={mode.id}
                  checked={isSelected}
                  onChange={() => handleModeSelect(mode.id)}
                  className="absolute opacity-0"
                />
                <label
                  htmlFor={mode.id}
                  className="flex items-center cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                      isSelected
                        ? "bg-white shadow-inner"
                        : `border-2 border-${mode.id === 'normal' ? 'indigo' : mode.id === 'export' ? 'purple' : 'amber'}-400`
                    }`}
                  >
                    {isSelected ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${mode.gradient}`}
                      ></motion.div>
                    ) : (
                      <motion.div className="text-gray-400">
                        {mode.icon}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg flex items-center">
                      <span>{mode.name}</span>
                      <motion.button
                        className="ml-2 opacity-70 hover:opacity-100"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTooltip(showTooltip === mode.id ? null : mode.id);
                        }}
                      >
                        <HelpCircle className={`h-4 w-4 ${textColor}`} />
                      </motion.button>
                    </div>
                    <div className={`text-sm mt-1 ${lightTextColor}`}>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{mode.credits} Credits</span>
                      </span>
                    </div>
                  </div>
                </label>

                {/* Description */}
                <div className={`mt-2 mb-3 pl-12 text-sm ${lightTextColor}`}>
                  {mode.description}
                </div>

                {/* Feature List */}
                <div className={`mt-4 pl-12 ${lightTextColor}`}>
                  {mode.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm mb-1">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13L9 17L19 7"
                          stroke={isSelected ? "white" : 
                            mode.id === 'normal' ? "#818CF8" : 
                            mode.id === 'export' ? "#C084FC" : "#F59E0B"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                  
                  {/* Show more features button if there are more than 3 */}
                  {mode.features.length > 3 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-xs mt-1 flex items-center ${isSelected ? 'text-white' : `text-${mode.id === 'normal' ? 'blue' : mode.id === 'export' ? 'purple' : 'amber'}-500`} font-medium`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(`features-${mode.id}`);
                      }}
                    >
                      <span>+ {mode.features.length - 3} more features</span>
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M19 9l-7 7-7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>

                {/* Popularity indicator */}
                <div className={`mt-4 pl-12 ${lightTextColor} text-xs flex items-center`}>
                  <span className="mr-2">Popularity:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div 
                      className={`h-1.5 rounded-full ${isSelected ? 'bg-white' : `bg-gradient-to-r ${mode.gradient}`}`}
                      style={{ width: `${mode.popularity}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{mode.popularity}%</span>
                </div>

                {/* Tag */}
                {mode.tag && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className={`absolute -top-1 -right-1 bg-gradient-to-r ${mode.tagColor} text-xs font-bold px-3 py-1 rounded-full shadow-md`}
                  >
                    {mode.tag}
                  </motion.div>
                )}
                
                {/* Recommended badge */}
                {mode.recommended && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    RECOMMENDED
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced footer with additional information */}
      <div className="mt-8 pt-4 border-t border-purple-200 relative">
        {/* Decorative elements */}
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-purple-200 text-xs font-medium text-indigo-600 flex items-center shadow-sm">
          <Star className="w-3 h-3 mr-1 text-yellow-500" />
          <span>Mode Selection</span>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
          {/* Credits info */}
          <div className="flex items-center bg-indigo-50 rounded-lg p-2 shadow-sm">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <Star className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-700">Credit Balance</div>
              <div className="text-sm font-bold text-indigo-800">
                {isLoading ? (
                  <span className="flex items-center">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-indigo-400 mx-0.5"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-indigo-500 mx-0.5"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-indigo-600 mx-0.5"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </span>
                ) : (
                  <span>{userCredits} credits</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Selected mode info */}
          <div className="flex items-center bg-indigo-50 rounded-lg p-2 shadow-sm">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <Settings className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-700">Selected Mode</div>
              <div className="text-sm font-bold text-indigo-800 flex items-center">
                {selectedMode ? (
                  <>
                    {modes.find(m => m.id === selectedMode)?.name || 'Standard Mode'}
                    {modes.find(m => m.id === selectedMode)?.recommended && (
                      <span className="ml-1 text-green-500 text-xs">(Recommended)</span>
                    )}
                  </>
                ) : (
                  'None Selected'
                )}
              </div>
            </div>
          </div>
          
          {/* Cost info */}
          <div className="flex items-center bg-indigo-50 rounded-lg p-2 shadow-sm">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <Cpu className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-700">Generation Cost</div>
              <div className="text-sm font-bold text-indigo-800">
                {selectedMode ? (
                  <span>{modes.find(m => m.id === selectedMode)?.credits || 10} credits per generation</span>
                ) : (
                  'Select a mode'
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Pro tip */}
        <motion.div 
          className="mt-3 text-xs text-center text-indigo-500 bg-indigo-50 rounded-lg p-2 border border-indigo-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-semibold">Pro Tip:</span> Premium and Turbo modes offer advanced features and optimizations for professional-quality code generation.
        </motion.div>
        
        {/* Subtle loading animation */}
        <div className="flex justify-center mt-3 space-x-1">
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-indigo-300" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-indigo-400" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-indigo-500" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ModeSelector;
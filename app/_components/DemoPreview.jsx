// File: EnhancedDemoPreview.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function EnhancedDemoPreview({
  animateHero = true,
  codeExample,
  AnimatedCodeSnippet,
  theme = "default",
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [activeTab, setActiveTab] = useState("design");
  const [hoverEffect, setHoverEffect] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentFramework, setCurrentFramework] = useState("React");
  const previewRef = useRef(null);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Enhanced color themes
  const themes = {
    default: {
      header: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500",
      button: "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600",
      badge: "bg-gradient-to-r from-cyan-400 to-blue-500",
      codePane: "bg-gradient-to-b from-gray-900 to-gray-800",
      accent: "purple",
    },
    sunset: {
      header: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600",
      button: "bg-gradient-to-r from-pink-600 via-red-500 to-orange-500",
      badge: "bg-gradient-to-r from-yellow-400 to-orange-500",
      codePane: "bg-gradient-to-b from-gray-900 to-slate-900",
      accent: "orange",
    },
    ocean: {
      header: "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700",
      button: "bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500",
      badge: "bg-gradient-to-r from-teal-400 to-cyan-500",
      codePane: "bg-gradient-to-b from-slate-900 to-gray-900",
      accent: "cyan",
    },
    forest: {
      header: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600",
      button: "bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500",
      badge: "bg-gradient-to-r from-lime-400 to-green-500",
      codePane: "bg-gradient-to-b from-slate-900 to-gray-900",
      accent: "emerald",
    }
  };

  const currentTheme = themes[theme] || themes.default;

  // Framework options with icons and colors
  const frameworks = [
    { name: "React", icon: "⚛️", color: "blue-500" },
    { name: "Tailwind", icon: "🌊", color: "cyan-400" },
    { name: "Vue", icon: "🟢", color: "green-500" },
    { name: "Angular", icon: "🔺", color: "red-500" },
    { name: "Svelte", icon: "🔥", color: "orange-500" }
  ];

  // Feature tooltips
  const features = [
    {
      id: "instant",
      title: "Instant Conversion",
      icon: "lightning-bolt",
      color: "pink",
      description: "Transform designs to code in seconds"
    },
    {
      id: "framework",
      title: "Multiple Frameworks",
      icon: "shield-check",
      color: "blue",
      description: "Support for React, Vue, Angular, and more"
    },
    {
      id: "responsive",
      title: "Responsive Design",
      icon: "device-mobile",
      color: "purple",
      description: "Fully adaptive layouts for all screen sizes"
    },
    {
      id: "ai",
      title: "AI-Powered",
      icon: "chip",
      color: "green",
      description: "Smart suggestions and optimizations"
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const triggerHoverEffect = (effect) => {
    setHoverEffect(effect);
    setTimeout(() => setHoverEffect(null), 1000);
  };

  // Particle effect parameters - optimized for less space consumption
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 6 + Math.random() * 4, // Smaller size
    speed: 6 + Math.random() * 5, // Adjusted speed
    delay: i * 0.2,
    text: [
      "<div className='flex'>",
      "const [state, setState] = useState();",
      "transform:translate3d(0,0,0);", // Removed space
      "@keyframes float{0%{...}}", // Removed spaces
      "<Button variant='primary'/>", // Removed space
      "export default function App(){", // Removed space
      "tailwind.config.js",
      "<motion.div animate={{scale:1.1}}>", // Removed spaces
      "grid-template-columns:repeat(3,1fr);", // Removed spaces
      "box-shadow:0 10px 15px -3px rgb(0 0 0/0.1);", // Reduced and removed spaces
      "import{useState}from'react';", // Reduced and removed spaces
      "@media(min-width:768px){...}", // Removed spaces
    ][i % 12]
  }));

  // SVG Icons
  const icons = {
    "lightning-bolt": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    "shield-check": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    "device-mobile": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    "chip": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    "refresh": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    "settings": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "download": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    "code": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    "color-swatch": (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  };

  return (
    <motion.div
      ref={previewRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
      className="mt-12 md:mt-24 rounded-3xl shadow-2xl overflow-hidden border-8 border-white dark:border-gray-800 mx-auto max-w-[1300px] relative"
      style={{
        perspective: "1000px",
        willChange: "transform",
        boxShadow: `0 25px 50px -12px rgba(${currentTheme.accent === 'purple' ? '107, 33, 168' :
          currentTheme.accent === 'cyan' ? '8, 145, 178' :
            currentTheme.accent === 'orange' ? '194, 65, 12' :
              currentTheme.accent === 'emerald' ? '4, 120, 87' : '107, 33, 168'}, 0.25)`
      }}
      whileHover={{
        boxShadow: `0 35px 60px -15px rgba(${currentTheme.accent === 'purple' ? '107, 33, 168' :
          currentTheme.accent === 'cyan' ? '8, 145, 178' :
            currentTheme.accent === 'orange' ? '194, 65, 12' :
              currentTheme.accent === 'emerald' ? '4, 120, 87' : '107, 33, 168'}, 0.3)`
      }}
    >
      {/* Animated glow effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className={`absolute -inset-[100px] rounded-full blur-3xl opacity-20 bg-${currentTheme.accent === 'purple' ? 'purple-600' :
            currentTheme.accent === 'cyan' ? 'cyan-500' :
              currentTheme.accent === 'orange' ? 'orange-500' :
                currentTheme.accent === 'emerald' ? 'emerald-500' : 'purple-600'}`}
          animate={{
            top: ["-50%", "-30%", "-50%"],
            left: ["-30%", "-10%", "-30%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className={`absolute -inset-[100px] rounded-full blur-3xl opacity-20 bg-${currentTheme.accent === 'purple' ? 'pink-600' :
            currentTheme.accent === 'cyan' ? 'blue-500' :
              currentTheme.accent === 'orange' ? 'red-500' :
                currentTheme.accent === 'emerald' ? 'teal-500' : 'pink-600'}`}
          animate={{
            bottom: ["-50%", "-30%", "-50%"],
            right: ["-30%", "-10%", "-30%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Enhanced Mac-style window controls with dropdown */}
      <div
        className={`${currentTheme.header} p-3 md:p-4 flex items-center justify-between relative z-10`}
      >
        <div className="flex space-x-2">
          <motion.div
            className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-red-500 shadow-inner flex items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.2 }}
          >
            <div className="h-1 w-1 rounded-full bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          <motion.div
            className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-yellow-500 shadow-inner cursor-pointer"
            whileHover={{ scale: 1.2 }}
          ></motion.div>
          <motion.div
            className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-green-500 shadow-inner cursor-pointer"
            whileHover={{ scale: 1.2 }}
          ></motion.div>
        </div>

        {/* URL bar with animations */}
        <motion.div
          className="text-white text-xs font-mono mx-4 opacity-80 flex items-center flex-1 justify-center md:justify-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-full max-w-md overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-2 text-white/60">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              readOnly
              value="design-to-code-converter.app"
              className="w-full bg-white/10 rounded-lg py-1 pl-8 pr-4 text-center outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm"
            />
            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 text-white/60">
              <motion.svg
                className="w-3.5 h-3.5 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="hidden md:flex h-6 px-2 rounded-full bg-white/20 items-center backdrop-blur-sm text-white text-xs cursor-pointer"
            onClick={() => triggerHoverEffect("sparkle")}
          >
            <span className="text-xs">✨ Pro</span>
          </motion.div>

          {/* Theme switcher */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm text-white cursor-pointer"
            onClick={() => triggerHoverEffect("color")}
          >
            {icons["color-swatch"]}
          </motion.div>
        </div>
      </div>

      {/* Tab navigation for mobile/tablet */}
      {(isMobile || isTablet) && animateHero && (
        <motion.div
          className="bg-gray-900 border-b border-gray-800 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex text-sm text-gray-400">
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 flex items-center ${activeTab === 'design' ? 'text-white border-b-2 border-purple-500' : ''}`}
              onClick={() => handleTabChange('design')}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Design
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 flex items-center ${activeTab === 'code' ? 'text-white border-b-2 border-purple-500' : ''}`}
              onClick={() => handleTabChange('code')}
            >
              {icons["code"]}
              <span className="ml-1.5">Code</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-4 md:p-8 h-72 md:h-[700px] flex items-center justify-center relative overflow-hidden">
        {/* Interactive background grid */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <svg
            className="absolute w-full h-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient
                id="grid-gradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor={`rgba(${currentTheme.accent === 'purple' ? '147, 51, 234' :
                  currentTheme.accent === 'cyan' ? '6, 182, 212' :
                    currentTheme.accent === 'orange' ? '249, 115, 22' :
                      currentTheme.accent === 'emerald' ? '16, 185, 129' :
                        '147, 51, 234'
                  }, 0.3)`} />
                <stop offset="100%" stopColor={`rgba(${currentTheme.accent === 'purple' ? '147, 51, 234' :
                  currentTheme.accent === 'cyan' ? '6, 182, 212' :
                    currentTheme.accent === 'orange' ? '249, 115, 22' :
                      currentTheme.accent === 'emerald' ? '16, 185, 129' :
                        '147, 51, 234'
                  }, 0)`} />
              </radialGradient>
            </defs>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 10}
                  x2="100"
                  y2={i * 10}
                  stroke="rgba(255,255,255,0.1)"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 10}
                  y1="0"
                  x2={i * 10}
                  y2="100"
                  stroke="rgba(255,255,255,0.1)"
                />
              ))}

              {/* Animated pulse on grid intersection */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={`pulse-${i}`}
                  cx={20 + (i * 15)}
                  cy={20 + (i * 15)}
                  r="0.8"
                  fill={`rgba(${currentTheme.accent === 'purple' ? '147, 51, 234' :
                    currentTheme.accent === 'cyan' ? '6, 182, 212' :
                      currentTheme.accent === 'orange' ? '249, 115, 22' :
                        currentTheme.accent === 'emerald' ? '16, 185, 129' :
                          '147, 51, 234'
                    }, 0.8)`}
                  animate={{
                    r: [0.8, 2, 0.8],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.8,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}

              <rect width="100" height="100" fill="url(#grid-gradient)" />
            </motion.g>
          </svg>
        </div>

        {/* Enhanced split view animation with better visuals */}
        <div className={`absolute inset-0 flex ${(isMobile || isTablet) && animateHero ? 'flex-col' : 'flex-row'} z-10`}>
          <AnimatePresence>
            {(!isMobile && !isTablet || !animateHero || activeTab === 'design') && (
              <motion.div
                key="design-panel"
                initial={{ width: "100%", height: isMobile ? "50%" : "100%" }}
                animate={{
                  width: animateHero ? (isMobile || isTablet ? "100%" : "50%") : "100%",
                  height: animateHero ? (isMobile || isTablet ? (activeTab === 'design' ? "100%" : "0%") : "100%") : "100%",
                }}
                exit={{
                  height: 0,
                  opacity: [1, 0],
                  transition: { duration: 0.3 }
                }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
                className="h-full md:h-full bg-cover bg-center border-b md:border-b-0 md:border-r border-gray-700/50 relative"
                style={{
                  backgroundImage:
                    "url('https://placehold.co/800x600/667eea/ffffff?text=UI+Design')",
                  willChange: "transform",
                  transform: "translate3d(0,0,0)",
                }}
              >
                {animateHero && (
                  <>
                    <div className="absolute inset-0 bg-black/30"></div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.5 }}
                      className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center shadow-lg"
                      style={{ willChange: "transform" }}
                    >
                      <span className={`w-2 h-2 bg-emerald-400 rounded-full mr-2 shadow-[0_0_10px_rgba(52,211,153,0.7)]`}></span>
                      Design Input
                    </motion.div>

                    {/* Framework selector */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0, duration: 0.5 }}
                      className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-2 py-1.5 rounded-lg flex items-center shadow-lg"
                    >
                      <span className="mr-2">Framework:</span>
                      <select
                        value={currentFramework}
                        onChange={(e) => setCurrentFramework(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        {frameworks.map(fw => (
                          <option key={fw.name} value={fw.name}>{fw.name}</option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Enhanced animated scan effect */}
                    <motion.div
                      initial={{ top: 0, opacity: 0 }}
                      animate={{
                        top: ["0%", "100%", "0%"],
                        opacity: [0.9, 0.9, 0],
                      }}
                      transition={{
                        duration: 3,
                        times: [0, 0.5, 1],
                        delay: 2.2,
                        repeat: 1,
                      }}
                      className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(79,70,229,0.7)]`}
                      style={{ willChange: "transform" }}
                    ></motion.div>

                    {/* Interactive design elements */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.5, duration: 0.7 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        className="relative w-4/5 h-4/5 flex flex-col items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        style={{ willChange: "transform" }}
                      >
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400 opacity-60"></div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-blue-400 opacity-60"></div>

                        {/* Design Elements */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 w-full max-w-md shadow-xl border border-white/20">
                          <div className="mb-4 flex items-center justify-between">
                            <motion.div
                              className="h-3 w-24 bg-white/20 rounded"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                            <motion.div
                              className="h-6 w-6 rounded-full bg-blue-500/30"
                              whileHover={{ scale: 1.2, backgroundColor: "rgba(59, 130, 246, 0.5)" }}
                            ></motion.div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <motion.div
                              className="h-2.5 w-full bg-white/20 rounded"
                              animate={{ width: ["100%", "80%", "100%"] }}
                              transition={{ duration: 8, repeat: Infinity }}
                            ></motion.div>
                            <div className="h-2.5 w-4/5 bg-white/15 rounded"></div>
                            <div className="h-2.5 w-3/4 bg-white/10 rounded"></div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-white/5 rounded-lg p-2 h-16 flex items-center justify-center">
                              <motion.div
                                className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/50 to-pink-500/50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              ></motion.div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 h-16">
                              <div className="space-y-1.5">
                                <div className="h-2 w-full bg-white/20 rounded"></div>
                                <div className="h-2 w-5/6 bg-white/15 rounded"></div>
                                <div className="h-2 w-4/6 bg-white/10 rounded"></div>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full py-2 rounded-lg ${currentTheme.button} text-white text-sm font-medium`}
                          >
                            Convert to Code
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Design measurements and guides */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.2, duration: 0.5 }}
                      className="absolute left-1/4 top-1/4 pointer-events-none"
                    >
                      <motion.div
                        className="h-px w-16 bg-blue-400/50 absolute -left-4 top-4"
                        initial={{ width: 0 }}
                        animate={{ width: 64 }}
                        transition={{ delay: 3.3, duration: 0.5 }}
                      ></motion.div>
                      <div className="text-blue-400/70 text-xs absolute -left-12 top-0">24px</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.4, duration: 0.5 }}
                      className="absolute right-1/4 bottom-1/4 pointer-events-none"
                    >
                      <motion.div
                        className="h-24 w-px bg-blue-400/50 absolute right-4 -top-24"
                        initial={{ height: 0 }}
                        animate={{ height: 96 }}
                        transition={{ delay: 3.5, duration: 0.5 }}
                      ></motion.div>
                      <div className="text-blue-400/70 text-xs absolute right-8 -top-12 transform rotate-90">64px</div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}

            {(!isMobile && !isTablet || !animateHero || activeTab === 'code') && (
              <motion.div
                key="code-panel"
                initial={{ width: "0%", height: "0%" }}
                animate={{
                  width: animateHero ? (isMobile || isTablet ? "100%" : "50%") : "0%",
                  height: animateHero ? (isMobile || isTablet ? (activeTab === 'code' ? "100%" : "0%") : "100%") : "0%",
                }}
                exit={{
                  height: 0,
                  opacity: [1, 0],
                  transition: { duration: 0.3 }
                }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
                className={`${currentTheme.codePane} overflow-hidden relative`}
              >
                {animateHero && (
                  <>
                    {/* Enhanced toolbar for code pane */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.5 }}
                      className="bg-black/30 backdrop-blur-sm border-b border-gray-700/30 p-2 flex items-center justify-between"
                    >
                      <div className="flex space-x-2">
                        <button className="bg-black/40 hover:bg-black/60 rounded px-2 py-1 text-xs text-white/80 flex items-center">
                          {icons["code"]}
                          <span className="ml-1.5">{currentFramework}</span>
                        </button>

                        <button className="bg-black/40 hover:bg-black/60 rounded px-2 py-1 text-xs text-white/80 flex items-center">
                          {icons["settings"]}
                          <span className="ml-1.5">Settings</span>
                        </button>
                      </div>

                      <div>
                        <button className={`bg-${currentTheme.accent === 'purple' ? 'purple-600' :
                          currentTheme.accent === 'cyan' ? 'cyan-600' :
                            currentTheme.accent === 'orange' ? 'orange-600' :
                              currentTheme.accent === 'emerald' ? 'emerald-600' : 'purple-600'} 
                          hover:bg-${currentTheme.accent === 'purple' ? 'purple-700' :
                            currentTheme.accent === 'cyan' ? 'cyan-700' :
                              currentTheme.accent === 'orange' ? 'orange-700' :
                                currentTheme.accent === 'emerald' ? 'emerald-700' : 'purple-700'} 
                          rounded px-3 py-1 text-xs text-white font-medium flex items-center`}
                        >
                          {icons["download"]}
                          <span className="ml-1.5">Export</span>
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2, duration: 0.8 }}
                      className="p-3 h-full overflow-y-auto code-scrollbar"
                      style={{
                        maxHeight: "calc(100% - 40px)",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#4c1d95 #1f2937"
                      }}
                    >
                      <AnimatedCodeSnippet code={codeExample?.trim()} />

                      {/* Code validation badges */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.5, duration: 0.5 }}
                        className="mt-6 flex flex-wrap gap-2"
                      >
                        <div className="bg-green-500/20 text-green-400 text-xs rounded-full px-3 py-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Valid Syntax
                        </div>
                        <div className="bg-blue-500/20 text-blue-400 text-xs rounded-full px-3 py-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Optimized
                        </div>
                        <div className="bg-purple-500/20 text-purple-400 text-xs rounded-full px-3 py-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Best Practices
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Optimized floating code particles */}
                    {particles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        initial={{
                          x: particle.x + "%",
                          y: particle.y + "%",
                          opacity: 0,
                        }}
                        animate={{
                          y: [particle.y + "%", (particle.y - particle.speed * 2) + "%"],
                          opacity: [0, 0.6, 0],
                          rotate: Math.random() > 0.5 ? 8 : -8,
                        }}
                        transition={{
                          duration: particle.speed,
                          repeat: Infinity,
                          delay: particle.delay + 2.5,
                        }}
                        className="absolute text-xs font-mono text-blue-300 opacity-30 whitespace-nowrap"
                        style={{ fontSize: particle.size, lineHeight: '1' }}
                      >
                        {particle.text}
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sparkle effect on hover */}
        {hoverEffect === "sparkle" && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className={`absolute w-1 h-1 rounded-full bg-${i % 3 === 0 ? 'purple-400' :
                  i % 3 === 1 ? 'pink-400' : 'blue-400'
                  } shadow-lg`}
                initial={{
                  opacity: 0,
                  x: Math.random() * windowWidth,
                  y: Math.random() * 500,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [
                    Math.random() * 500,
                    Math.random() * 300 - 150
                  ],
                  scale: [0, Math.random() * 2 + 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 0.8 + Math.random(),
                  delay: Math.random() * 0.2
                }}
              />
            ))}
          </div>
        )}

        {/* Color wave effect */}
        {hoverEffect === "color" && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.5, 2],
                rotate: [0, 90],
              }}
              transition={{ duration: 1.5 }}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 top-24 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-sm rounded-lg py-2 px-4 shadow-xl border border-white/10 z-50"
          >
            Click to switch themes and customize your experience
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-4 h-4 bg-black/80 rotate-45 border-r border-b border-white/10"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced tech badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute -bottom-5 md:-bottom-6 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2"
        style={{ willChange: "transform" }}
      >
        {frameworks.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{
              y: -5,
              boxShadow: `0 10px 25px -5px rgba(${tech.color === 'blue-500' ? '59, 130, 246' :
                tech.color === 'cyan-400' ? '34, 211, 238' :
                  tech.color === 'green-500' ? '34, 197, 94' :
                    tech.color === 'red-500' ? '239, 68, 68' :
                      tech.color === 'orange-500' ? '249, 115, 22' :
                        '59, 130, 246'
                }, 0.4)`,
              scale: 1.05,
            }}
            transition={{
              delay: 2.5 + i * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className={`${i % 2 === 0 ? currentTheme.badge : "bg-white dark:bg-gray-800"
              } px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${i % 2 === 0 ? "text-white" : "text-gray-700 dark:text-gray-200"
              } border border-gray-200/10 dark:border-gray-700/50 flex items-center cursor-pointer`}
            style={{ willChange: "transform" }}
            onClick={() => setCurrentFramework(tech.name)}
          >
            <span className="mr-1.5">{tech.icon}</span>
            {tech.name}
          </motion.div>
        ))}
      </motion.div>

      {/* Feature highlight badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animateHero ? 1 : 0 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="absolute right-4 top-20 transform -translate-y-1/2 hidden lg:block"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{
              x: -5,
              boxShadow: `0 10px 25px -5px rgba(${feature.color === 'pink' ? '236, 72, 153' :
                feature.color === 'blue' ? '59, 130, 246' :
                  feature.color === 'purple' ? '147, 51, 234' :
                    feature.color === 'green' ? '34, 197, 94' :
                      '236, 72, 153'
                }, 0.4)`
            }}
            transition={{ delay: 3.2 + (index * 0.2), duration: 0.5 }}
            className={`bg-${feature.color}-500/20 backdrop-blur-sm border border-${feature.color}-500/30 text-${feature.color}-300 rounded-lg p-2 mb-3 text-xs flex items-center shadow-lg cursor-pointer`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {icons[feature.icon]}
            <span className="ml-1.5">{feature.title}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom action bar */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animateHero ? 1 : 0, y: animateHero ? 0 : 20 }}
        transition={{ delay: 3.8, duration: 0.6 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${currentTheme.button} rounded-full px-4 py-2 text-white text-sm font-medium shadow-lg flex items-center space-x-2`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          <span>Export Code</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium shadow-lg border border-white/10 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Custom CSS for scrollbars - optimized for less space
const customScrollbarStyles = `
.code-scrollbar::-webkit-scrollbar{width:4px}
.code-scrollbar::-webkit-scrollbar-track{background:rgba(31,41,55,0.5);border-radius:4px}
.code-scrollbar::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.5);border-radius:4px}
.code-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(79,70,229,0.8)}
`;

// Append the styles to the document or use a styled-components approach
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customScrollbarStyles;
  document.head.appendChild(styleElement);
}
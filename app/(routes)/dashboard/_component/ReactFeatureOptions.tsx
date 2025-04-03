"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Code2, Move, Palette, Zap, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animated floating particles component
const FloatingParticles = () => {
  return (
    <>
      {[...Array(12)].map((_, i) => (
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

export const REACT_OPTIONS = [
  {
    name: "Animations",
    value: "animations",
    icon: <Move className="h-5 w-5" />,
    description: "Add smooth transitions and motion effects",
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500 to-fuchsia-600",
    borderColor: "border-purple-200",
    hoverEffect: "hover:shadow-purple-200",
    bgGlow: "bg-purple-400/20",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
    color: "bg-pink-100 text-pink-600",
    gradient: "from-pink-500 to-rose-600",
    borderColor: "border-pink-200",
    hoverEffect: "hover:shadow-pink-200",
    bgGlow: "bg-pink-400/20",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="6"
          y1="19"
          x2="18"
          y2="19"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    description: "Fully responsive design for all screen sizes",
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-200",
    hoverEffect: "hover:shadow-blue-200",
    bgGlow: "bg-blue-400/20",
  },
  {
    name: "Performance Optimized",
    value: "performance",
    icon: <Zap className="h-5 w-5" />,
    description: "Optimized for speed and efficiency",
    color: "bg-amber-100 text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    borderColor: "border-amber-200",
    hoverEffect: "hover:shadow-amber-200",
    bgGlow: "bg-amber-400/20",
  },
  {
    name: "Modern Components",
    value: "components",
    icon: <Layers className="h-5 w-5" />,
    description: "Reusable, modular component architecture",
    color: "bg-emerald-100 text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-200",
    hoverEffect: "hover:shadow-emerald-200",
    bgGlow: "bg-emerald-400/20",
  },
  {
    name: "Visual Effects",
    value: "effects",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Eye-catching visual effects and interactions",
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-500 to-violet-600",
    borderColor: "border-indigo-200",
    hoverEffect: "hover:shadow-indigo-200",
    bgGlow: "bg-indigo-400/20",
  },
];

interface ReactFeatureOptionsProps {
  selectedOptions: string[];
  toggleOption: (option: string) => void;
}

const ReactFeatureOptions: React.FC<ReactFeatureOptionsProps> = ({
  selectedOptions,
  toggleOption,
}) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [animateHeader, setAnimateHeader] = useState(false);

  // Animate header periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateHeader(true);
      setTimeout(() => setAnimateHeader(false), 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg border border-purple-100 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-xl"></div>
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 opacity-20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute left-1/3 top-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 opacity-20 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10">
        <motion.h2
          className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-800"
          animate={animateHeader ? {
            textShadow: ["0 0 0px rgba(99, 102, 241, 0)", "0 0 10px rgba(99, 102, 241, 0.5)", "0 0 0px rgba(99, 102, 241, 0)"],
          } : {}}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="p-2 bg-indigo-100 rounded-lg shadow-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 className="h-6 w-6 text-indigo-600" />
          </motion.div>
          React Features
          <motion.span
            className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full"
            animate={{
              scale: [1, 1.05, 1],
              backgroundColor: ["rgba(224, 231, 255, 0.8)", "rgba(224, 231, 255, 1)", "rgba(224, 231, 255, 0.8)"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Customize
          </motion.span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REACT_OPTIONS.map((option) => {
            const isSelected = selectedOptions.includes(option.value);
            const isHovered = hoveredOption === option.value;

            return (
              <motion.button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                onMouseEnter={() => setHoveredOption(option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-4 rounded-lg flex items-center gap-3 transition-all
                   duration-300 overflow-hidden bg-white bg-opacity-80  border ${option.borderColor} hover:shadow-md ${option.hoverEffect}`
                }
              >
                

                {/* Animated particles on hover/selection */}
                <AnimatePresence>
                  {(isSelected || isHovered) && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-white"
                          style={{
                            width: Math.random() * 6 + 3,
                            height: Math.random() * 6 + 3,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{
                            x: [0, Math.random() * 40 - 20],
                            y: [0, Math.random() * 40 - 20],
                            opacity: [0, 0.5, 0],
                          }}
                          transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                <motion.div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${isSelected ? option.color : "bg-gray-100"
                    }`}
                  animate={
                    isSelected
                      ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 rgba(0, 0, 0, 0.1)",
                          "0 4px 10px rgba(0, 0, 0, 0.2)",
                          "0 0 0 rgba(0, 0, 0, 0.1)"
                        ]
                      }
                      : {}
                  }
                  transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                >
                  <motion.span
                    className={isSelected ? "" : "text-gray-400"}
                    animate={
                      isSelected
                        ? { rotate: [0, 5, 0, -5, 0] }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isSelected ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  >
                    {option.icon}
                  </motion.span>
                </motion.div>

                <div className="text-left flex-1">
                  <motion.p
                    className="font-medium text-gray-800 dark:text-gray-100 "
                    animate={
                      isSelected
                        ? {
                          scale: [1, 1.03, 1]
                        }
                        : {}
                    }
                    transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                  >
                    {option.name}
                  </motion.p>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                </div>

                {isSelected ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="ml-auto bg-white rounded-full p-1 shadow-sm"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <div className="ml-auto w-7 h-7 rounded-full border-2 border-gray-200"></div>
                )}

                {isSelected && (
                  <>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-green-500 border-l-transparent border-b-transparent"
                    ></motion.span>
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 0.3 }}
                      transition={{ duration: 0.5 }}
                      className="absolute -bottom-1 -left-1 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                    ></motion.div>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <motion.div
              className="w-3 h-3 rounded-full bg-indigo-400 mr-2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            ></motion.div>
            <p className="text-xs text-indigo-600 font-medium">
              {selectedOptions.length} feature
              {selectedOptions.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {/* Feature count visualization */}
          <div className="flex items-center mr-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" style={{ width: '100px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(selectedOptions.length / REACT_OPTIONS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
          </div>

          {selectedOptions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                selectedOptions.forEach((opt) => toggleOption(opt))
              }
              className="text-xs px-3 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors flex items-center"
            >
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 7L5 7M14 11L10 11M16 15H8M9 3H15M9 3C9 3 9 3 9 3C7.89543 3 7 3.89543 7 5V5M15 3C15 3 15 3 15 3C16.1046 3 17 3.89543 17 5V5M7 5V19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clear All
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReactFeatureOptions;

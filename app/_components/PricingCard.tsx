"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
  StarIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface PricingCardProps {
  title: string;
  price: number;
  originalPrice: string | number;
  credits: string;
  features: string[];
  popular: boolean;
  cta: string;
  save: string | undefined;
  color: string;
  badge: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  originalPrice,
  credits,
  features,
  popular,
  cta,
  save,
  color = "purple",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animateValue, setAnimateValue] = useState(0);

  // Extract the numeric value from credits string for animation
  const creditsValue = parseInt(credits.match(/\d+/)?.[0] || "0");

  // Color schemes based on card type
  const colorSchemes = {
    purple: {
      gradient: "from-purple-500 via-indigo-500 to-indigo-600",
      highlight: "text-indigo-200",
      iconColor: popular ? "text-purple-300" : "text-purple-500",
      ctaGradient: "from-indigo-500 to-purple-600",
      accent: "bg-purple-300",
      featureHighlight: popular ? "bg-indigo-300" : "bg-purple-400",
      saveGradient: "from-red-500 to-pink-500",
    },
    blue: {
      gradient: "from-blue-500 via-sky-500 to-cyan-600",
      highlight: "text-sky-200",
      iconColor: popular ? "text-sky-300" : "text-blue-500",
      ctaGradient: "from-blue-500 to-sky-600",
      accent: "bg-sky-300",
      featureHighlight: popular ? "bg-sky-300" : "bg-blue-400",
      saveGradient: "from-amber-500 to-orange-500",
    },
    teal: {
      gradient: "from-teal-500 via-emerald-500 to-green-600",
      highlight: "text-emerald-200",
      iconColor: popular ? "text-emerald-300" : "text-teal-500",
      ctaGradient: "from-emerald-500 to-teal-600",
      accent: "bg-emerald-300",
      featureHighlight: popular ? "bg-emerald-300" : "bg-teal-400",
      saveGradient: "from-violet-500 to-fuchsia-500",
    },
    orange: {
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      highlight: "text-amber-200",
      iconColor: popular ? "text-amber-300" : "text-orange-500",
      ctaGradient: "from-orange-500 to-amber-600",
      accent: "bg-amber-300",
      featureHighlight: popular ? "bg-amber-300" : "bg-orange-400",
      saveGradient: "from-cyan-500 to-blue-500",
    },
  };

  // Fix: Add fallback to prevent undefined scheme
  const scheme = colorSchemes[color as keyof typeof colorSchemes] || colorSchemes.purple;

  // Animate the credits value counter
  useEffect(() => {
    if (isVisible) {
      const duration = 1500;
      const interval = 15;
      const steps = duration / interval;
      const increment = creditsValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current > creditsValue) {
          current = creditsValue;
          clearInterval(timer);
        }
        setAnimateValue(Math.floor(current));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible, creditsValue]);

  // Random shapes for decoration
  const shapes = [
    {
      size: "w-16 h-16",
      top: "top-1/4",
      left: "right-0",
      rotate: "rotate-12",
      delay: 0.2,
    },
    {
      size: "w-8 h-8",
      top: "bottom-1/3",
      left: "left-0",
      rotate: "-rotate-12",
      delay: 0.4,
    },
    {
      size: "w-12 h-12",
      top: "bottom-0",
      left: "right-1/4",
      rotate: "rotate-45",
      delay: 0.6,
    },
    {
      size: "w-10 h-10",
      top: "top-0",
      left: "left-1/3",
      rotate: "-rotate-45",
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        scale: 1.02,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onViewportEnter={() => setIsVisible(true)}
      className={`rounded-2xl overflow-hidden relative ${
        popular
          ? `bg-gradient-to-br ${scheme.gradient} text-white shadow-xl border-4 border-white`
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {/* Background decorative elements */}
      {popular && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div
            className={`absolute bottom-0 left-0 w-32 h-32 ${scheme.accent} opacity-10 rounded-full translate-y-1/2 -translate-x-1/2`}
          ></div>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id={`pricingGrid-${color}`}
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill={`url(#pricingGrid-${color})`}
              />
            </svg>
          </div>

          {/* Decorative shapes */}
          {shapes.map((shape, index) => (
            <motion.div
              key={index}
              className={`absolute ${shape.size} ${shape.top} ${shape.left} ${shape.rotate} bg-white opacity-5 rounded-lg`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.05, scale: 1, rotate: shape.rotate }}
              transition={{ delay: shape.delay, duration: 0.5 }}
            />
          ))}

          {/* Animated dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white opacity-20"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: -20,
                  opacity: 0.1 + Math.random() * 0.2,
                }}
                animate={{
                  y: ["0%", "100%"],
                  opacity: [0.1 + Math.random() * 0.2, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 20,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {popular && (
        <motion.div
          className={`bg-gradient-to-r ${scheme.gradient} text-white text-center py-2 text-sm font-semibold relative overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 3,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
          <div className="relative z-10 flex items-center justify-center">
            <SparklesIcon className="h-4 w-4 mr-1 animate-pulse" />
            MOST POPULAR
            <SparklesIcon className="h-4 w-4 ml-1 animate-pulse" />
          </div>
        </motion.div>
      )}

      <div className="p-8 relative z-10">
        <motion.div
          className="flex items-center mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={
              isHovered
                ? {
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{ duration: 1 }}
            className="mr-2"
          >
            {popular ? (
              <FireIcon className={`h-6 w-6 ${scheme.iconColor}`} />
            ) : (
              <StarIcon className={`h-6 w-6 ${scheme.iconColor}`} />
            )}
          </motion.div>
          <h3
            className={`text-2xl font-bold ${
              popular ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
        </motion.div>

        <motion.div
          className="mb-6 flex items-baseline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {originalPrice && (
            <span
              className={`text-2xl font-bold line-through mr-2 ${
                popular ? scheme.highlight : "text-gray-500"
              }`}
            >
              ₹{originalPrice}
            </span>
          )}
          <motion.span
            className="text-5xl font-bold relative"
            animate={
              isHovered
                ? {
                    scale: [1, 1.1, 1],
                    textShadow: popular
                      ? "0 0 8px rgba(255,255,255,0.5)"
                      : "none",
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            ₹{price}
            {/* Floating particles on hover */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1.5 h-1.5 rounded-full ${
                        popular ? "bg-yellow-300" : "bg-indigo-500"
                      }`}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 0.8,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 60,
                        y: -Math.random() * 40 - 10,
                        opacity: 0,
                        scale: [1, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 + Math.random() * 0.5 }}
                    />
                  ))}
                  <motion.span
                    className="absolute -top-2 -right-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <SparklesIcon
                      className={`h-5 w-5 ${
                        popular ? "text-yellow-300" : "text-yellow-500"
                      }`}
                    />
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </motion.span>
  
        </motion.div>

        {/* Display Credits with animation */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className={`${
              popular
                ? "bg-white/10 backdrop-blur-sm border border-white/20"
                : `bg-${color}-50 border border-${color}-100`
            } rounded-lg px-4 py-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <BoltIcon className={`h-5 w-5 mr-2 ${scheme.iconColor}`} />
                </motion.div>
                <span
                  className={`${
                    popular ? "text-white" : `text-${color}-700`
                  } text-lg font-medium`}
                >
                  {isVisible ? (
                    <>
                      <span className="tabular-nums">{animateValue}</span>{" "}
                      credits
                    </>
                  ) : (
                    credits
                  )}
                </span>
              </div>

             
            </div>

            {/* Credit value visualization */}
            <div className="mt-2 h-2.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  popular ? "bg-white" : `bg-${color}-500`
                } rounded-full relative`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (creditsValue / 200) * 100)}%`,
                }}
                transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
              >
                {/* Animated glow effect */}
                <motion.div
                  className="absolute top-0 right-0 h-full w-4 bg-white opacity-50 rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {save && (
          <motion.div
            className={`absolute top-4 right-4 bg-gradient-to-r ${scheme.saveGradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.6,
            }}
            whileHover={{
              scale: 1.1,
              rotate: -5,
            }}
          >
            {save}
            <motion.div
              className="absolute inset-0 bg-white opacity-20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </motion.div>
        )}

        <motion.ul
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {features.map((feature: string, index: number) => (
            <motion.li
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 5 + index,
                  }}
                  className={`absolute inset-0 ${scheme.featureHighlight} rounded-full opacity-30 blur-sm`}
                ></motion.div>
                <CheckCircleIcon
                  className={`h-5 w-5 mr-2 flex-shrink-0 relative z-10 ${scheme.iconColor}`}
                />
              </div>
              <span
                className={`${popular ? scheme.highlight : "text-gray-600"}`}
              >
                {feature}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 px-6 rounded-lg font-semibold relative overflow-hidden ${
            popular
              ? "bg-white text-indigo-600 shadow-lg"
              : `bg-gradient-to-r ${scheme.ctaGradient} text-white shadow-md`
          }`}
        >
          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: isHovered ? [0, 360] : 0,
              }}
              transition={{ duration: 1 }}
            >
              <BoltIcon className="h-4 w-4 mr-2" />
            </motion.div>
            {cta}
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PricingCard;

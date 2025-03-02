"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import ClientFloatingElements from "./ClientFloatingElements";
import AnimatedCodeSnippet from "./AnimatedCodeSnippet";
import { useEffect, useRef, useState } from "react";

const containerRef = useRef<HTMLDivElement>(null);

const [currentTestimonial, setCurrentTestimonial] = useState(0);
const [animateHero, setAnimateHero] = useState(false);
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
});

// Parallax effect values
const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

const testimonials = [
  {
    quote:
      "This tool has completely transformed our design-to-development workflow. We've cut our frontend development time by 70%!",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechFlow Inc.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
  },
  {
    quote:
      "As a solo developer, Img2Code feels like having an entire frontend team at my fingertips. The code quality is outstanding.",
    author: "Michael Chen",
    role: "Indie Developer",
    company: "PixelPerfect Apps",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
  },
  {
    quote:
      "We've integrated Img2Code into our CI/CD pipeline and it's been a game-changer for our rapid prototyping process.",
    author: "Jessica Williams",
    role: "Lead Engineer",
    company: "Innovate Solutions",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4,
  },
];
const codeExample = `import React from 'react';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;`;
useEffect(() => {
  // Start hero animation after page load
  const timer = setTimeout(() => setAnimateHero(true), 500);

  // Auto-rotate testimonials
  const testimonialTimer = setInterval(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, 5000);

  return () => {
    clearTimeout(timer);
    clearInterval(testimonialTimer);
  };
}, []);

// Abstract shapes component for enhanced background visuals
const AbstractShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Larger gradient circle */}
      <div className="absolute -top-64 -right-64 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl" />

      {/* Small decorative elements */}
      <motion.div
        className="absolute top-32 left-16 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg rotate-12 opacity-40"
        animate={{
          y: [0, -15, 0],
          rotate: [12, 45, 12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50 blur-md"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Code symbols background */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-8xl font-mono text-purple-200/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 2 }}
      >
        {"{"}
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-8xl font-mono text-blue-200/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 2 }}
      >
        {"}"}
      </motion.div>
    </div>
  );
};

export default function HeroSection() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Begin animation after component mounts
    setIsAnimating(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Enhanced animated background elements */}
      <ClientFloatingElements />
      <AbstractShapes />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Enhanced badge with animated glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900 dark:to-blue-900 dark:text-purple-200 shadow-lg">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 mr-2"></span>
              <span className="relative z-10">New AI Model Released</span>
              <motion.span
                className="absolute inset-0 rounded-full bg-white/20 dark:bg-white/10"
                animate={{
                  boxShadow: [
                    "0 0 5px 2px rgba(168, 85, 247, 0.4)",
                    "0 0 20px 10px rgba(168, 85, 247, 0.2)",
                    "0 0 5px 2px rgba(168, 85, 247, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.span>
            </span>
          </motion.div>

          {/* Enhanced title with more vibrant gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-8 leading-tight tracking-tight"
          >
            Turn Designs into Code
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative"
            >
              in Seconds
              <motion.span
                className="absolute -right-16 -top-1 text-2xl"
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.3, duration: 0.5, type: "spring" }}
              >
                ✨
              </motion.span>
            </motion.span>
          </motion.h1>

          {/* Enhanced description with background highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mb-12 mx-auto"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            ></motion.span>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-6 py-4">
              Transform your visual designs into clean, production-ready code
              automatically. Powered by AI for developers who value speed and
              precision.
            </p>
          </motion.div>

          {/* Enhanced CTA buttons with more vibrant gradients */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              href="/dashboard"
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl flex items-center justify-center group relative overflow-hidden"
            >
              <span className="relative z-10">Start Converting Now</span>
              <SparklesIcon className="h-5 w-5 ml-2 relative z-10" />
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-700 via-violet-700 to-blue-700"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              ></motion.span>
            </motion.a>

            <motion.a
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              href="#demo"
              className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center group"
            >
              Watch Demo
              <svg
                className="h-5 w-5 ml-2 group-hover:animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.a>
          </motion.div>

          {/* Enhanced demo preview with improved visuals */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-24 rounded-3xl shadow-2xl overflow-hidden border-8 border-white dark:border-gray-700 mx-auto max-w-5xl relative"
          >
            {/* Mac-style window controls */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="text-white text-xs font-mono ml-4 opacity-70">
                design-to-code-converter.app
              </div>
            </div>

            <div className="bg-gray-900 p-8 h-96 flex items-center justify-center relative">
              {/* Enhanced split view animation with better visuals */}
              <div className="absolute inset-0 flex">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: animateHero ? "50%" : "100%" }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-cover bg-center border-r border-gray-700 relative"
                  style={{
                    backgroundImage:
                      "url('https://placehold.co/600x400/5271ff/ffffff?text=UI+Design')",
                  }}
                >
                  {animateHero && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center"
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Design Input
                      </motion.div>

                      {/* Animated scan effect */}
                      <motion.div
                        initial={{ top: 0, opacity: 0 }}
                        animate={{
                          top: ["0%", "100%", "0%"],
                          opacity: [0.7, 0.7, 0],
                        }}
                        transition={{
                          duration: 3,
                          times: [0, 0.5, 1],
                          delay: 2.5,
                          repeat: 1,
                        }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg"
                      ></motion.div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: animateHero ? "50%" : "0%" }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gray-900 overflow-hidden relative"
                >
                  {animateHero && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center"
                      >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        Generated Code
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 0.8 }}
                        className="p-4 h-full overflow-y-auto"
                      >
                        <AnimatedCodeSnippet code={codeExample} />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>

              {!animateHero && (
                <div className="relative z-10 bg-gray-800/80 backdrop-blur-sm px-8 py-6 rounded-xl shadow-xl">
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-6 w-6 text-purple-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-gray-300 font-medium">
                      AI Processing Your Design...
                    </span>
                  </div>

                  <div className="mt-3 w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Added tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2"
            >
              {["React", "Tailwind", "Vue", "Angular"].map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 3 + i * 0.1 }}
                  className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-lg text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Added accent decorations */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
    </div>
  );
}

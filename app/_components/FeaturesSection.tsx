"use client";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  PhotoIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { BoltIcon, ChartBarIcon, SparklesIcon } from "lucide-react";

const features = [
  {
    name: "Instant Conversion",
    description: "Transform images to clean code in seconds using AI",
    icon: BoltIcon,
    emoji: "⚡",
    color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    lightColor: "bg-purple-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
  },
  {
    name: "Multi-Language Support",
    description: "Supports React, HTML, CSS, Vue, and more",
    icon: CodeBracketIcon,
    emoji: "💻",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    lightColor: "bg-blue-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    name: "Smart Design Recognition",
    description: "Accurately detects layouts and components",
    icon: PhotoIcon,
    emoji: "🎨",
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    lightColor: "bg-pink-100",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
  },
  {
    name: "Export Options",
    description: "Download code or export directly to GitHub",
    icon: SparklesIcon,
    emoji: "🚀",
    color: "bg-gradient-to-br from-orange-500 to-amber-600",
    lightColor: "bg-orange-100",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
  },
  {
    name: "Team Collaboration",
    description: "Share projects and collaborate with your team",
    icon: UserGroupIcon,
    emoji: "👥",
    color: "bg-gradient-to-br from-yellow-400 to-amber-500",
    lightColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
  },
  {
    name: "Advanced Analytics",
    description: "Get insights on conversion quality and performance",
    icon: ChartBarIcon,
    emoji: "📊",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    lightColor: "bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function FeaturesSection() {
  const renderShapes = () => {
    // Set shape count based on screen size
    const shapeCount =
      typeof window !== "undefined" ? (window.innerWidth < 768 ? 8 : 15) : 15;

    return [...Array(shapeCount)].map((_, i) => (
      <motion.div
        key={i}
        initial={{
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          opacity: 0,
          rotate: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          opacity: 0.2,
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          rotate: Math.random() * 720,
          scale: Math.random() * 0.5 + 0.5,
        }}
        transition={{
          duration: 15 + Math.random() * 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={`absolute ${
          i % 4 === 0
            ? "rounded-lg bg-purple-500"
            : i % 4 === 1
            ? "rounded-full bg-blue-500"
            : i % 4 === 2
            ? "bg-pink-500"
            : "bg-emerald-500 rounded-md"
        } opacity-5`}
        style={{
          width: ((i % 3) + 1) * 12 + "px",
          height: ((i % 3) + 1) * 12 + "px",
          clipPath:
            i % 4 === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
        }}
      />
    ));
  };

  return (
    <div
      id="features"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-purple-50"
    >
      {/* Enhanced background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute top-0 right-0 w-full md:w-2/3 h-96 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 filter blur-3xl opacity-10 transform -translate-y-1/2 translate-x-1/3"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-full md:w-2/3 h-96 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 filter blur-3xl opacity-10 transform translate-y-1/2 -translate-x-1/3"
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-white via-white to-transparent opacity-70" />

      {/* Improved floating geometric shapes */}
      {typeof window !== "undefined" && renderShapes()}

      {/* Glowing circular light */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-400 filter blur-3xl opacity-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          {/* Animated line becomes a full circle */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 opacity-20"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 0.8, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 opacity-40"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 0.6, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400"
            />
          </div>

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-purple-600 tracking-wide uppercase bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 px-6 py-2 rounded-full shadow-sm"
          >
            ✨ Powerful Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
          >
            Why Choose Img2Code?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our platform offers everything you need to streamline your
            design-to-code workflow with AI-powered precision
          </motion.p>

          {/* Enhanced animated dots */}
          <motion.div
            className="mt-8 flex justify-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === 0
                    ? "bg-purple-600"
                    : i === 1
                    ? "bg-blue-500"
                    : i === 2
                    ? "bg-cyan-500"
                    : i === 3
                    ? "bg-pink-500"
                    : "bg-indigo-500"
                }`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Responsive feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className={`p-6 md:p-8 rounded-2xl backdrop-filter backdrop-blur-sm bg-white bg-opacity-70 transition-all duration-300 border ${feature.borderColor} relative overflow-hidden group`}
            >
              {/* Enhanced background elements */}
              <motion.div
                className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Decorative corner accent - more prominent */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div
                  className={`absolute transform rotate-45 translate-x-12 -translate-y-12 w-24 h-24 ${feature.color} opacity-20`}
                ></div>
              </div>

              {/* Decorative circles */}
              <motion.div
                className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-5 bg-gradient-radial"
                style={{
                  background: `radial-gradient(circle, ${
                    feature.color.replace("bg-gradient-to-br", "").split(" ")[1]
                  } 0%, transparent 70%)`,
                }}
              />

              {/* Enhanced icon with 3D effect */}
              <motion.div
                className={`w-16 h-16 rounded-xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg relative z-10 border border-white border-opacity-20`}
                whileHover={floatingAnimation}
                style={{
                  boxShadow: `0 10px 15px -3px ${feature.color
                    .replace("bg-gradient-to-br", "")
                    .split(" ")[1]
                    .replace("to-", "")}30`,
                }}
              >
                <feature.icon className="h-8 w-8" />

                {/* Small glint animation */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <div className="w-16 h-1 bg-white opacity-30 rotate-45 transform -translate-x-8 translate-y-8" />
                </motion.div>
              </motion.div>

              {/* Floating emoji with enhanced animation */}
              <motion.div
                className="absolute top-4 right-4 text-4xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              >
                {feature.emoji}
              </motion.div>

              <h3
                className={`text-xl md:text-2xl font-bold mb-3 ${feature.textColor}`}
              >
                {feature.name}
              </h3>

              <p className="text-gray-600 relative z-10">
                {feature.description}
              </p>

              {/* Enhanced "Learn more" button */}
              <motion.div className="mt-6 relative" whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className={`${feature.textColor} font-medium flex items-center`}
                >
                  Learn more
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </motion.div>
                </a>

                {/* Animated underline with gradient */}
                <motion.div
                  className={`h-0.5 ${feature.color} mt-1 w-0 group-hover:w-28 transition-all duration-300`}
                />
              </motion.div>

              {/* Feature tag */}
              {index < 2 && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Popular
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced call-to-action section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
         
          {/* Enhanced wave animation with multiple layers */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* First wave layer */}
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full transform translate-y-1"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 }}
                transition={{ duration: 2 }}
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                fill="url(#paint0_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="120"
                  x2="1440"
                  y2="120"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Second wave layer */}
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full absolute bottom-0"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 2.5, delay: 0.5 }}
                d="M0,36L48,40C96,44,192,52,288,55.3C384,59,480,59,576,55.3C672,52,768,44,864,48C960,52,1056,68,1152,66.7C1248,65,1344,47,1392,37.3L1440,28L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                fill="url(#paint1_linear)"
              />
              <defs>
                <linearGradient
                  id="paint1_linear"
                  x1="0"
                  y1="120"
                  x2="1440"
                  y2="120"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D946EF" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Third wave layer */}
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full absolute bottom-0 transform translate-y-3"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 3, delay: 1 }}
                d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,74.7C960,75,1056,85,1152,90.7C1248,96,1344,96,1392,96L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                fill="url(#paint2_linear)"
              />
              <defs>
                <linearGradient
                  id="paint2_linear"
                  x1="0"
                  y1="120"
                  x2="1440"
                  y2="120"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#06B6D4" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

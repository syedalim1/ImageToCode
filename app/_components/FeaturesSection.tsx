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
    name: "Analytics Dashboard",
    description: "Track your conversions and optimize workflow",
    icon: ChartBarIcon,
    emoji: "📊",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    lightColor: "bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-700",
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
  return (
    <div id="features" className="py-24 relative overflow-hidden bg-white">
      {/* Decorative blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute top-10 right-10 w-96 h-96 rounded-full bg-purple-500 filter blur-3xl opacity-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-500 filter blur-3xl opacity-10"
      />

      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            opacity: 0.2,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`absolute w-8 h-8 ${
            i % 3 === 0
              ? "rounded-lg bg-purple-500"
              : i % 3 === 1
              ? "rounded-full bg-blue-500"
              : "clip-path-triangle bg-pink-500"
          } opacity-5`}
          style={{
            clipPath:
              i % 3 === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto mb-6"
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-purple-600 tracking-wide uppercase bg-purple-100 px-4 py-1 rounded-full"
          >
            Powerful Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
          >
            Why Choose Img2Code?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto"
          >
            Our platform offers everything you need to streamline your
            design-to-code workflow
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-600"
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className={`p-8 rounded-2xl ${feature.lightColor} transition-all duration-300 border ${feature.borderColor} backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Background gradient that shows on hover */}
              <motion.div
                className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div
                  className={`absolute transform rotate-45 translate-x-8 -translate-y-8 w-16 h-16 ${feature.color} opacity-20`}
                ></div>
              </div>

              <motion.div
                className={`w-16 h-16 rounded-xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg relative z-10`}
                whileHover={floatingAnimation}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>

              <motion.div
                className="absolute top-4 right-4 text-3xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                {feature.emoji}
              </motion.div>

              <h3 className={`text-2xl font-bold mb-4 ${feature.textColor}`}>
                {feature.name}
              </h3>

              <p className="text-gray-600 relative z-10">
                {feature.description}
              </p>

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

                {/* Animated underline */}
                <motion.div
                  className={`h-0.5 ${feature.color} mt-1 w-0 group-hover:w-24 transition-all duration-300`}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom wave decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Features
          </motion.button>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

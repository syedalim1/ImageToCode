"use client";

import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    value: "10M+",
    label: "Lines of Code Generated",
    icon: CodeBracketIcon,
    color: "from-pink-500 to-purple-600",
  },
  {
    value: "99%",
    label: "Accuracy Rate",
    icon: CheckCircleIcon,
    color: "from-green-400 to-teal-500",
  },
  {
    value: "10+",
    label: "Countries",
    icon: GlobeAltIcon,
    color: "from-blue-500 to-cyan-400",
  },
  {
    value: "24/7",
    label: "Support Available",
    icon: ClockIcon,
    color: "from-orange-400 to-amber-500",
  },
  {
    value: "5000+",
    label: "Happy Clients",
    icon: UserGroupIcon,
    color: "from-red-500 to-pink-500",
  },
  {
    value: "100+",
    label: "Features",
    icon: SparklesIcon,
    color: "from-yellow-400 to-amber-500",
  },
];

export default function StatsSection() {
  return (
    <div className="py-24 bg-gradient-to-r from-indigo-900 via-purple-800 to-fuchsia-800 relative overflow-hidden">
      {/* Animated background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-white opacity-20"
          initial={{
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
          }}
          animate={{
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500 filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center text-white mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Impressive{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300">
            Statistics
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-xl border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ rotate: 0 }}
                whileInView={{ rotate: 360 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <p className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  {stat.value}
                </p>
              </motion.div>

              <p className="text-lg text-purple-100 font-medium">
                {stat.label}
              </p>

              {/* Animated underline */}
              <motion.div
                className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-4 mx-auto`}
                initial={{ width: 0 }}
                whileInView={{ width: "50%" }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.2, pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,117.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
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
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#D946EF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  CodeBracketIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Stat {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
  shadow: string;
}

interface CountUpState {
  [key: string]: number;
}

const stats: Stat[] = [
  {
    value: "10M+",
    label: "Lines of Code Generated",
    icon: CodeBracketIcon,
    color: "from-pink-500 to-purple-600",
    shadow: "shadow-pink-500/30",
  },
  {
    value: "99%",
    label: "Accuracy Rate",
    icon: CheckCircleIcon,
    color: "from-green-400 to-teal-500",
    shadow: "shadow-green-500/30",
  },
  {
    value: "10+",
    label: "Countries",
    icon: GlobeAltIcon,
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/30",
  },
  {
    value: "24/7",
    label: "Support Available",
    icon: ClockIcon,
    color: "from-orange-400 to-amber-500",
    shadow: "shadow-orange-500/30",
  },
  {
    value: "5000+",
    label: "Happy Clients",
    icon: UserGroupIcon,
    color: "from-red-500 to-pink-500",
    shadow: "shadow-red-500/30",
  },
  {
    value: "100+",
    label: "Features",
    icon: SparklesIcon,
    color: "from-yellow-400 to-amber-500",
    shadow: "shadow-yellow-500/30",
  },
];

export default function EnhancedStatsSection() {
  const [countUp, setCountUp] = useState<CountUpState>({});
  const controls = useAnimation();

  // Counter animation for numbers
  useEffect(() => {
    const newCountUp: CountUpState = {};
    const timers: NodeJS.Timeout[] = [];

    stats.forEach((stat) => {
      const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ""));
      newCountUp[stat.label] = 0;

      const timer = setTimeout(() => {
        let count = 0;
        const interval = setInterval(() => {
          count += numericValue / 20;
          if (count >= numericValue) {
            clearInterval(interval);
            newCountUp[stat.label] = numericValue;
            setCountUp({ ...newCountUp });
          } else {
            newCountUp[stat.label] = Math.floor(count);
            setCountUp({ ...newCountUp });
          }
        }, 50);
        timers.push(interval);
      }, 500);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // Scroll animation trigger
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <div className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Dynamic animated background particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-white 
            ${
              i % 3 === 0
                ? "w-6 h-6 opacity-10"
                : i % 3 === 1
                ? "w-4 h-4 opacity-15"
                : "w-2 h-2 opacity-20"
            }`}
          initial={{
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
            scale: [
              Math.random() * 0.5 + 0.5,
              Math.random() * 1 + 0.5,
              Math.random() * 0.5 + 0.5,
            ],
          }}
          transition={{
            duration: 15 + Math.random() * 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Enhanced glowing orb effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500 filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500 filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-pink-500 filter blur-3xl opacity-15"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />

      {/* 3D-like mesh grid background effect */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ top: `${10 * i}%` }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-white to-transparent"
            style={{ left: `${10 * i}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-5xl font-bold text-white mb-4">
            Impressive{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Statistics
            </motion.span>
          </h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.p
            className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Our platform delivers outstanding results and exceptional
            performance across all metrics
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                type: "spring",
                stiffness: 50,
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.2 },
              }}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white shadow-xl border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden ${stat.shadow}`}
            >
              {/* Decorative corner accent */}
              <div
                className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-30 blur-xl`}
              ></div>

              <motion.div
                className="flex justify-center mb-8"
                initial={{ rotate: 0 }}
                whileInView={{ rotate: 360 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center ${stat.shadow}`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <stat.icon className="h-10 w-10 text-white" />
                  </motion.div>
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
                className="relative"
              >
                <p
                  className={`text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}
                >
                  {stat.value.includes("M+")
                    ? `${countUp[stat.label] || 0}M+`
                    : stat.value.includes("%")
                    ? `${countUp[stat.label] || 0}%`
                    : countUp[stat.label] || stat.value}
                </p>

                {/* Floating particles around the numbers */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100,
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              <p className="text-lg text-purple-100 font-medium">
                {stat.label}
              </p>

              {/* Enhanced animated underline */}
              <motion.div
                className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-4 mx-auto`}
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              />

              {/* Bottom shine effect */}
              <motion.div
                className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  left: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
}

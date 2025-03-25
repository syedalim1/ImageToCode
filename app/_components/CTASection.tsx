"use client";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Clock, Code, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Main gradient background with enhanced colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600"></div>

      {/* Animated overlay patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTAgNjBMMjkgMjl2N0wwIDYweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-30 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Small floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-60"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full border border-white border-opacity-30">
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm font-semibold text-white flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2" /> NEW FEATURE: AI-POWERED
                COMPONENTS
              </motion.span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Transform Your
            <span className="block md:inline md:ml-3">Design Workflow?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-purple-100 mb-12"
          >
            Join thousands of developers saving hours every week with our
            powerful image-to-code technology
          </motion.p>

          {/* Stats section - new addition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: Users, value: "10,000+", label: "Active Users" },
              { icon: Clock, value: "25+ hrs", label: "Saved Weekly" },
              { icon: Code, value: "1M+", label: "Components Created" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20"
              >
                <div className="flex flex-col items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-200 mb-2" />
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-purple-100">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons - enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg group relative overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center">
                Get Started For Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white via-purple-100 to-white z-0"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white border-opacity-50 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors duration-300 w-full sm:w-auto"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Testimonial card - new addition */}
        
        </motion.div>
      </div>

      
    </div>
  );
}

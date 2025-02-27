"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Rocket,
  Brain,
  Code,
  Bot,
  ChevronRight,
  Clock,
  Star,
  Cpu,
  Lock,
  Shield,
  Lightbulb,
  Building2,
  LineChart,
  Users,
  Bell,
  ArrowUp,
  Database,
  Layers,
  Workflow,
  Laptop,
  Server,
  Cloud,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/app/_components/Footer";

export default function ComingSoon() {
  const [animateHero, setAnimateHero] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effect values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Set fixed launch date to April 3, 2025
  useEffect(() => {
    const launchDate = new Date("April 3, 2025");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    // Start hero animation after page load
    const animationTimer = setTimeout(() => setAnimateHero(true), 500);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  const features = [
    {
      name: "Advanced AI Processing",
      description: "Cutting-edge algorithms for unparalleled performance",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Seamless Integration",
      description: "Works with your existing tools and workflows",
      icon: Code,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Intelligent Automation",
      description: "Save time with smart, adaptive automation",
      icon: Bot,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Enterprise Security",
      description: "Bank-level encryption and data protection",
      icon: Shield,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Cloud Infrastructure",
      description: "Scalable and reliable cloud-based architecture",
      icon: Cloud,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      name: "Data Analytics",
      description: "Powerful insights from your business data",
      icon: BarChart,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div
      className="bg-gradient-to-b from-indigo-50 to-purple-50 min-h-screen overflow-x-hidden"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.1 ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      {/* Enhanced professional background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes for a more professional look */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-bl-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-[200px]" />
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Additional decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-indigo-300/20 rounded-lg rotate-45" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-purple-300/20 rounded-full" />
        <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-md rotate-12" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(to right, #9333ea 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating tech elements */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-12 h-12 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Database className="w-6 h-6 text-indigo-600" />
        </motion.div>

        <motion.div
          className="absolute top-[25%] right-[15%] w-10 h-10 bg-white/80 backdrop-blur-md rounded-lg shadow-lg flex items-center justify-center"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Layers className="w-5 h-5 text-purple-600" />
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] left-[20%] w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Server className="w-7 h-7 text-blue-600" />
        </motion.div>
      </div>

      {/* Hero Section - Enhanced with more graphics */}
      <div className="relative bg-white overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 mr-2"></span>
                Coming Soon
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center justify-center">
                <Zap className="h-10 w-10 md:h-14 md:w-14 mr-3 text-indigo-600" />
                CODENOVATECH
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            >
              Our Revolutionary AI Product
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
              >
                Launching April 3
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto"
            >
              We're building something extraordinary that will transform the way
              you work with AI. Our revolutionary product combines cutting-edge
              technology with intuitive design to deliver unprecedented results
              for businesses and developers.
            </motion.p>

            {/* Countdown Timer with Launch Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-md font-medium bg-indigo-100 text-indigo-800">
                  <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                  Official Launch: April 3, 2025
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-3 border border-indigo-100"
                  >
                    <div className="text-2xl md:text-4xl font-bold text-indigo-600">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-gray-500 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced CTA buttons */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
                  size="lg"
                >
                  Get Notified
                  <Bell className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="bg-white text-purple-600 border-2 border-purple-200 px-6 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
                  size="lg"
                >
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Professional Product Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 rounded-3xl shadow-2xl overflow-hidden border-8 border-white mx-auto max-w-5xl relative"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="bg-gray-900 p-6 h-[450px] flex items-center justify-center relative">
                {/* More professional product visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-4xl mx-auto h-full flex items-center justify-center">
                    {/* Main product display */}
                    <div className="relative z-10 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-2xl w-full max-w-3xl">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            CODENOVATECH AI
                          </h3>
                          <p className="text-blue-200 text-sm">
                            Enterprise AI Solution
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                            BETA
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center justify-center mb-1">
                            <Cpu className="h-5 w-5 text-purple-300" />
                          </div>
                          <p className="text-center text-white text-xs">
                            Advanced Processing
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center justify-center mb-1">
                            <Shield className="h-5 w-5 text-blue-300" />
                          </div>
                          <p className="text-center text-white text-xs">
                            Enterprise Security
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center justify-center mb-1">
                            <Sparkles className="h-5 w-5 text-amber-300" />
                          </div>
                          <p className="text-center text-white text-xs">
                            Smart Automation
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10 mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white text-sm font-medium">
                            AI Processing Status
                          </h4>
                          <span className="text-xs text-blue-200">v1.0.35</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">
                            Training models
                          </span>
                          <span className="text-xs text-gray-400">75%</span>
                        </div>
                      </div>

                      {/* Enhanced dashboard visualization */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center mb-2">
                            <Laptop className="h-4 w-4 text-blue-300 mr-2" />
                            <h5 className="text-white text-xs font-medium">
                              System Performance
                            </h5>
                          </div>
                          <div className="h-16 flex items-end space-x-1">
                            {[40, 65, 45, 80, 75, 90, 60].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-500/50 to-purple-500/50 rounded-sm"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center mb-2">
                            <Workflow className="h-4 w-4 text-green-300 mr-2" />
                            <h5 className="text-white text-xs font-medium">
                              AI Workflow
                            </h5>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-indigo-400" />
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-indigo-400 to-blue-400" />
                            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-blue-400" />
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400" />
                            <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-purple-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-300 text-xs">
                            System Online
                          </span>
                        </div>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-xs font-medium">
                          View Dashboard
                        </button>
                      </div>
                    </div>

                    {/* Enhanced background elements */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-2xl" />
                    </div>

                    {/* Enhanced decorative elements */}
                    <div className="absolute top-10 left-10 w-16 h-16 border border-purple-500/20 rounded-lg rotate-12" />
                    <div className="absolute bottom-10 right-10 w-12 h-12 border border-blue-500/20 rounded-full" />
                    <div className="absolute top-1/3 right-20 w-6 h-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-md rotate-45" />

                    {/* Additional floating elements */}
                    <motion.div
                      className="absolute top-1/4 right-1/4 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full"
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg rotate-45"
                      animate={{
                        y: [0, 10, 0],
                        rotate: [45, 60, 45],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section - Enhanced with more features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Key Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              What Makes Our Product Special
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              Our AI-powered solution will bring unprecedented capabilities to
              your workflow
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="p-6 rounded-2xl bg-white transition-all duration-300 border border-gray-100 shadow-xl"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${
                    feature.color.split(" ")[0]
                  } flex items-center justify-center mb-4 shadow-sm`}
                >
                  <feature.icon
                    className={`h-6 w-6 ${feature.color.split(" ")[1]}`}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Product Showcase Section - Reduced padding */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Product Showcase
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Transforming Industries
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              See how our revolutionary AI solution is changing the way
              businesses operate
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

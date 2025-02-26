"use client";
import Authentication from "./_components/Authentication";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  SparklesIcon,
  BoltIcon,
  CodeBracketIcon,
  PhotoIcon,
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    // Start hero animation after page load
    const timer = setTimeout(() => setAnimateHero(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      name: "Instant Conversion",
      description: "Transform images to clean code in seconds using AI",
      icon: BoltIcon,
      emoji: "⚡",
      color: "bg-purple-100",
    },
    {
      name: "Multi-Language Support",
      description: "Supports React, HTML, CSS, Vue, and more",
      icon: CodeBracketIcon,
      emoji: "💻",
      color: "bg-blue-100",
    },
    {
      name: "Smart Design Recognition",
      description: "Accurately detects layouts and components",
      icon: PhotoIcon,
      emoji: "🎨",
      color: "bg-pink-100",
    },
    {
      name: "Export Options",
      description: "Download code or export directly to GitHub",
      icon: SparklesIcon,
      emoji: "🚀",
      color: "bg-orange-100",
    },
    {
      name: "Analytics Dashboard",
      description: "Track your conversions and optimize workflow",
      icon: ChartBarIcon,
      emoji: "📊",
      color: "bg-green-100",
    },
    {
      name: "Team Collaboration",
      description: "Share projects and collaborate with your team",
      icon: UserGroupIcon,
      emoji: "👥",
      color: "bg-yellow-100",
    },
  ];

  const stats = [
    { value: "10M+", label: "Lines of Code Generated", icon: CodeBracketIcon },
    { value: "50K+", label: "Happy Developers", icon: UserGroupIcon },
    { value: "99%", label: "Accuracy Rate", icon: CheckCircleIcon },
    { value: "100+", label: "Countries", icon: GlobeAltIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Animated Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl mr-2">✨</span>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Img2Code
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 hover:text-purple-600 transition-colors"
                href="#features"
              >
                Features
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 hover:text-purple-600 transition-colors"
                href="#testimonials"
              >
                Testimonials
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 hover:text-purple-600 transition-colors"
                href="#pricing"
              >
                Pricing
              </motion.a>
            </div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
                  >
                    Get Started
                  </motion.button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all mr-2"
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-purple-300 filter blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-blue-300 filter blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-300 filter blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
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
                New AI Model Released
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-8 leading-tight"
            >
              Turn Designs into Code
              <br />
              in Seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Transform your visual designs into clean, production-ready code
              automatically. Powered by AI for developers who value speed and
              precision.
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
              >
                Start Converting Now
                <SparklesIcon className="h-5 w-5 ml-2" />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#demo"
                className="bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center justify-center"
              >
                Watch Demo
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-24 rounded-3xl shadow-2xl overflow-hidden border-8 border-white mx-auto max-w-5xl relative"
            >
              <div className="bg-gradient-to-r from-purple-500 to-blue-400 p-4">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="bg-gray-900 p-8 h-96 flex items-center justify-center relative">
                {/* Split view animation */}
                <div className="absolute inset-0 flex">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: animateHero ? "50%" : "100%" }}
                    transition={{ delay: 1.5, duration: 1.5 }}
                    className="h-full bg-cover bg-center border-r border-gray-700"
                    style={{ backgroundImage: "url('https://placehold.co/600x400/5271ff/ffffff?text=UI+Design')" }}
                  >
                    {animateHero && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                      >
                        Design Input
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: animateHero ? "50%" : "0%" }}
                    transition={{ delay: 1.5, duration: 1.5 }}
                    className="h-full bg-gray-900 overflow-hidden"
                  >
                    {animateHero && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2, duration: 0.5 }}
                          className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                          Generated Code
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.5, duration: 0.8 }}
                          className="p-4 h-full overflow-y-auto"
                        >
                          <pre className="text-xs text-green-400 font-mono">
                            <code>{`import React from 'react';

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

export default Header;`}</code>
                          </pre>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </div>
                
                {!animateHero && (
                  <div className="animate-pulse text-gray-600 z-10">
                    [AI Processing Demo]
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-white"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  <p className="text-4xl font-bold mb-1">{stat.value}</p>
                </motion.div>
                <p className="text-purple-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Powerful Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Why Choose Img2Code?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              Our platform offers everything you need to streamline your design-to-code workflow
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className={`p-8 rounded-2xl ${feature.color} transition-all duration-300 border border-gray-100`}
              >
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                  <feature.icon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  {feature.emoji} {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <motion.div 
                  className="mt-6"
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="text-purple-600 font-medium flex items-center">
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Revolutionize Your Workflow?
            </h2>
            <p className="text-xl text-purple-100">
              Join thousands of developers saving hours every week
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl"
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">✨</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Img2Code
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Transform your designs into production-ready code with AI.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Img2Code. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

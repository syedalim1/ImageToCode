"use client";
import Authentication from "./_components/Authentication";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import ProfileAvatar from "./_components/ProfileAvatar";
import {
  SparklesIcon,
  BoltIcon,
  CodeBracketIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
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
  ];

  return (
    <Authentication>
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
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Img2Code
                </span>
              </motion.div>

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
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8"
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
                className="flex justify-center space-x-4"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl flex items-center"
                >
                  Start Converting Now
                  <SparklesIcon className="h-5 w-5 ml-2" />
                </motion.a>
              </motion.div>

              {/* Demo Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 rounded-3xl shadow-2xl overflow-hidden border-8 border-white mx-auto max-w-4xl"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-400 p-4">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="bg-gray-900 p-8 h-96 flex items-center justify-center">
                  <div className="animate-pulse text-gray-600">
                    [AI Processing Demo]
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
              >
                Why Choose Img2Code?
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-8 rounded-2xl ${feature.color} hover:transform hover:-translate-y-2 transition-all duration-300`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-6 shadow-sm">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    {feature.emoji} {feature.name}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
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
      </div>
    </Authentication>
  );
}

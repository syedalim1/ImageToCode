"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Import components
import AnimatedCodeSnippet from "./_components/AnimatedCodeSnippet";
import Testimonial from "./_components/Testimonial";
import PricingCard from "./_components/PricingCard";
import ClientFloatingElements from "./_components/ClientFloatingElements"; // Updated import
import HomeCreditBalanceCard from "./_components/HomeCreditBalanceCard";
import Footer from "./_components/Footer";
import Constants from "@/data/Constants";

export default function Home() {
  const [animateHero, setAnimateHero] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  const pricingPlans = Constants.CREDIT_COSTS.PRICING_PLANS.map(
    (plan, index) => ({
      title:
        index === 0
          ? "Basic"
          : index === 1
          ? "Standard"
          : index === 2
          ? "Premium"
          : "Enterprise",
      price: plan.price,
      originalPrice: plan.originalPrice || "",
      credits: `${plan.credits} Credits`,
      features: [`${plan.credits / 10} image-to-code conversions/month`],
      popular: index === 1,
      cta: "Buy Now",
      save:
        index === 1
          ? "SAVE 17%"
          : index === 2
          ? "SAVE 33%"
          : index === 3
          ? "SAVE 33%"
          : undefined,
    })
  );

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

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50"
      ref={containerRef}
    >


      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements - Using ClientFloatingElements instead */}
        <ClientFloatingElements />

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
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                in Seconds
              </motion.span>
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
                <svg
                  className="h-5 w-5 ml-2"
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
                    style={{
                      backgroundImage:
                        "url('https://placehold.co/600x400/5271ff/ffffff?text=UI+Design')",
                    }}
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
                          <AnimatedCodeSnippet code={codeExample} />
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
                viewport={{ once: true }}
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
                  viewport={{ once: true }}
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
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Powerful Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Why Choose Img2Code?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              Our platform offers everything you need to streamline your
              design-to-code workflow
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
                className={`p-8 rounded-2xl ${feature.color} transition-all duration-300 border border-gray-100`}
              >
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                  <feature.icon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  {feature.emoji} {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <motion.div className="mt-6" whileHover={{ x: 5 }}>
                  <a
                    href="#"
                    className="text-purple-600 font-medium flex items-center"
                  >
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              Join thousands of satisfied developers who have transformed their
              workflow
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={testimonial.author}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                image={testimonial.image}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </div> */}

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Pricing
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Choose Your Plan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
            >
              Simple, transparent pricing that scales with your needs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                price={plan.price}
                originalPrice={plan.originalPrice}
                credits={plan.credits}
                features={plan.features}
                popular={plan.popular}
                cta={plan.cta}
                save={plan.save}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Credit Balance Demo */}
      {/* <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
            >
              Credits System
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Pay Only For What You Use
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto mb-12"
            >
              Our flexible credit system lets you convert designs as needed
            </motion.p>
          </div>

          <div className="max-w-md mx-auto">
            <HomeCreditBalanceCard balance={75} />
          </div>
        </div>
      </div> */}
    
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Design Workflow?
            </h2>
            <p className="text-xl text-purple-100 mb-10">
              Join thousands of developers saving hours every week
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl"
            >
              Get Started For Free
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      {/* Credit System Explanation */}
    </div>
  );
}

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
// import AnimatedCodeSnippet from "./_components/AnimatedCodeSnippet";
// import Testimonial from "./_components/Testimonial";
// import PricingCard from "./_components/PricingCard";
// import ClientFloatingElements from "./_components/ClientFloatingElements";
// import HomeCreditBalanceCard from "./_components/HomeCreditBalanceCard";
import Footer from "./_components/Footer";
import Constants from "@/data/Constants";
import HeroSection from "./_components/HeroSection.tsx";
import StatsSection from "./_components/StatsSection.tsx";
import FeaturesSection from "./_components/FeaturesSection.tsx";
import PricingSection from "./_components/PricingSection.tsx";
import CTASection from "./_components/CTASection.tsx";

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

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50"
      ref={containerRef}
    >
      <HeroSection animateHero={animateHero} />

      <StatsSection stats={stats} />

      <FeaturesSection features={features} />

      <PricingSection pricingPlans={pricingPlans} />

      <CTASection />

      <Footer />
    </div>
  );
}

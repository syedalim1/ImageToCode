"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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



  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50"
      ref={containerRef}
    >
      <HeroSection animateHero={animateHero} />

      <StatsSection  />

      <FeaturesSection  />

      <PricingSection  />

      <CTASection />

      <Footer />
    </div>
  );
}

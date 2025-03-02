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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50"
      ref={containerRef}
    >
      <HeroSection />

      <StatsSection />

      <FeaturesSection />

      <PricingSection />

      <CTASection />

      <Footer />
    </div>
  );
}

"use client";

import { Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import Footer from "./_components/Footer";

// Use React.lazy for non-critical components
const HeroSection = dynamic(() => import("./_components/HeroSection"), {
  ssr: true,
});

// Defer loading of below-the-fold content
const StatsSection = dynamic(() => import("./_components/StatsSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gradient-to-b from-indigo-50/50 to-purple-50/50 animate-pulse" />
  ),
});

const FeaturesSection = dynamic(() => import("./_components/FeaturesSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gradient-to-b from-indigo-50/50 to-purple-50/50 animate-pulse" />
  ),
});

const PricingSection = dynamic(() => import("./_components/PricingSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gradient-to-b from-indigo-50/50 to-purple-50/50 animate-pulse" />
  ),
});

const CTASection = dynamic(() => import("./_components/CTASection"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-gradient-to-b from-indigo-50/50 to-purple-50/50 animate-pulse" />
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative">
      {/* Apply containment for better performance */}
      <div style={{ contain: "content" }}>
        <HeroSection />

        <Suspense fallback={<div className="h-[300px] animate-pulse" />}>
          <StatsSection />
        </Suspense>

        <Suspense fallback={<div className="h-[400px] animate-pulse" />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<div className="h-[300px] animate-pulse" />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<div className="h-[200px] animate-pulse" />}>
          <CTASection />
        </Suspense>

        <Footer />
      </div>
    </div>
  );
}

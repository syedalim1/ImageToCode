"use client";

import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection.tsx";
import StatsSection from "./_components/StatsSection.tsx";
import FeaturesSection from "./_components/FeaturesSection.tsx";
import PricingSection from "./_components/PricingSection.tsx";
import CTASection from "./_components/CTASection.tsx";

export default function Home() {

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50"
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

"use client";

import CTASection from "./_components/CTASection";
import FeaturesSection from "./_components/FeaturesSection";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import PricingSection from "./_components/PricingSection";
import EnhancedStatsSection from "./_components/StatsSection";



export default function Home() {
  return (
    <div className="">
      {/* Apply containment for better performance */}
      <div style={{ contain: "content" }}>
        <HeroSection />

        <EnhancedStatsSection />

        <FeaturesSection />

        <PricingSection />

        <CTASection />

        <Footer />
      </div>
    </div>
  );
}

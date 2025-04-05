"use client";

import { FloatingIcons } from "./_components/FloatingIcons";
import { HeroSection } from "./_components/HeroSection";
import { ProductPreview } from "./_components/ProductPreview";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingIcons />

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <HeroSection />
          <ProductPreview />
        </div>
      </div>

      {/* Features Section */}
    </div>
  );
}

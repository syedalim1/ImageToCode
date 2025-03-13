// File: HeroSection.jsx
"use client";
import { useScroll, useTransform } from "framer-motion";
import ClientFloatingElements from "./ClientFloatingElements";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import AbstractShapes from "./AbstractShapes";
import HeroTitle from "./HeroTitle";
import HeroBadge from "./HeroBadge";
import HeroDescription from "./HeroDescription";
import CTAButtons from "./CTAButtons";
import DemoPreview from "./DemoPreview";
import { codeExample, testimonials } from "./Constants";
const AnimatedCodeSnippet = dynamic(() => import("./AnimatedCodeSnippet"), {
  ssr: false,
});

export default function HeroSection() {
  const containerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animateHero, setAnimateHero] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effect values with optimized performance
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    let animationFrameId;

    // Start hero animation using requestAnimationFrame
    const startAnimation = () => {
      setAnimateHero(true);
    };

    animationFrameId = requestAnimationFrame(startAnimation);

    // Auto-rotate testimonials with optimized interval
    const testimonialTimer = setInterval(() => {
      requestAnimationFrame(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      });
    }, 5000);

    // Begin animation after component mounts
    setIsAnimating(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(testimonialTimer);
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen"
      ref={containerRef}
      style={{
        willChange: "transform",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Enhanced animated background elements */}
      <ClientFloatingElements />
      <AbstractShapes />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div className="text-center">
          <HeroBadge />
          <HeroTitle />
          <HeroDescription />
          <CTAButtons />
          <DemoPreview
            animateHero={animateHero}
            codeExample={codeExample}
            AnimatedCodeSnippet={AnimatedCodeSnippet}
          />
        </div>
      </div>

      {/* Added accent decorations */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
    </div>
  );
}

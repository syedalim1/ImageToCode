"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import PerformanceOptimizer from "./PerformanceOptimizer";
import { NavigationEvents } from "./NavigationEvents";
import "./navigation.css";

// Dynamically import non-critical components with lower priority
const PerformanceMonitor = dynamic(
  () => import("./PerformanceMonitor").then((mod) => mod.PerformanceMonitor),
  { ssr: false, loading: () => null }
);

// Preload critical assets to reduce lag - moved outside component to run once
const criticalImages = [
  "/logo.svg",
  "/meta.png",
  "/google.png",
  "/deepseek.png",
];

// Prefetch common navigation routes
const commonRoutes = ["/dashboard", "/designs", "/profile", "/credits"];

const preloadAssets = () => {
  if (typeof window === "undefined") return;

  // Preload images with priority hints
  criticalImages.forEach((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.fetchPriority = "high";
    img.loading = "eager";
  });

  // Prefetch common route JS bundles
  if ("link" in document.createElement("link")) {
    commonRoutes.forEach((route) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      link.as = "document";
      document.head.appendChild(link);
    });
  }
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Use a more efficient way to preload
    if (typeof window !== "undefined") {
      // Use requestIdleCallback with a timeout to ensure it runs even if idle time is scarce
      if ("requestIdleCallback" in window) {
        const idleCallbackId = (window as any).requestIdleCallback(
          preloadAssets,
          { timeout: 2000 }
        );
        return () => {
          if ("cancelIdleCallback" in window) {
            (window as any).cancelIdleCallback(idleCallbackId);
          }
        };
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        const timeoutId = setTimeout(preloadAssets, 300); // Reduced from 1000ms to 300ms
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  // Reset scroll position on navigation to improve perceived performance
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* Navigation progress indicator */}
      <div className="navigation-loader" />

      {/* Listen for navigation events to optimize page transitions */}
      <NavigationEvents />

      {/* Development-only performance monitor, press Ctrl+Shift+P to toggle */}
      <PerformanceMonitor />

      {/* The contain property improves performance by isolating this subtree's rendering from the rest of the page */}
      <div
        className="flex flex-col min-h-screen page-transition-wrapper hardware-accelerated"
        style={{
          contain: "content",
          // Use content-visibility to skip rendering of off-screen content
          contentVisibility: "auto",
          // Hint to the browser about the size to prevent layout shifts
          containIntrinsicSize: "0 500px",
        }}
      >
        <PerformanceOptimizer
          priority="high"
          containType="content"
          willChange="transform, opacity"
          debounce={0} // No debounce for high priority content
        >
          {children}
        </PerformanceOptimizer>
      </div>
    </>
  );
}

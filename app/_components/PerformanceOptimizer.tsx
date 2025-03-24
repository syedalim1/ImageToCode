"use client";

import React, { useRef, useEffect, ReactNode } from "react";

interface PerformanceOptimizerProps {
  children: ReactNode;
  priority?: "high" | "medium" | "low";
  containType?:
    | "strict"
    | "content"
    | "size"
    | "layout"
    | "paint"
    | "style"
    | "size layout paint style";
  debounce?: number;
  willChange?: string;
}

/**
 * A component that optimizes the rendering performance of its children
 *
 * @param children - The components to optimize
 * @param priority - How important this component is (affects rendering strategies)
 * @param containType - CSS containment strategy
 * @param debounce - Milliseconds to debounce resize/scroll events
 * @param willChange - CSS will-change property value
 */
export default function PerformanceOptimizer({
  children,
  priority = "medium",
  containType = "content",
  debounce = 0,
  willChange = "",
}: PerformanceOptimizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasIntersected = useRef(false);

  useEffect(() => {
    if (!containerRef.current || priority === "high") return;

    let timeoutId: NodeJS.Timeout | null = null;

    // Use IntersectionObserver to optimize off-screen components
    const observer = new IntersectionObserver(
      (entries) => {
        // Handle entering and leaving the viewport
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasIntersected.current = true;

            // Apply will-change only briefly when entering viewport
            if (willChange && containerRef.current) {
              containerRef.current.style.willChange = willChange;

              // Remove will-change after animation completes to free up resources
              timeoutId = setTimeout(() => {
                if (containerRef.current) {
                  containerRef.current.style.willChange = "auto";
                }
              }, 1000);
            }
          } else if (priority === "low" && hasIntersected.current) {
            // For low priority elements, we can be more aggressive with optimizations
            // when they leave the viewport
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Handle scroll/resize debouncing
    if (debounce > 0 && (priority === "medium" || priority === "low")) {
      let resizeTimeout: NodeJS.Timeout;
      let scrollTimeout: NodeJS.Timeout;

      const handleEvent = () => {
        if (containerRef.current) {
          containerRef.current.style.opacity = "0.8";
          containerRef.current.style.transform = "translateZ(0)";
        }
      };

      const handleEventEnd = () => {
        if (containerRef.current) {
          containerRef.current.style.opacity = "1";
          containerRef.current.style.transform = "";
        }
      };

      window.addEventListener("resize", () => {
        handleEvent();
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleEventEnd, debounce);
      });

      window.addEventListener(
        "scroll",
        () => {
          handleEvent();
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(handleEventEnd, debounce);
        },
        { passive: true }
      );

      return () => {
        window.removeEventListener("resize", handleEvent);
        window.removeEventListener("scroll", handleEvent);
        clearTimeout(resizeTimeout);
        clearTimeout(scrollTimeout);
      };
    }

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [priority, debounce, willChange]);

  return (
    <div
      ref={containerRef}
      style={{
        contain: containType,
        willChange: priority === "high" ? willChange : "auto",
      }}
    >
      {children}
    </div>
  );
}

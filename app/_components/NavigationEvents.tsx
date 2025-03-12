"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { startTransition } from "react";

// This component listens to navigation events and optimizes transitions
export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleNavigationStart = () => {
      // Add loading indicator or optimization on navigation start
      document.documentElement.style.cursor = "progress";

      // Add a class that can be used for CSS transitions during navigation
      document.body.classList.add("navigation-in-progress");
    };

    const handleNavigationComplete = () => {
      // Cleanup loading indicators on navigation complete
      document.documentElement.style.cursor = "";
      document.body.classList.remove("navigation-in-progress");

      // Measure and log navigation time for analytics/debugging
      if (window.performance && window.performance.getEntriesByType) {
        const navigationEntries =
          window.performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0) {
          const navigationTime = navigationEntries[0].duration;
          console.debug(
            `Navigation completed in ${navigationTime.toFixed(2)}ms`
          );
        }
      }
    };

    // Register event listeners
    window.addEventListener("beforeunload", handleNavigationStart);
    window.addEventListener("load", handleNavigationComplete);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", handleNavigationStart);
      window.removeEventListener("load", handleNavigationComplete);
    };
  }, []);

  // This effect runs whenever the route changes
  useEffect(() => {
    startTransition(() => {
      // Route change complete - add optimization here
      // Using startTransition to mark route change effects as non-urgent

      // Scroll to top on page change (configurable)
      window.scrollTo(0, 0);

      // Clear any error states or temporary UI that should not persist across navigations
      document.body.classList.remove("navigation-in-progress");
    });

    // Prefetch adjacent pages based on current route
    // This could be customized based on user behavior analytics
    const prefetchAdjacentRoutes = () => {
      if (typeof window === "undefined") return;

      const link = document.createElement("link");
      link.rel = "prefetch";

      // Example: If on a product page, prefetch the next logical page
      if (pathname.startsWith("/designs/")) {
        link.href = "/dashboard";
        document.head.appendChild(link);
      }
    };

    // Run prefetching during idle time
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetchAdjacentRoutes);
    } else {
      setTimeout(prefetchAdjacentRoutes, 500);
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

"use client";

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // You can send to your analytics service
  console.log(metric);
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);

    // Optimize resource loading
    if (typeof window !== 'undefined') {
      // Preload critical resources
      const preloadLinks = [
        { rel: 'preload', href: '/fonts/your-main-font.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        // Add other critical resources
      ];

      preloadLinks.forEach(link => {
        const linkEl = document.createElement('link');
        Object.entries(link).forEach(([key, value]) => {
          linkEl.setAttribute(key, value);
        });
        document.head.appendChild(linkEl);
      });

      // Lazy load non-critical resources
      const lazyLoadResources = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          if (img instanceof HTMLImageElement && img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      };

      // Use Intersection Observer for lazy loading
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(lazyLoadResources);
        document.querySelectorAll('[data-lazy]').forEach(el => observer.observe(el));
      }
    }
  }, []);

  return null;
}

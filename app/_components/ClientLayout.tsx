"use client";

import dynamic from 'next/dynamic';
import PerformanceOptimizer from './PerformanceOptimizer';

const PerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor').then(mod => mod.PerformanceMonitor),
  { ssr: false }
);

// Preload critical assets to reduce lag
const preloadAssets = () => {
  if (typeof window === 'undefined') return;
  
  // Images that will be needed soon
  const criticalImages = [
    '/path/to/critical-image-1.png',
    '/path/to/critical-image-2.png'
  ];
  
  criticalImages.forEach(imageUrl => {
    const img = new Image();
    img.src = imageUrl;
  });
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Preload critical assets when component mounts
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback to not block the main thread
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadAssets);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(preloadAssets, 1000);
    }
  }
  
  return (
    <>
      {/* Development-only performance monitor, press Ctrl+Shift+P to toggle */}
      <PerformanceMonitor />
      
      {/* The contain property improves performance by isolating this subtree's rendering from the rest of the page */}
      <div 
        className="flex flex-col min-h-screen"
        style={{ 
          contain: 'content',
          // Use content-visibility to skip rendering of off-screen content
          contentVisibility: 'auto',
          // Hint to the browser about the size to prevent layout shifts
          containIntrinsicSize: '0 500px'
        }}
      >
        <PerformanceOptimizer priority="high" containType="content" willChange="transform, opacity">
          {children}
        </PerformanceOptimizer>
      </div>
    </>
  );
}

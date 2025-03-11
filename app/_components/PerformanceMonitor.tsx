"use client";

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  cpuUsage: number | null;
  longTasks: number;
  renderTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    cpuUsage: null,
    longTasks: 0,
    renderTime: 0,
  });
  
  const [showMonitor, setShowMonitor] = useState(false);
  
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    let longTaskCount = 0;
    
    // Setup FPS counter
    const countFrames = (time: number) => {
      frameCount++;
      
      // Update FPS every second
      if (time - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (time - lastTime));
        frameCount = 0;
        lastTime = time;
        
        // Get memory usage if available
        let memory = null;
        if (performance && (performance as any).memory) {
          memory = (performance as any).memory;
        }
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          fps,
          memory,
          longTasks: longTaskCount,
        }));
      }
      
      frameId = requestAnimationFrame(countFrames);
    };
    
    // Start counting frames
    frameId = requestAnimationFrame(countFrames);
    
    // Detect long tasks (potential jank)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // A task that takes more than 50ms is considered a long task
        if (entry.duration > 50) {
          longTaskCount++;
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('PerformanceObserver for longtask not supported');
    }
    
    // Track component render times
    const measureRender = () => {
      const start = performance.now();
      
      // Wait for next frame to measure render time
      requestAnimationFrame(() => {
        const renderTime = performance.now() - start;
        setMetrics(prev => ({
          ...prev,
          renderTime,
        }));
      });
    };
    
    // Measure every second
    const renderInterval = setInterval(measureRender, 1000);
    
    // Toggle monitor with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowMonitor(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(renderInterval);
      observer.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development' || !showMonitor) {
    return null;
  }
  
  // Format bytes to a human-readable string
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Color-code the FPS value
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="fixed bottom-0 left-0 z-50 bg-black bg-opacity-80 p-3 text-white text-xs font-mono rounded-tr-lg">
      <div className="mb-1">
        <span className="opacity-70">FPS: </span>
        <span className={getFpsColor(metrics.fps)}>{metrics.fps}</span>
      </div>
      
      {metrics.memory && (
        <div className="mb-1">
          <span className="opacity-70">Memory: </span>
          <span>{formatBytes(metrics.memory.usedJSHeapSize)} / {formatBytes(metrics.memory.jsHeapSizeLimit)}</span>
        </div>
      )}
      
      <div className="mb-1">
        <span className="opacity-70">Long Tasks: </span>
        <span className={metrics.longTasks > 0 ? 'text-red-500' : 'text-green-500'}>
          {metrics.longTasks}
        </span>
      </div>
      
      <div>
        <span className="opacity-70">Render Time: </span>
        <span className={metrics.renderTime > 16 ? 'text-red-500' : 'text-green-500'}>
          {metrics.renderTime.toFixed(2)}ms
        </span>
      </div>
      
      <div className="mt-2 text-xs opacity-50">Press Ctrl+Shift+P to toggle</div>
    </div>
  );
}

"use client";

import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor').then(mod => mod.PerformanceMonitor),
  { ssr: false }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PerformanceMonitor />
      {children}
    </>
  );
}

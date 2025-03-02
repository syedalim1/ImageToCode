"use client";

import dynamic from 'next/dynamic';
import { AuthContextProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Dynamically import heavy components
const AppHeader = dynamic(() => import("./_components/AppHeader"), {
  ssr: false,
  loading: () => <div className="h-16 bg-white/80 backdrop-blur-sm border-b" />
});

const AppSidebar = dynamic(() => 
  import("./_components/AppSidebar").then(mod => mod.AppSidebar), {
  ssr: false
});

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-center">
      <div>
        <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthContextProvider>
        <SidebarProvider defaultOpen={true}>
          <LazyMotion features={domAnimation}>
            <div className="flex min-h-screen max-h-screen w-full overflow-hidden">
           
              

              {/* Main content area */}
              <div className="flex flex-col flex-1 w-full overflow-hidden">
                {/* Header */}
                <Suspense fallback={<div className="h-16 bg-white/80 backdrop-blur-sm border-b" />}>
                  <AppHeader />
                </Suspense>

                {/* Main content with scrolling */}
                <motion.main
                  className="flex-1 overflow-auto pb-20 md:pb-10 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  style={{ 
                    willChange: "opacity, transform",
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[200px]">
                      <div className="animate-pulse">Loading...</div>
                    </div>
                  }>
                    {children}
                  </Suspense>
                </motion.main>
              </div>
            </div>
          </LazyMotion>
        </SidebarProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default Provider;

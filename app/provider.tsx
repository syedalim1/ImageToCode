"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";

// Dynamically import heavy components
const AppHeader = dynamic(() => import("./_components/AppHeader"), {
  ssr: true,
  loading: () => <div className="h-16 bg-white/80 backdrop-blur-sm border-b" />,
});


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
    <div className="flex min-h-screen max-h-screen w-full overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <Suspense
          fallback={
            <div className="h-16 bg-white/80 backdrop-blur-sm border-b" />
          }
        >
          <AppHeader />
        </Suspense>

        {/* Main content with scrolling */}
        <motion.main
          className="flex-1 overflow-auto pb-20 md:pb-10 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{
            willChange: "opacity, transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-pulse">Loading...</div>
              </div>
            }
          >
            {children}
          </Suspense>
        </motion.main>
      </div>
    </div>
  );
}

export default Provider;

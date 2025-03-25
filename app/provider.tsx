"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import AppHeader from "./_components/AppHeader";



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
      
          <AppHeader />
   

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
         
            {children}
          
        </motion.main>
      </div>
    </div>
  );
}

export default Provider;

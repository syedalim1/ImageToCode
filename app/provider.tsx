"use client";

import { AuthContextProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration issues by only rendering after component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AuthContextProvider>
      <SidebarProvider defaultOpen={false}>
        {isMounted && (
          <div className="flex flex-col md:flex-row min-h-screen max-h-screen w-full overflow-hidden">
            {/* Sidebar - hidden on mobile, visible on md and up */}
            {/* <div className="hidden md:block h-screen">
              <AppSidebar />
            </div> */}

            {/* Main content area */}
            <div className="flex flex-col flex-1 w-full overflow-hidden">
              {/* Header */}
              <AppHeader />
              {/* Main content with scrolling */}
              <motion.main
                className="flex-1 overflow-auto pb-20 md:pb-10 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {children}
              </motion.main>
            </div>
          </div>
        )}
      </SidebarProvider>
    </AuthContextProvider>
  );
}

export default Provider;

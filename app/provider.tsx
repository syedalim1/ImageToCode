"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import AppHeader from "./_components/AppHeader";
import { ProjectTitleContext } from "./context/ProjectTitleContext";
import { UserDescriptionContext } from "./context/UserDescriptionContext";
import { IsUploadingContext } from "./context/IsUploadingContext";
import { UploadedImageUrlContext } from "./context/UploadedImageUrlContext";
import { UserUidContext } from "./context/UserUidContext";
import { UserDesignContext } from "./context/UserDesignContext";
function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  interface Design {
    id: number;
    uid: string;

    imageUrl: string;
    description: string | null;
    createdAt: string;
    language: string;
    options: string[];
    code: {
      content: string;
    };
  }
  const [isMounted, setIsMounted] = useState(false);
  const [projectTitle, setProjectTitle] = useState();
  const [userDescription, setUserDescription] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [userUid, setUserUid] = useState<string | null>(null);
  const [design, setDesign] = useState<Design | null>(null);

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
        <UserDesignContext.Provider value={{ design, setDesign }}>
          <UserUidContext.Provider value={{ userUid, setUserUid }}>
            <UploadedImageUrlContext.Provider
              value={{ uploadedImageUrl, setUploadedImageUrl }}
            >
              <IsUploadingContext.Provider
                value={{ isUploading, setIsUploading }}
              >
                <UserDescriptionContext.Provider
                  value={{ userDescription, setUserDescription }}
                >
                  <ProjectTitleContext.Provider
                    value={{ projectTitle, setProjectTitle }}
                  >
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
                  </ProjectTitleContext.Provider>
                </UserDescriptionContext.Provider>
              </IsUploadingContext.Provider>
            </UploadedImageUrlContext.Provider>
          </UserUidContext.Provider>
        </UserDesignContext.Provider>
      </div>
    </div>
  );
}

export default Provider;

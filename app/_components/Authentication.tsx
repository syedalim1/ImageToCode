"use client";
import React, { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, LogIn, UserPlus } from "lucide-react";

function Authentication() {
  const [isClient, setIsClient] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverSignUp, setHoverSignUp] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0.5, 1.2, 0.5],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  // Gradient backgrounds
  const signInGradient = "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500";
  const signUpGradient = "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500";

  return (
    <div>
      <SignedIn>
        {isClient ? (
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 border-2 border-indigo-200 shadow-lg",
                    userButtonPopoverCard: "shadow-xl border border-indigo-100"
                  }
                }}
              />
            </motion.div>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur opacity-70 -z-10 animate-pulse"></div>
          </div>
        ) : null}
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.div
            className="relative"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onMouseEnter={() => setHoverSignIn(true)}
            onMouseLeave={() => setHoverSignIn(false)}
          >
            <div className={`${signInGradient} text-white rounded-xl px-5 py-2.5 font-medium shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10`}>
              <LogIn className="h-4 w-4 mr-1.5" />
              <SignInButton mode="modal">
                <span className="relative z-10">Sign In</span>
              </SignInButton>
              
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-white opacity-10 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]"></div>
              </div>
              
              {/* Sparkle effects */}
              {hoverSignIn && (
                <>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-1 right-2 z-0"
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-80" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute bottom-1 left-2 z-0"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-80" />
                  </motion.div>
                </>
              )}
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onMouseEnter={() => setHoverSignUp(true)}
            onMouseLeave={() => setHoverSignUp(false)}
          >
            <div className={`${signUpGradient} text-white rounded-xl px-5 py-2.5 font-medium shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10`}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              <SignUpButton mode="modal">
                <span className="relative z-10">Sign Up</span>
              </SignUpButton>
              
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-white opacity-10 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2),transparent_50%)]"></div>
              </div>
              
              {/* Sparkle effects */}
              {hoverSignUp && (
                <>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-1 right-2 z-0"
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-80" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute bottom-1 left-2 z-0"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-80" />
                  </motion.div>
                </>
              )}
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          </motion.div>
        </div>
      </SignedOut>
    </div>
  );
}

export default Authentication;

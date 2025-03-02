"use client";
import React, { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LogIn, UserPlus, Crown, Bell, Gift, Star, Check } from "lucide-react";

function Authentication() {
  const [isClient, setIsClient] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverSignUp, setHoverSignUp] = useState(false);
  const [showProBadge, setShowProBadge] = useState(true);
  const [showUserTooltip, setShowUserTooltip] = useState(false);

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
        repeatType: "loop" as const
      }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.3,
        type: "spring" as const,
        stiffness: 300,
        damping: 15
      }
    },
    pulse: {
      scale: [1, 1.15, 1],
      boxShadow: [
        "0 0 0 0 rgba(236, 72, 153, 0.7)",
        "0 0 0 8px rgba(236, 72, 153, 0)",
        "0 0 0 0 rgba(236, 72, 153, 0)"
      ],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Gradient backgrounds with enhanced colors
  const signInGradient = "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500";
  const signUpGradient = "bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500";

  return (
    <div>
      <SignedIn>
        {isClient ? (
          <div className="relative" onMouseEnter={() => setShowUserTooltip(true)} onMouseLeave={() => setShowUserTooltip(false)}>
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
              
              {/* Pro member badge */}
              {showProBadge && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full p-1 border border-white shadow-lg"
                  variants={badgeVariants}
                  initial="hidden"
                  animate={["visible", "pulse"]}
                >
                  <Crown className="h-3 w-3 text-white" />
                </motion.div>
              )}
              
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 rounded-full blur opacity-70 -z-10 animate-pulse"></div>
            </motion.div>

            {/* User tooltip */}
            <AnimatePresence>
              {showUserTooltip && (
                <motion.div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-indigo-100 p-3 z-50"
                  variants={tooltipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="absolute right-5 -top-2 w-4 h-4 bg-white border-t border-l border-indigo-100 transform rotate-45"></div>
                  
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                      <span className="text-lg text-white font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">John Doe</p>
                      <p className="text-sm text-gray-500">john.doe@example.com</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-2">
                      <Crown className="h-4 w-4 text-amber-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Pro Membership</p>
                        <p className="text-xs text-amber-700">Valid until March 2026</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-sm mb-3">
                    <div className="flex items-center text-gray-700">
                      <Check className="h-3.5 w-3.5 text-green-500 mr-2" />
                      <span>Unlimited projects</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Check className="h-3.5 w-3.5 text-green-500 mr-2" />
                      <span>Advanced AI features</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Check className="h-3.5 w-3.5 text-green-500 mr-2" />
                      <span>Premium support</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="text-xs text-gray-600 hover:text-gray-800">Account Settings</button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">Sign out</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <div className={`${signInGradient} text-white rounded-xl px-1 py-1 font-medium shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10`}>
              <LogIn className="h-3 w-3 " />
              <SignInButton mode="modal">
                <span className="relative z-10">Sign In</span>
              </SignInButton>
              
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-white opacity-10 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              
              {/* Improved sparkle effects */}
              {hoverSignIn && (
                <>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-1 right-2 z-0"
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-90" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute bottom-1 left-2 z-0"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-90" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-3 left-4 z-0"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <Sparkles className="h-2 w-2 text-white opacity-90" />
                  </motion.div>
                </>
              )}
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
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
            <div className={`${signUpGradient} text-white rounded-xl px-1 py-1 font-medium shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10`}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              <SignUpButton mode="modal">
                <span className="relative z-10">Sign Up</span>
              </SignUpButton>
              
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-white opacity-10 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              
              {/* Additional decorative element */}
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
              
              {/* Improved sparkle effects */}
              {hoverSignUp && (
                <>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-1 right-2 z-0"
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-90" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute bottom-1 left-2 z-0"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Sparkles className="h-3 w-3 text-white opacity-90" />
                  </motion.div>
                  <motion.div 
                    variants={sparkleVariants} 
                    initial="initial"
                    animate="animate"
                    className="absolute top-3 left-4 z-0"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <Star className="h-2 w-2 text-white opacity-90" />
                  </motion.div>
                </>
              )}
              
              {/* "Free trial" badge */}
              <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-0.5 text-[10px] font-bold text-pink-600 shadow-md transform rotate-12">
                Free Trial
              </div>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          </motion.div>
        </div>
      </SignedOut>

      {/* Floating element to connect with logged-in state */}
      <AnimatePresence>
        {isClient && showProBadge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 1, duration: 0.5 }
            }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 right-2 flex items-center text-xs font-medium text-amber-700"
          >
            <Gift className="h-3 w-3 mr-1 text-amber-500" />
            <span>2 free credits</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Authentication;
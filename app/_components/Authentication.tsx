"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, LogIn, UserPlus, Crown, Bell, Gift, Star, Check, Shield, Zap } from "lucide-react";

function Authentication() {
  const [isClient, setIsClient] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverSignUp, setHoverSignUp] = useState(false);
  const [showProBadge, setShowProBadge] = useState(true);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["-20%", "120%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["-20%", "120%"]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.98, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", transition: { duration: 0.1 } },
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0, filter: "blur(0px)" },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0.5, 1.2, 0.5],
      filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
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
  
  // Gradient backgrounds with enhanced colors and glass morphism
  const signInGradient = "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500";
  const signUpGradient = "bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500";
  
  // Responsive padding classes based on screen size
  const buttonPadding = "px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3";
  
  // Enhanced text styles
  const buttonTextStyle = "font-medium tracking-wide text-sm sm:text-base";

  return (
    <div className="relative z-10">
      <SignedIn>
        {isClient ? (
          <div className="relative" onMouseEnter={() => setShowUserTooltip(true)} onMouseLeave={() => setShowUserTooltip(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3 
              }}
              className="relative z-10 group"
              style={{ perspective: 800 }}
              whileHover={{ scale: 1.05 }}
            >
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 border-2 border-indigo-200 shadow-lg rounded-full overflow-hidden transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-indigo-100/50",
                    userButtonPopoverCard: "shadow-xl border border-indigo-100 rounded-xl backdrop-blur-sm bg-white/80"
                  }
                }}
              />
              
              {/* Pro member badge with enhanced animation */}
              {showProBadge && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full p-1 border border-white shadow-lg"
                  variants={badgeVariants}
                  initial="hidden"
                  animate={["visible", "pulse"]}
                  whileHover={{ scale: 1.2, rotate: [0, 10, 0] }}
                >
                  <Crown className="h-3 w-3 text-white drop-shadow-sm" />
                </motion.div>
              )}
              
              {/* Enhanced glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 rounded-full blur opacity-70 -z-10 group-hover:opacity-80 group-hover:blur-md transition-all duration-500"></div>
              
              {/* Animated particle effects around avatar */}
              <AnimatePresence>
                {showUserTooltip && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0.5],
                          x: Math.random() * 60 - 30,
                          y: Math.random() * 60 - 30
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: Math.random() * 2
                        }}
                        className="absolute inset-0 w-1 h-1 bg-indigo-500 rounded-full"
                        style={{ left: '50%', top: '50%' }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
           
          </div>
        ) : null}
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Enhanced Sign In Button */}
          <motion.div
            ref={signInRef}
            className="relative"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onMouseEnter={() => setHoverSignIn(true)}
            onMouseLeave={() => setHoverSignIn(false)}
            onMouseMove={handleMouseMove}
            style={{ perspective: 800 }}
          >
            <motion.div 
              className={`${signInGradient} text-white rounded-xl ${buttonPadding} ${buttonTextStyle} shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10 backdrop-blur-sm border border-white/10`}
              style={{ 
                rotateX,
                rotateY,
                transformStyle: "preserve-3d" 
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-white/20"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                  backgroundPosition: `${glowX}% ${glowY}%`,
                  backgroundSize: "300% 300%",
                }}
              />
              
              <Zap className="h-4 w-4 mr-2 drop-shadow-glow" />
              <SignInButton mode="modal">
                <span className="relative z-10 flex items-center">
                  Sign In
                  <motion.span 
                    className="ml-1.5 opacity-75"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 0.75, width: "auto" }}
                    transition={{ delay: 0.3 }}
                  >
                    <Shield className="h-3 w-3 inline" />
                  </motion.span>
                </span>
              </SignInButton>
              
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              
              {/* Improved sparkle effects */}
              <AnimatePresence>
                {hoverSignIn && (
                  <>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute top-1 right-2 z-0"
                    >
                      <Sparkles className="h-3 w-3 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute bottom-1 left-2 z-0"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Sparkles className="h-3 w-3 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute top-3 left-4 z-0"
                      style={{ animationDelay: "0.8s" }}
                    >
                      <Sparkles className="h-2 w-2 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Enhanced outer glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          </motion.div>
          
          {/* Enhanced Sign Up Button */}
          <motion.div
            ref={signUpRef}
            className="relative"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onMouseEnter={() => setHoverSignUp(true)}
            onMouseLeave={() => setHoverSignUp(false)}
            onMouseMove={handleMouseMove}
            style={{ perspective: 800 }}
          >
            <motion.div 
              className={`${signUpGradient} text-white rounded-xl ${buttonPadding} ${buttonTextStyle} shadow-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10 backdrop-blur-sm border border-white/10`}
              style={{ 
                rotateX,
                rotateY,
                transformStyle: "preserve-3d" 
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-white/20"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                  backgroundPosition: `${glowX}% ${glowY}%`,
                  backgroundSize: "300% 300%",
                }}
              />
              
              <UserPlus className="h-4 w-4 mr-2 drop-shadow-glow" />
              <SignUpButton mode="modal">
                <span className="relative z-10 flex items-center">
                  Sign Up
                  <motion.span 
                    className="ml-1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <span className="inline-block bg-white text-purple-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">FREE</span>
                  </motion.span>
                </span>
              </SignUpButton>
              
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>
              
              {/* Additional decorative element */}
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white opacity-10 rounded-full blur-sm"></div>
              
              {/* Improved sparkle effects */}
              <AnimatePresence>
                {hoverSignUp && (
                  <>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute top-1 right-2 z-0"
                    >
                      <Star className="h-3 w-3 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute bottom-1 left-2 z-0"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Sparkles className="h-3 w-3 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                    <motion.div 
                      variants={sparkleVariants} 
                      initial="initial"
                      animate="animate"
                      className="absolute top-3 left-4 z-0"
                      style={{ animationDelay: "0.8s" }}
                    >
                      <Star className="h-2 w-2 text-white opacity-90 drop-shadow-glow" />
                    </motion.div>
                    
                    {/* Add animated pulse ring */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: [0, 0.3, 0],
                        scale: [0.8, 1.5, 1.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="absolute inset-0 rounded-xl border border-white/30"
                    />
                  </>
                )}
              </AnimatePresence>
              
              {/* Animated ribbon/badge in corner */}
              <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-0.5 text-[10px] font-bold text-pink-600 shadow-md transform rotate-12 border border-pink-200">
                Try Now
              </div>
            </motion.div>
            
            {/* Enhanced outer glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur-sm opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          </motion.div>
        </div>
      </SignedOut>
    </div>
  );
}

export default Authentication;
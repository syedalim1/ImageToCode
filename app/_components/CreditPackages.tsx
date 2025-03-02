"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  DollarSign,
  RefreshCw,
  Gift,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular: boolean;
  color: string;
  features?: string[];
}

interface CreditPackagesProps {
  onPaymentSuccess: () => void;
}

const CreditPackages: React.FC<CreditPackagesProps> = ({
  onPaymentSuccess,
}) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup: Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  // Periodically show sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly highlight a package
      const packages = creditPackages.map((pkg) => pkg.id);
      const randomPackage =
        packages[Math.floor(Math.random() * packages.length)];
      setHighlightedPackage(randomPackage);

      // Show sparkles
      setShowSparkles(true);
      setTimeout(() => {
        setShowSparkles(false);
        setHighlightedPackage(null);
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Credit packages
  const creditPackages: CreditPackage[] = [
    {
      id: "basic",
      name: "Basic",
      credits: 10,
      price: 2000, // ₹20
      popular: false,
      color: "from-blue-500 to-blue-600",
      features: [
        "1 image-to-code conversions/month",
       
      ],
    },
    {
      id: "standard",
      name: "Standard",
      credits: 30,
      price: 5000, // ₹50
      originalPrice: 6000, // ₹60
      discount: 17,
      popular: true,
      color: "from-purple-500 to-purple-600",
      features: [
        "3 image-to-code conversions/month",
        
      ],
    },
    {
      id: "premium",
      name: "Premium",
      credits: 90,
      price: 14000, // ₹140
      originalPrice: 18000, // ₹180
      discount: 33,
      popular: false,
      color: "from-pink-500 to-pink-600",
      features: [
        "9 image-to-code conversions/month",
       
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      credits: 250,
      price: 40000, // ₹400
      originalPrice: 50000, // ₹500
      discount: 33,
      popular: false,
      color: "from-amber-500 to-amber-600",
      features: [
        "25 image-to-code conversions/month",
        
      ],
    },
  ];

  const handlePayment = async (pkg: CreditPackage) => {
    setLoading(true);
    setSelectedPackage(pkg.id);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: pkg.price }), // amount in paise
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: pkg.price,
        currency: "INR",
        name: "Img2Code",
        description: `${pkg.name} Credits Package`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verificationRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              packageId: pkg.id,
              credits: pkg.credits,
              userEmail: user?.email,
            }),
          });

          if (verificationRes.ok) {
            // Show success message
            alert(
              `Payment successful! ${pkg.credits} credits added to your account.`
            );
            onPaymentSuccess();
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#6366F1",
        },
      };

      // Initialize Razorpay after the script has loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay SDK failed to load");
        alert("Payment failed: Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div id="packages">
      {/* Special Offer Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 mb-12 shadow-xl text-white relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="offerGrid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#offerGrid)" />
          </svg>
        </div>

        <div className="absolute top-0 right-0">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            className="text-yellow-300 opacity-20"
          >
            <path d="M0 0L150 150V0H0Z" fill="currentColor" />
          </svg>
        </div>

        {/* Animated particles */}
        <AnimatePresence>
          {showSparkles && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`banner-particle-${i}`}
                  className="absolute"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -20],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                  }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-200" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              className="mr-4 bg-white/20 p-3 rounded-full"
              whileHover={{ rotate: 15 }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Gift className="h-10 w-10 text-white drop-shadow-lg" />
            </motion.div>
            <div>
              <motion.h3
                className="text-2xl font-bold mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Limited Time Offer!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-yellow-100"
              >
                Get up to 33% off on Premium and Enterprise packages
              </motion.p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button className="bg-white text-orange-500 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6">
              <Sparkles className="mr-2 h-4 w-4" />
              Claim Offer
            </Button>
          </motion.div>
        </div>

        {/* Animated highlight bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-200 via-white to-yellow-200"
          animate={{
            opacity: [0.3, 1, 0.3],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Credit Packages */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {creditPackages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              scale: 1.02,
            }}
            animate={
              highlightedPackage === pkg.id
                ? {
                    y: [-5, -15, -5],
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                  }
                : {}
            }
            className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${
              pkg.popular ? "ring-2 ring-purple-500" : ""
            }`}
          >
            {/* Sparkle effects when highlighted */}
            <AnimatePresence>
              {showSparkles && highlightedPackage === pkg.id && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`pkg-${pkg.id}-particle-${i}`}
                      className="absolute z-20"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -20],
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                      }}
                    >
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {pkg.popular && (
              <motion.div
                className="absolute top-0 right-0 z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  MOST POPULAR
                </div>
              </motion.div>
            )}

            {pkg.discount && (
              <motion.div
                className="absolute top-0 left-0 z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                  SAVE {pkg.discount}%
                </div>
              </motion.div>
            )}

            <motion.div
              className={`bg-gradient-to-r ${pkg.color} p-6 text-white relative overflow-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id={`grid-${pkg.id}`}
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#grid-${pkg.id})`}
                  />
                </svg>
              </div>

              <motion.h3
                className="text-xl font-bold mb-1 relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {pkg.name}
              </motion.h3>
              <motion.div
                className="flex items-baseline relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <motion.span
                  className="text-3xl font-bold"
                  animate={
                    highlightedPackage === pkg.id
                      ? {
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {formatPrice(pkg.price)}
                </motion.span>
                {pkg.originalPrice && (
                  <span className="ml-2 text-sm line-through opacity-70">
                    {formatPrice(pkg.originalPrice)}
                  </span>
                )}
              </motion.div>

              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 5,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            </motion.div>

            <div className="p-6">
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3 + index,
                  }}
                >
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                </motion.div>
                <span className="text-2xl font-bold text-gray-800">
                  {pkg.credits} Credits
                </span>
              </motion.div>

              {/* Features list */}
              <motion.ul
                className="mb-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {pkg.features?.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    className="flex items-start text-gray-600"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.1 + featureIndex * 0.05,
                    }}
                    whileHover={{ x: 3 }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => handlePayment(pkg)}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  {loading && selectedPackage === pkg.id ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Buy Now
                      <ArrowRight className="ml-1 h-4 w-4 opacity-70" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CreditPackages;

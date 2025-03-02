"use client";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import Constants from "@/data/Constants";
import { Sparkles, Star, Award, Crown, Check, ArrowRight } from "lucide-react";

const pricingPlans = Constants.CREDIT_COSTS.PRICING_PLANS.map(
  (plan, index) => ({
    title:
      index === 0
        ? "Basic"
        : index === 1
        ? "Standard"
        : index === 2
        ? "Premium"
        : "Enterprise",
    price: plan.price,
    originalPrice: plan.originalPrice || "",
    credits: `${plan.credits} Credits`,
    features: [`${plan.credits / 10} image-to-code conversions/month`].filter(
      Boolean
    ),
    popular: index === 1,
    cta: "Buy Now",
    save:
      index === 1
        ? "SAVE 17%"
        : index === 2
        ? "SAVE 33%"
        : index === 3
        ? "SAVE 33%"
        : undefined,
    icon:
      index === 0 ? Sparkles : index === 1 ? Star : index === 2 ? Award : Crown,
    iconColor:
      index === 0
        ? "from-blue-400 to-cyan-500"
        : index === 1
        ? "from-violet-500 to-purple-600"
        : index === 2
        ? "from-fuchsia-500 to-pink-600"
        : "from-indigo-400 via-blue-500 to-cyan-400",
    badge:
      index === 1
        ? "Popular"
        : index === 2
        ? "Best Value"
        : index === 3
        ? "Ultimate"
        : "",
  })
);

// Animation variants
const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingAnimation = {
  y: [-8, 8, -8],
  transition: {
    repeat: Infinity,
    duration: 6,
    ease: "easeInOut",
  },
};

export default function PricingSection() {
  return (
    <div id="pricing" className="py-24 relative overflow-hidden">
      {/* Animated background with decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-blue-50 z-0" />

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-20 blur-3xl"
        animate={{
          y: [-20, 20, -20],
          x: [10, -10, 10],
          scale: [1, 1.1, 1],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-20 blur-3xl"
        animate={{
          y: [20, -20, 20],
          x: [-15, 15, -15],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/3 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 opacity-10 blur-3xl"
        animate={{
          y: [-30, 30, -30],
          x: [-10, 10, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Small decorative shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${
            i % 3 === 0
              ? "from-purple-400 to-pink-400"
              : i % 3 === 1
              ? "from-blue-400 to-cyan-400"
              : "from-indigo-400 to-blue-400"
          }`}
          style={{
            top: `${20 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.5, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 5,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInScale}
          className="text-center mb-16"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-3"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-0.5 rounded-full transform rotate-1 shadow-lg">
              <div className="bg-white bg-opacity-95 rounded-full px-4 py-1.5 transform -rotate-1">
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
                  Pricing Options
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent"
          >
            Choose Your Perfect Plan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Simple, transparent pricing that grows with your business needs
          </motion.p>

          {/* Animated underline */}
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mt-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 100, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          />
        </motion.div>

        {/* Pricing cards container with staggered animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Decorative line connecting pricing cards */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent hidden lg:block" />

          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <PricingCard
                title={plan.title}
                price={plan.price}
                originalPrice={plan.originalPrice}
                credits={plan.credits}
                features={plan.features}
                popular={plan.popular}
                cta={plan.cta}
                save={plan.save}
                color={plan.iconColor}
                badge={plan.badge}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional promotional elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20"
        >
          {/* Testimonial/Trust indicators */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {[
                  "Trusted by thousands",
                  "Enterprise-ready",
                  "Secure & Compliant",
                  "24/7 Support",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.5 }}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full border border-purple-100"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Start your transformation today
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of developers accelerating their workflow
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>

            {/* Bottom decorative gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

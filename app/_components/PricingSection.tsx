"use client";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import {
  Crown,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Star,
  Award,
} from "lucide-react";
import Constants from "@/data/Constants";
export const pricingPlans = Constants.CREDIT_COSTS.PRICING_PLANS.map(
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
    cta: "Buy Now" ,
    save:
      index === 1
        ? "SAVE 17%"
        : index === 2
        ? "SAVE 33%"
        : index === 3
        ? "SAVE 50%"
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



// Array of colorful shapes for enhanced background
const colorfulShapes = [
  { color: "from-pink-300 to-purple-400", size: "w-64 h-64", blur: "blur-3xl" },
  { color: "from-blue-300 to-cyan-400", size: "w-72 h-72", blur: "blur-3xl" },
  {
    color: "from-yellow-300 to-orange-400",
    size: "w-56 h-56",
    blur: "blur-3xl",
  },
  {
    color: "from-green-300 to-emerald-400",
    size: "w-48 h-48",
    blur: "blur-2xl",
  },
  {
    color: "from-purple-300 to-indigo-400",
    size: "w-60 h-60",
    blur: "blur-3xl",
  },
  { color: "from-rose-300 to-red-400", size: "w-40 h-40", blur: "blur-2xl" },
];

export default function PricingSection() {
  return (
    <div id="pricing" className="py-24 relative overflow-hidden">
      {/* Enhanced animated background with more colorful elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 z-0">
        {/* Add animated mesh gradient */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-300 via-blue-200 to-transparent" />
      </div>

     
  

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInScale}
          className="text-center mb-16"
        >
          {/* Enhanced animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-3"
          >
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-0.5 rounded-full transform rotate-1 shadow-lg">
              <div className="bg-white dark:bg-gray-800 bg-opacity-95 rounded-full px-6 py-2 transform -rotate-1">
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider flex items-center">
                  <Zap className="w-4 h-4 mr-2 inline-block" /> Pricing Options
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent"
          >
            Choose Your Perfect Plan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Simple, transparent pricing that grows with your business needs
          </motion.p>

          {/* Enhanced animated underline */}
          <motion.div
            className="h-1.5 w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto mt-6 shadow-sm"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 120, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          />
        </motion.div>

        {/* Pricing card filter tabs - new addition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex justify-center mb-10"
        ></motion.div>

        {/* Enhanced pricing cards container with staggered animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced decorative line connecting pricing cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1 }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent hidden xl:block"
          />

          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className={`${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
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

        {/* Enhanced trust and promotional section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20"
        >
          {/* Trust indicators */}
          <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { text: "Trusted by thousands", icon: Shield },
                  { text: "Enterprise-ready", icon: Crown },
                  { text: "Secure & Compliant", icon: Shield },
                  { text: "24/7 Support", icon: Clock },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 flex flex-col items-center justify-center text-center"
                  >
                    <item.icon className="w-6 h-6 mb-2 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.text}
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
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Start your transformation today
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join thousands of developers accelerating their workflow with
                  our powerful image-to-code conversion tools
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
                  >
                    Book a Demo
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Enhanced bottom decorative gradient bar */}
            <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-size-200 animate-gradient-x" />
          </div>

          {/* New FAQ section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-16 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 p-8"
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
              Frequently Asked Questions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "How do credits work?",
                  a: "Each credit allows you to convert a certain number of designs to code. Credits are consumed on successful conversions.",
                },
                {
                  q: "Can I upgrade my plan anytime?",
                  a: "Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of your billing cycle.",
                },
                {
                  q: "Do credits expire?",
                  a: "Credits are valid for 12 months from the date of purchase. Unused credits will expire after this period.",
                },
                {
                  q: "Is there a refund policy?",
                  a: "We offer a 14-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i + 0.5 }}
                  className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/50"
                >
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add CSS for animated gradient */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}

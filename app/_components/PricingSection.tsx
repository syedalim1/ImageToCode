"use client";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";

export default function PricingSection({ pricingPlans }) {
  return (
    <div id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
          >
            Simple, transparent pricing that scales with your needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              originalPrice={plan.originalPrice}
              credits={plan.credits}
              features={plan.features}
              popular={plan.popular}
              cta={plan.cta}
              save={plan.save}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

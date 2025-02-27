"use client";

import { motion } from "framer-motion";
import { features } from "../data/features";

export const FeaturesSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="p-6 rounded-2xl bg-white transition-all duration-300 border border-gray-100 shadow-xl"
            >
              <div
                className={`w-12 h-12 rounded-xl ${
                  feature.color.split(" ")[0]
                } flex items-center justify-center mb-4 shadow-sm`}
              >
                <feature.icon
                  className={`h-6 w-6 ${feature.color.split(" ")[1]}`}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
"use client";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function FeaturesSection({ features }) {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-purple-600 tracking-wide uppercase"
          >
            Powerful Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          >
            Why Choose Img2Code?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto"
          >
            Our platform offers everything you need to streamline your
            design-to-code workflow
          </motion.p>
        </div>

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
              className={`p-8 rounded-2xl ${feature.color} transition-all duration-300 border border-gray-100`}
            >
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <feature.icon className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                {feature.emoji} {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
              <motion.div className="mt-6" whileHover={{ x: 5 }}>
                <a
                  href="#"
                  className="text-purple-600 font-medium flex items-center"
                >
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Design Workflow?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join thousands of developers saving hours every week
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl"
          >
            Get Started For Free
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

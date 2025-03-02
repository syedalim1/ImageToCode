"use client";
import { motion } from "framer-motion";

export default function StatsSection({ stats }) {
  return (
    <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              >
                <p className="text-4xl font-bold mb-1">{stat.value}</p>
              </motion.div>
              <p className="text-purple-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


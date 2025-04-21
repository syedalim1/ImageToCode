"use client";
import { motion } from "framer-motion";
import { Users, Clock, Code, Sparkles, Zap, Star } from "lucide-react";

export default function CTASection() {
  return (
    <div className="relative py-24 overflow-hidden ">
    
     
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Enhanced animated badge with improved glass effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-30 backdrop-blur-md px-6 py-2 rounded-full border border-white border-opacity-40 shadow-xl"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent flex items-center bg-size-200"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                </motion.div>
                NEW FEATURE: AI-POWERED COMPONENTS
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Enhanced heading with more dramatic gradient and animation */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent bg-size-200 inline-block"
            >
              Ready to Transform
            </motion.span>
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
              className="block md:inline md:ml-3 bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent bg-size-200"
            >
              Your Design Workflow?
            </motion.span>
          </motion.h2>

          {/* Enhanced subheading with animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-black font-bold mb-12"
          >
            <motion.span
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Join thousands of developers saving hours every week with our
              powerful image-to-code technology
            </motion.span>
          </motion.p>

          {/* Enhanced stats section with improved glass morphism and interactive hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: Users, value: "10,000+", label: "Active Users", color: "from-blue-500 to-indigo-600" },
              { icon: Clock, value: "25+ hrs", label: "Saved Weekly", color: "from-fuchsia-500 to-purple-600" },
              { icon: Code, value: "1M+", label: "Components Created", color: "from-blue-500 to-indigo-600" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white bg-opacity-25 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-40 shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    animate={{
                      boxShadow: ["0 0 0 rgba(192, 132, 252, 0.4)", "0 0 15px rgba(192, 132, 252, 0.7)", "0 0 0 rgba(192, 132, 252, 0.4)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`bg-gradient-to-r ${stat.color} p-3 rounded-full mb-3`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.span
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 bg-size-200`}
                  >
                    {stat.value}
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    className="text-sm text-black font-medium"
                  >
                    {stat.label}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>



        </motion.div>
      </div>
    </div>
  );
}
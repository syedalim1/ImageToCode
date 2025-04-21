
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React from "react";

export const HeaderSection = () => {
    return (
        <>
            <div className="flex justify-between items-start mb-4">
                <motion.h2
                    className="text-2xl font-bold text-indigo-800 flex items-center"
                    whileHover={{ scale: 1.02 }}
                >
                    <motion.div
                        className="mr-3 p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg"
                        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    Describe Your Design
                </motion.h2>

              
            </div>

            <motion.p
                className="text-indigo-600 mb-6 pl-8 text-sm md:text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                Add details to help the AI understand your design better
                <motion.span
                    className="inline-block ml-1"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >✨</motion.span>
            </motion.p>
        </>
    );
};
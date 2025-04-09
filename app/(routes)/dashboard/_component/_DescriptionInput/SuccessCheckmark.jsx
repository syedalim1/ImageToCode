// SuccessCheckmark.jsx
"use client";

import { motion } from "framer-motion";
import React from "react";

export const SuccessCheckmark = ({ onComplete }) => {
    const pathLength = 1;

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-xl p-8 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <motion.div
                    className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <motion.path
                            d="M10 20L17 27L30 13"
                            stroke="#10B981"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            onAnimationComplete={() => {
                                setTimeout(onComplete, 1000);
                            }}
                        />
                    </svg>
                </motion.div>
                <motion.p
                    className="mt-4 text-center text-gray-700 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Saved successfully!
                </motion.p>
            </motion.div>
        </motion.div>
    );
};
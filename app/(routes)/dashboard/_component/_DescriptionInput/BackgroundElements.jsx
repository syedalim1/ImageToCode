// BackgroundElements.jsx
"use client";

import { motion } from "framer-motion";
import React from "react";

export const BackgroundElements = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 8 + 3,
                        height: Math.random() * 8 + 3,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(
                            Math.random() * 100
                        ) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.3)`,
                    }}
                    animate={{
                        x: [0, Math.random() * 40 - 20, 0],
                        y: [0, Math.random() * 40 - 20, 0],
                        scale: [1, Math.random() * 0.5 + 1, 1],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: Math.random() * 8 + 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Gradient orbs */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-3xl"></div>
            <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-0 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-300 to-teal-300 opacity-10 blur-2xl"></div>

            {/* Animated glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};
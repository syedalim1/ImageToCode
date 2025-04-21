import React from 'react';
import { motion } from 'framer-motion';

const ColorfulTextComponent = () => {
    return (
        <motion.div
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-10 rounded-xl shadow-[0_0_40px_rgba(120,0,255,0.35)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >

            <div className=" rounded-xl p-8   relative z-10">


                <motion.h3
                    className="text-3xl font-bold  mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Ready to Create Magic!
                </motion.h3>

                <motion.p
                    className="text-xl text-white mb-6 text-center font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    If you want to generate code, click the <span className="font-semibold text-yellow-300">Generate Code</span> button.
                    <br />After clicking, all code will be displayed here.
                </motion.p>

                <motion.div
                    className="flex justify-center mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Get Started
                    </span>

                </motion.div>
            </div>
        </motion.div>
    );
};

export default ColorfulTextComponent;
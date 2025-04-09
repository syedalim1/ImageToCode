// TemplatesPanel.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import React from "react";
import { Template } from "./types";

export const TemplatesPanel = ({ showTemplates, savedTemplates, setUserDescription, deleteTemplate }) => {
    return (
        <AnimatePresence>
            {showTemplates && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 overflow-hidden"
                >
                    <div className="bg-white p-3 rounded-lg shadow-md border border-indigo-100">
                        <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> Saved Templates
                        </h3>
                        {savedTemplates.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto">
                                {savedTemplates.map((template, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex justify-between items-center p-2 hover:bg-indigo-50 rounded-md mb-1 group"
                                        whileHover={{ x: 5 }}
                                    >
                                        <button
                                            className="text-left text-xs text-gray-700 truncate flex-1"
                                            onClick={() => setUserDescription(template.content)}
                                        >
                                            {template.title}
                                        </button>
                                        <button
                                            onClick={() => deleteTemplate(template.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No saved templates yet</p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
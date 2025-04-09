// AiSuggestionsPanel.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles } from "lucide-react";
import React from "react";

export const AiSuggestionsPanel = ({ showAiSuggestions, getAiSuggestion, isGeneratingSuggestion }) => {
    return (
        <AnimatePresence>
            {showAiSuggestions && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 overflow-hidden"
                >
                    <div className="bg-white p-3 rounded-lg shadow-md border border-indigo-100">
                        <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                            <Wand2 className="w-4 h-4 mr-1" /> AI Suggestions
                        </h3>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => getAiSuggestion()}
                            disabled={isGeneratingSuggestion}
                            className={`w-full py-2 px-3 rounded-md text-sm font-medium text-white ${isGeneratingSuggestion ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'} transition-all duration-300 flex items-center justify-center`}
                        >
                            {isGeneratingSuggestion ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating suggestion...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate AI Suggestion
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
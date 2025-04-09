// TagSuggestionsPanel.jsx
"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import React from "react";

export const TagSuggestionsPanel = ({ tagSuggestions, setUserDescription, userDescription }) => {
    return (
        <div className="mt-4">
            {Object.entries(tagSuggestions).map(([category, tags], categoryIndex) => (
                <div key={category} className="mb-3">
                    <h3 className="text-xs font-medium text-indigo-800 mb-2">{category}:</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, tagIndex) => (
                            <motion.button
                                key={tag}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * (tagIndex + categoryIndex * 5) }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setUserDescription(
                                        userDescription + (userDescription ? " " : "") + tag
                                    )
                                }
                                className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-sm rounded-full border border-indigo-200 transition-all duration-300 shadow-sm hover:shadow flex items-center"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {tag}
                            </motion.button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
// ExportOptionsPanel.jsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Code, FileJson } from "lucide-react";

export const ExportOptionsPanel = ({ show, onExport, onClose }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-indigo-100 p-2 w-48"
                >
                    <div className="flex flex-col space-y-1">
                        <button
                            onClick={() => onExport('txt')}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                            <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                            Text (.txt)
                        </button>
                        <button
                            onClick={() => onExport('md')}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                            <Code className="w-4 h-4 mr-2 text-indigo-500" />
                            Markdown (.md)
                        </button>
                        <button
                            onClick={() => onExport('json')}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                            <FileJson className="w-4 h-4 mr-2 text-indigo-500" />
                            JSON (.json)
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
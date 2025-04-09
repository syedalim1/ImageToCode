// ActionButtons.jsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Copy, Download, Check, Maximize2, Minimize2 } from "lucide-react";
import { ExportOptionsPanel } from "./ExportOptionsPanel";

export const ActionButtons = ({
    saveTemplate,
    copyToClipboard,
    exportDescription,
    isFullscreen,
    toggleFullscreen,
    copiedToClipboard
}) => {
    const [showExportOptions, setShowExportOptions] = useState(false);

    return (
        <div className="flex items-center mt-3 space-x-2 relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveTemplate}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md text-sm shadow hover:bg-indigo-700 transition-colors"
            >
                <Save className="w-4 h-4 mr-1" />
                Save
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="flex items-center px-3 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-md text-sm hover:bg-indigo-50 transition-colors shadow-sm"
            >
                {copiedToClipboard ? (
                    <>
                        <Check className="w-4 h-4 mr-1 text-green-500" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                    </>
                )}
            </motion.button>

            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center px-3 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-md text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                </motion.button>

                <ExportOptionsPanel
                    show={showExportOptions}
                    onExport={exportDescription}
                    onClose={() => setShowExportOptions(false)}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="flex items-center p-2 bg-white text-indigo-600 border border-indigo-200 rounded-md text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
            >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </motion.button>
        </div>
    );
};
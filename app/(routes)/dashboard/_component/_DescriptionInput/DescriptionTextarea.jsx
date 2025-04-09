// DescriptionTextarea.jsx
"use client";

import React from "react";

export const DescriptionTextarea = ({ userDescription, setUserDescription, isUploading, textareaRef }) => {
    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
                className={`w-full h-48 p-5 border-2 border-indigo-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-inner text-gray-700 transition-all duration-300 ${isUploading ? "bg-gray-100 opacity-70" : ""}`}
                disabled={isUploading}
            />

            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-70 backdrop-blur-sm">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20"></div>
                        <svg
                            className="animate-spin h-10 w-10 text-indigo-600 relative z-10"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};
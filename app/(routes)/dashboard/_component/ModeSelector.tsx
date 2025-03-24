"use client";

import React from "react";

interface ModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  setSelectedMode,
}) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 p-6 shadow-xl border-2 border-purple-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300 opacity-20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-xl"></div>

      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
            <svg
              className="w-7 h-7 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Select Mode
          </h2>

          <div className="flex space-x-1">
            <span className="h-3 w-3 bg-red-400 rounded-full"></span>
            <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
            <span className="h-3 w-3 bg-green-400 rounded-full"></span>
          </div>
        </div>

        <p className="text-indigo-700 mb-6 pl-9 font-medium">
          Choose the perfect mode for your code generation ✨
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Normal Mode Card */}
          <div
            className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              selectedMode === "normal"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-white bg-opacity-80 text-gray-700 hover:bg-blue-50 border border-blue-200"
            }`}
            onClick={() => setSelectedMode("normal")}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

            <input
              type="radio"
              id="normal"
              value="normal"
              checked={selectedMode === "normal"}
              onChange={() => setSelectedMode("normal")}
              className="absolute opacity-0"
            />
            <label
              htmlFor="normal"
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                  selectedMode === "normal"
                    ? "bg-white shadow-inner"
                    : "border-2 border-indigo-400"
                }`}
              >
                {selectedMode === "normal" && (
                  <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg flex items-center">
                  <span>Normal Mode</span>
                  <svg
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 7L18 12M18 12L13 17M18 12H6"
                      stroke={selectedMode === "normal" ? "white" : "#6366F1"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedMode === "normal"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  10 Credits
                </div>
              </div>
            </label>

            {/* Feature List */}
            <div
              className={`mt-4 pl-11 ${
                selectedMode === "normal" ? "text-blue-100" : "text-gray-600"
              }`}
            >
              <div className="flex items-center text-sm mb-1">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "normal" ? "white" : "#818CF8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Standard code generation</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "normal" ? "white" : "#818CF8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Basic documentation</span>
              </div>
            </div>

            {selectedMode === "normal" && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                BASIC
              </div>
            )}
          </div>

          {/* Export Mode Card */}
          <div
            className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              selectedMode === "export"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                : "bg-white bg-opacity-80 text-gray-700 hover:bg-purple-50 border border-purple-200"
            }`}
            onClick={() => setSelectedMode("export")}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

            <input
              type="radio"
              id="export"
              value="export"
              checked={selectedMode === "export"}
              onChange={() => setSelectedMode("export")}
              className="absolute opacity-0"
            />
            <label
              htmlFor="export"
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                  selectedMode === "export"
                    ? "bg-white shadow-inner"
                    : "border-2 border-purple-400"
                }`}
              >
                {selectedMode === "export" && (
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg flex items-center">
                  <span>Export Mode</span>
                  <svg
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4V20M12 4L6 10M12 4L18 10"
                      stroke={selectedMode === "export" ? "white" : "#9333EA"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedMode === "export"
                      ? "text-pink-100"
                      : "text-gray-500"
                  }`}
                >
                  30 Credits
                </div>
              </div>
            </label>

            {/* Feature List */}
            <div
              className={`mt-4 pl-11 ${
                selectedMode === "export" ? "text-pink-100" : "text-gray-600"
              }`}
            >
              <div className="flex items-center text-sm mb-1">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "export" ? "white" : "#C084FC"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Advanced export options</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "export" ? "white" : "#C084FC"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Premium features</span>
              </div>
            </div>

            {selectedMode === "export" && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                PREMIUM
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="mt-6 pt-4 border-t border-purple-200 flex justify-between items-center text-xs text-indigo-500 font-medium">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Mode info</span>
        </div>
        <div className="flex items-center">
          <span>Current balance: 120 credits</span>
          <svg
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8Z"
              fill="currentColor"
            />
            <path
              d="M17.3033 15.3033C16.9274 15.6792 16.9274 16.2793 17.3033 16.6552C17.6792 17.0311 18.2793 17.0311 18.6552 16.6552C19.031 16.2793 19.031 15.6792 18.6552 15.3033C18.2793 14.9274 17.6792 14.9274 17.3033 15.3033Z"
              fill="currentColor"
            />
            <path
              d="M6.6967 15.3033C6.32082 14.9274 5.72069 14.9274 5.34481 15.3033C4.96893 15.6792 4.96893 16.2793 5.34481 16.6552C5.72069 17.0311 6.32082 17.0311 6.6967 16.6552C7.07258 16.2793 7.07258 15.6792 6.6967 15.3033Z"
              fill="currentColor"
            />
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;

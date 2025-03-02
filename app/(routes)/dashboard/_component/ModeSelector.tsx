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
    <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg border border-purple-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-indigo-800 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
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
        <p className="text-indigo-600 mb-6 pl-8">
          Choose the perfect mode for your code generation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedMode === "normal"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105"
                : "bg-white bg-opacity-70 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedMode("normal")}
          >
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
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedMode === "normal"
                    ? "bg-white"
                    : "border-2 border-indigo-400"
                }`}
              >
                {selectedMode === "normal" && (
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <div>
                <div className="font-bold text-lg">Normal Mode</div>
                <div
                  className={`text-sm ${
                    selectedMode === "normal"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  10 Credits
                </div>
              </div>
            </label>
            {selectedMode === "normal" && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">
                BASIC
              </div>
            )}
          </div>

          <div
            className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedMode === "export"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md transform scale-105"
                : "bg-white bg-opacity-70 text-gray-700 hover:bg-purple-50"
            }`}
            onClick={() => setSelectedMode("export")}
          >
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
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedMode === "export"
                    ? "bg-white"
                    : "border-2 border-purple-400"
                }`}
              >
                {selectedMode === "export" && (
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                )}
              </div>
              <div>
                <div className="font-bold text-lg">Export Mode</div>
                <div
                  className={`text-sm ${
                    selectedMode === "export"
                      ? "text-pink-100"
                      : "text-gray-500"
                  }`}
                >
                  30 Credits
                </div>
              </div>
            </label>
            {selectedMode === "export" && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                PREMIUM
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;

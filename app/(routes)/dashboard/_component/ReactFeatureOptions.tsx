"use client";
import React from "react";

import { REACT_OPTIONS } from "@/data/Constants";
import { CheckCircle, Code2 } from "lucide-react";



interface ReactFeatureOptionsProps {
  selectedOptions: string[];
  toggleOption: (option: string) => void;
}

const ReactFeatureOptions: React.FC<ReactFeatureOptionsProps> = ({
  selectedOptions,
  toggleOption,
}) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg border border-purple-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-xl"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-800">
          <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
            <Code2 className="h-6 w-6 text-indigo-600" />
          </div>
          React Features
          <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
            Customize
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REACT_OPTIONS.map((option) => {
            const isSelected = selectedOptions.includes(option.value);

            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`relative p-4 rounded-lg flex items-center gap-3 transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? `ring-2 ring-offset-2 ring-offset-indigo-50 ring-${
                        option.gradient.split("-")[1]
                      }-400 shadow-md transform hover:scale-102`
                    : `bg-white bg-opacity-80 hover:bg-opacity-100 border ${option.borderColor} hover:shadow-md`
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-10`}
                  ></div>
                )}

                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    isSelected ? option.color : "bg-gray-100"
                  }`}
                >
                  <span className={isSelected ? "" : "text-gray-400"}>
                    {option.icon}
                  </span>
                </div>

                <div className="text-left flex-1">
                  <p
                    className={`font-medium transition-colors duration-300 ${
                      isSelected ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {option.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                </div>

                {isSelected ? (
                  <div className="ml-auto bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                ) : (
                  <div className="ml-auto w-7 h-7 rounded-full border-2 border-gray-200"></div>
                )}

                {isSelected && (
                  <>
                    <span className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-green-500 border-l-transparent border-b-transparent"></span>
                    <div className="absolute -bottom-1 -left-1 w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse mr-2"></div>
            <p className="text-xs text-indigo-600 font-medium">
              {selectedOptions.length} feature
              {selectedOptions.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          {selectedOptions.length > 0 && (
            <button
              onClick={() =>
                selectedOptions.forEach((opt) => toggleOption(opt))
              }
              className="text-xs px-3 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors flex items-center"
            >
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 7L5 7M14 11L10 11M16 15H8M9 3H15M9 3C9 3 9 3 9 3C7.89543 3 7 3.89543 7 5V5M15 3C15 3 15 3 15 3C16.1046 3 17 3.89543 17 5V5M7 5V19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactFeatureOptions;

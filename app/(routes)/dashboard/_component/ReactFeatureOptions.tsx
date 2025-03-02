"use client";
import React from "react";
import { CheckCircle, Code2 } from "lucide-react";

// Import missing icons
import { Move, Palette, Layout, Zap, Layers, Smartphone } from "lucide-react";

// Enhanced Options for React
const REACT_OPTIONS = [
  {
    name: "Animations",
    value: "animations",
    icon: <Move className="h-5 w-5" />,
    description: "Add smooth animations to components",
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500 to-fuchsia-600",
    borderColor: "border-purple-200",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
    color: "bg-pink-100 text-pink-600",
    gradient: "from-pink-500 to-rose-600",
    borderColor: "border-pink-200",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: <Layout className="h-5 w-5" />,
    description: "Ensure the design works on all screen sizes",
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-200",
  },
  {
    name: "Performance Optimized",
    value: "performance",
    icon: <Zap className="h-5 w-5" />,
    description: "Code optimized for fast loading and rendering",
    color: "bg-yellow-100 text-yellow-600",
    gradient: "from-amber-500 to-yellow-600",
    borderColor: "border-yellow-200",
  },
  {
    name: "Component Architecture",
    value: "components",
    icon: <Layers className="h-5 w-5" />,
    description: "Well-structured reusable component system",
    color: "bg-green-100 text-green-600",
    gradient: "from-green-500 to-emerald-600",
    borderColor: "border-green-200",
  },
  {
    name: "Mobile First",
    value: "mobile",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Prioritize mobile experience with adaptive design",
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-500 to-violet-600",
    borderColor: "border-indigo-200",
  },
];

interface ReactFeatureOptionsProps {
  selectedOptions: string[];
  toggleOption: (option: string) => void;
}

const ReactFeatureOptions: React.FC<ReactFeatureOptionsProps> = ({
  selectedOptions,
  toggleOption,
}) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg border border-purple-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Code2 className="h-6 w-6 text-indigo-600" />
        </div>
        React Features
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
                    }-400 shadow-md`
                  : `bg-white bg-opacity-80 hover:bg-opacity-100 border ${option.borderColor}`
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
                <span className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-green-500 border-l-transparent border-b-transparent"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xs text-indigo-600">
          {selectedOptions.length} feature
          {selectedOptions.length !== 1 ? "s" : ""} selected
        </p>
        {selectedOptions.length > 0 && (
          <button
            onClick={() => selectedOptions.forEach((opt) => toggleOption(opt))}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default ReactFeatureOptions;

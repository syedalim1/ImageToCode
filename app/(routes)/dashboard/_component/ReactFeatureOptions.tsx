"use client";
import { CheckCircle } from "lucide-react";
import { Code2 } from "lucide-react";

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
    hoverColor: "hover:bg-purple-50",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
    color: "bg-pink-100 text-pink-600",
    hoverColor: "hover:bg-pink-50",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: <Layout className="h-5 w-5" />,
    description: "Ensure the design works on all screen sizes",
    color: "bg-blue-100 text-blue-600",
    hoverColor: "hover:bg-blue-50",
  },
  {
    name: "Performance Optimized",
    value: "performance",
    icon: <Zap className="h-5 w-5" />,
    description: "Code optimized for fast loading and rendering",
    color: "bg-yellow-100 text-yellow-600",
    hoverColor: "hover:bg-yellow-50",
  },
  {
    name: "Component Architecture",
    value: "components",
    icon: <Layers className="h-5 w-5" />,
    description: "Well-structured reusable component system",
    color: "bg-green-100 text-green-600",
    hoverColor: "hover:bg-green-50",
  },
  {
    name: "Mobile First",
    value: "mobile",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Prioritize mobile experience with adaptive design",
    color: "bg-indigo-100 text-indigo-600",
    hoverColor: "hover:bg-indigo-50",
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
    <div className="p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Code2 className="h-5 w-5 text-blue-600" />
        React Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REACT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
              selectedOptions.includes(option.value)
                ? `ring-2 ring-blue-500 ${option.color}`
                : `${option.hoverColor} border border-gray-200`
            }`}
          >
            <span
              className={
                selectedOptions.includes(option.value)
                  ? option.color
                  : "text-gray-400"
              }
            >
              {option.icon}
            </span>
            <div className="text-left">
              <p className="font-medium">{option.name}</p>
              <p className="text-xs text-gray-500">
                {option.description}
              </p>
            </div>
            {selectedOptions.includes(option.value) && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactFeatureOptions;

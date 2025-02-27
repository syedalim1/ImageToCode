"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Smartphone, Zap, Palette, Code2, Layers } from "lucide-react";

interface ReactFeatureOptionsProps {
  selectedOptions: string[];
  toggleOption: (option: string) => void;
}

const features = [
  {
    id: "responsive",
    name: "Responsive Design",
    description: "Adapts perfectly to all screen sizes",
    icon: Smartphone,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "animations",
    name: "Smooth Animations",
    description: "Beautiful motion and transitions",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "modern",
    name: "Modern UI",
    description: "Contemporary design patterns",
    icon: Palette,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "optimized",
    name: "Optimized Code",
    description: "Clean and efficient implementation",
    icon: Code2,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "components",
    name: "Reusable Components",
    description: "Modular and maintainable structure",
    icon: Layers,
    gradient: "from-rose-500 to-red-500",
  }
];

export default function ReactFeatureOptions({
  selectedOptions,
  toggleOption,
}: ReactFeatureOptionsProps) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-100/40 to-pink-100/40 opacity-50" />
      
      <div className="relative p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 text-sm font-medium inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            Enhance Your Code
          </span>
          <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Select Features
          </h2>
          <p className="text-gray-600 mt-2">
            Choose the features you want to include in your generated code
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const isSelected = selectedOptions.includes(feature.id);
            
            return (
              <motion.button
                key={feature.id}
                onClick={() => toggleOption(feature.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-4 rounded-xl text-left transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-br ${feature.gradient} text-white shadow-lg ring-2 ring-white/50` 
                    : 'bg-white/50 hover:bg-white/80 border border-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? "bg-white/20" : `bg-gradient-to-br ${feature.gradient} bg-opacity-10`
                  }`}>
                    <feature.icon className={`h-5 w-5 ${
                      isSelected ? "text-white" : "text-transparent bg-gradient-to-br " + feature.gradient + " bg-clip-text"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{feature.name}</h3>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-white/20" : "border-2 border-gray-300"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <p className={`text-xs ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                  {feature.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
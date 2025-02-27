"use client";

import { motion } from "framer-motion";
import { Zap, Crown, Sparkles, Rocket, Star, Code2 } from "lucide-react";

interface ModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  preview: string | null;
}

const modes = [
  {
    id: "normal",
    name: "Standard",
    credits: 10,
    icon: Code2,
    description: "Perfect for quick prototypes and personal projects",
    features: ["Basic code generation", "Standard components", "Community support"],
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    bgGlow: "before:bg-blue-500/20",
  },
  {
    id: "export",
    name: "Professional",
    credits: 30,
    icon: Rocket,
    description: "Advanced features for production-ready code",
    features: ["Premium components", "Source code access", "Priority support"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGlow: "before:bg-purple-500/20",
    recommended: true,
  },
];

export default function ModeSelector({ selectedMode, setSelectedMode }: ModeSelectorProps) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-100/40 to-pink-100/40 opacity-50" />
      
      <div className="relative p-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 text-sm font-medium inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Choose Your Mode
          </span>
          <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Select Generation Mode
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;
            const Icon = mode.icon;

            return (
              <motion.button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-6 rounded-xl text-left transition-all duration-300
                  before:absolute before:inset-0 before:rounded-xl before:blur-2xl before:opacity-30
                  ${mode.bgGlow}
                  ${isSelected 
                    ? `bg-gradient-to-br ${mode.gradient} text-white shadow-lg ring-2 ring-white/50` 
                    : 'hover:bg-white/50 bg-white/30'
                  }
                `}
              >
                {mode.recommended && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3" />
                      Recommended
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected ? "bg-white/20" : "bg-gradient-to-br " + mode.gradient + " bg-clip-text"
                  }`}>
                    <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-transparent"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{mode.name}</h3>
                    <div className="flex items-center text-sm">
                      <Zap className={`h-4 w-4 mr-1 ${isSelected ? "text-white" : "text-purple-500"}`} />
                      <span>{mode.credits} Credits</span>
                    </div>
                  </div>
                </div>

                <p className={`text-sm mb-4 ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                  {mode.description}
                </p>

                <ul className="space-y-2">
                  {mode.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`text-sm flex items-center gap-2 ${
                        isSelected ? "text-white/90" : "text-gray-600"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
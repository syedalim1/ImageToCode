"use client";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Zap,
  CheckCircle,
} from "lucide-react";

interface ActionButtonProps {
  activeTab: "upload" | "options" | "description";
  isUploading: boolean;
  canProceed: boolean;
  handleUpload: () => void;
  goToNextStep: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  activeTab,
  isUploading,
  canProceed,
  handleUpload,
  goToNextStep,
}) => {
  // Button text and icons based on current step
  const buttonConfig = {
    upload: {
      icon: (
        <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
      ),
      text: "Continue to Features",
      accent:
        "from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600",
      secondaryIcon: <Palette className="h-4 w-4 ml-2 text-blue-200" />,
    },
    options: {
      icon: (
        <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
      ),
      text: "Continue to Description",
      accent:
        "from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-600",
      secondaryIcon: <CheckCircle className="h-4 w-4 ml-2 text-indigo-200" />,
    },
    description: {
      icon: <Sparkles className="h-5 w-5 mr-2 animate-pulse text-yellow-300" />,
      text: "Generate React Code",
      accent:
        "from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600",
      secondaryIcon: <Code className="h-4 w-4 ml-2 text-purple-200" />,
    },
  };

  const currentConfig = buttonConfig[activeTab];

  return (
    <div className="mt-8 flex flex-col items-center">
      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-center space-x-2">
        <div
          className={`h-2 w-14 rounded-full ${
            activeTab === "upload"
              ? "bg-blue-500"
              : "bg-blue-500 bg-opacity-100"
          }`}
        ></div>
        <div
          className={`h-2 w-14 rounded-full ${
            activeTab === "options"
              ? "bg-indigo-500"
              : activeTab === "description"
              ? "bg-indigo-500"
              : "bg-indigo-500 bg-opacity-40"
          }`}
        ></div>
        <div
          className={`h-2 w-14 rounded-full ${
            activeTab === "description"
              ? "bg-purple-500"
              : "bg-purple-500 bg-opacity-40"
          }`}
        ></div>
      </div>

      {/* Main action button with enhanced styling */}
      <div className="relative group">
        {/* Animated glowing effect */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${currentConfig.accent} opacity-70 blur-lg group-hover:opacity-100 group-hover:blur-xl transition duration-500 rounded-full`}
        ></div>

        <Button
          onClick={activeTab === "description" ? handleUpload : goToNextStep}
          disabled={isUploading || !canProceed}
          className={`relative px-12 py-6 text-lg bg-gradient-to-r ${currentConfig.accent} shadow-lg border border-white/10 rounded-full group transition-all duration-300`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full animate-pulse"></div>
              <Loader2 className="h-6 w-6 mr-3 animate-spin text-white" />
              <span className="flex items-center">
                Generating Magic
                <span className="ml-1 animate-bounce">.</span>
                <span
                  className="ml-1 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  .
                </span>
                <span
                  className="ml-1 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  .
                </span>
              </span>
              <Zap className="h-5 w-5 ml-3 text-yellow-300 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {currentConfig.icon}
              <span>{currentConfig.text}</span>
              {currentConfig.secondaryIcon}
            </div>
          )}
        </Button>
      </div>

      {/* Status indicator */}
      <div className="mt-4 text-sm font-medium text-center">
        {!canProceed && (
          <div className="text-orange-500 flex items-center justify-center">
            <Zap className="h-4 w-4 mr-1" />
            {activeTab === "upload"
              ? "Please upload an image to continue"
              : activeTab === "options"
              ? "Select at least one option"
              : "Add a brief description of your needs"}
          </div>
        )}
        {canProceed && !isUploading && (
          <div className="text-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            {activeTab === "upload"
              ? "Image ready! Continue to customize options"
              : activeTab === "options"
              ? "Options selected! Continue to add details"
              : "Ready to generate your React code"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButton;

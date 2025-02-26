"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

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
  return (
    <div className="mt-8 flex justify-center">
      <Button
        onClick={activeTab === "description" ? handleUpload : goToNextStep}
        disabled={isUploading || !canProceed}
        className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 shadow-lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Magic...
          </>
        ) : (
          <>
            {activeTab === "description" ? (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate React Code
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5 mr-2" />
                {activeTab === "upload"
                  ? "Continue to Features"
                  : "Continue to Description"}
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButton;

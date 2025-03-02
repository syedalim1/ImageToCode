import React from "react";
import { ImageIcon, Code2, FileCode, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressStepsProps {
  activeTab: "upload" | "options" | "description";
  setActiveTab: (tab: "upload" | "options" | "description") => void;
  selectedFile: File | null;
  selectedOptions: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  activeTab,
  setActiveTab,
  selectedFile,
  selectedOptions,
}) => {
  // Determine if each step is complete, active, or locked
  const isUploadComplete = !!selectedFile;
  const isOptionsComplete = selectedOptions && selectedOptions.length > 0;

  const getStepStatus = (step: "upload" | "options" | "description") => {
    if (activeTab === step) return "active";
    if (step === "upload" && isUploadComplete) return "complete";
    if (step === "options" && isOptionsComplete) return "complete";
    if (step === "options" && !isUploadComplete) return "locked";
    if (step === "description" && (!isUploadComplete || !isOptionsComplete))
      return "locked";
    return "inactive";
  };

  // Get appropriate styles based on step status
  const getStepStyles = (status: string) => {
    switch (status) {
      case "complete":
        return {
          circle: "bg-green-100 text-green-600",
          text: "text-green-600",
          icon: <CheckCircle className="h-5 w-5" />,
        };
      case "active":
        return {
          circle:
            "bg-blue-100 text-blue-600 ring-2 ring-blue-400 ring-offset-2",
          text: "text-blue-600 font-medium",
          icon: null,
        };
      case "locked":
        return {
          circle: "bg-gray-100 text-gray-400",
          text: "text-gray-400",
          icon: <Lock className="h-4 w-4" />,
        };
      default:
        return {
          circle: "bg-gray-100 text-gray-500",
          text: "text-gray-500",
          icon: null,
        };
    }
  };

  // Get connector styles based on step completion
  const getConnectorStyles = (fromStep: "upload" | "options") => {
    const nextStep = fromStep === "upload" ? "options" : "description";
    const fromStatus = getStepStatus(fromStep);
    const nextStatus = getStepStatus(nextStep);

    if (
      fromStatus === "complete" &&
      (nextStatus === "complete" || nextStatus === "active")
    ) {
      return "bg-green-500";
    } else if (fromStatus === "complete" || fromStatus === "active") {
      return "bg-blue-400";
    }
    return "bg-gray-200";
  };

  // Handler for step click
  const handleStepClick = (step: "upload" | "options" | "description") => {
    const status = getStepStatus(step);
    if (status !== "locked") {
      setActiveTab(step);
    }
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        {/* Upload Step */}
        <StepItem
          step="upload"
          label="Upload"
          icon={<ImageIcon className="h-5 w-5" />}
          status={getStepStatus("upload")}
          styles={getStepStyles(getStepStatus("upload"))}
          onClick={() => handleStepClick("upload")}
        />

        {/* First Connector */}
        <div className="flex-1 px-4">
          <motion.div
            className={`h-1 rounded-full ${getConnectorStyles("upload")}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isUploadComplete ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Options Step */}
        <StepItem
          step="options"
          label="Features"
          icon={<Code2 className="h-5 w-5" />}
          status={getStepStatus("options")}
          styles={getStepStyles(getStepStatus("options"))}
          onClick={() => handleStepClick("options")}
        />

        {/* Second Connector */}
        <div className="flex-1 px-4">
          <motion.div
            className={`h-1 rounded-full ${getConnectorStyles("options")}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isOptionsComplete && isUploadComplete ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Description Step */}
        <StepItem
          step="description"
          label="Description"
          icon={<FileCode className="h-5 w-5" />}
          status={getStepStatus("description")}
          styles={getStepStyles(getStepStatus("description"))}
          onClick={() => handleStepClick("description")}
        />
      </div>
    </div>
  );
};

// Separate component for each step item
const StepItem = ({
  step,
  label,
  icon,
  status,
  styles,
  onClick,
}: {
  step: string;
  label: string;
  icon: React.ReactNode;
  status: string;
  styles: { circle: string; text: string; icon: React.ReactNode | null };
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex flex-col items-center ${
        status === "locked" ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${styles.circle}`}
        whileHover={status !== "locked" ? { scale: 1.05 } : {}}
        whileTap={status !== "locked" ? { scale: 0.95 } : {}}
      >
        {styles.icon || icon}
      </motion.div>
      <span className={`text-sm ${styles.text}`}>{label}</span>

      {status === "active" && (
        <motion.div
          className="h-1 w-6 bg-blue-500 rounded-full mt-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

export default ProgressSteps;

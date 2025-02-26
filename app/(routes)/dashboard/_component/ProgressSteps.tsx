"use client";
import { ImageIcon, Code2, FileCode } from "lucide-react";

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
  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border">
      <div className="flex justify-between">
        <div
          className={`flex flex-col items-center ${
            activeTab === "upload" ? "text-blue-600" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              activeTab === "upload" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <ImageIcon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Upload</span>
        </div>
        <div className="flex-1 flex items-center px-4">
          <div
            className={`h-1 w-full ${
              activeTab !== "upload" ? "bg-blue-400" : "bg-gray-200"
            }`}
          ></div>
        </div>
        <div
          className={`flex flex-col items-center ${
            activeTab === "options" ? "text-blue-600" : "text-gray-400"
          }`}
          onClick={() => selectedFile && setActiveTab("options")}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              activeTab === "options" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <Code2 className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Features</span>
        </div>
        <div className="flex-1 flex items-center px-4">
          <div
            className={`h-1 w-full ${
              activeTab === "description" ? "bg-blue-400" : "bg-gray-200"
            }`}
          ></div>
        </div>
        <div
          className={`flex flex-col items-center ${
            activeTab === "description" ? "text-blue-600" : "text-gray-400"
          }`}
          onClick={() =>
            selectedFile && selectedOptions.length > 0 && setActiveTab("description")
          }
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              activeTab === "description" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <FileCode className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Description</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;

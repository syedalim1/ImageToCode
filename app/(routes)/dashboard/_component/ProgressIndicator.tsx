"use client";
import { RefreshCw } from "lucide-react";

interface ProgressIndicatorProps {
  isUploading: boolean;
  uploadProgress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isUploading,
  uploadProgress,
}) => {
  if (!isUploading) return null;
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border">
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-spin">
          <RefreshCw className="h-5 w-5 text-blue-500" />
        </div>
        <h3 className="font-medium">Processing your image...</h3>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">This may take a few moments</p>
    </div>
  );
};

export default ProgressIndicator;

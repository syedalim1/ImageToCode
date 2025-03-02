"use client";
import React from "react";
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
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg border border-purple-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-200 rounded-full opacity-30 animate-ping"></div>
          <div className="relative animate-spin">
            <RefreshCw className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <h3 className="font-medium text-indigo-800">
          Processing your image...
        </h3>
      </div>

      <div className="w-full bg-white bg-opacity-70 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300 relative"
          style={{ width: `${uploadProgress}%` }}
        >
          {uploadProgress > 10 && (
            <div className="absolute inset-0 bg-white opacity-20 overflow-hidden">
              <div className="h-full w-20 bg-white blur-md transform -skew-x-12 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-indigo-600">This may take a few moments</p>
        <p className="text-xs font-medium text-indigo-800">
          {Math.round(uploadProgress)}%
        </p>
      </div>

      {uploadProgress > 80 && (
        <div className="mt-4 text-xs text-indigo-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Almost there! Finalizing your design...
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;

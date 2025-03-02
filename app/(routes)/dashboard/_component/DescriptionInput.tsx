"use client";

import React from "react";

interface DescriptionInputProps {
  userDescription: string;
  setUserDescription: (description: string) => void;
  isUploading: boolean;
  preview: string | null;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  userDescription,
  setUserDescription,
  isUploading,
  preview,
}) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg border border-purple-100">
      <h2 className="text-2xl font-bold mb-2 text-indigo-800 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Describe Your Design
      </h2>
      <p className="text-indigo-600 mb-6 pl-8">
        Add details to help the AI understand your design better
      </p>

      <div className="relative">
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
          className={`w-full h-48 p-5 border-2 border-indigo-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-inner text-gray-700 transition-all duration-300 ${
            isUploading ? "bg-gray-100 opacity-70" : ""
          }`}
          disabled={isUploading}
        />

        <div className="absolute bottom-4 right-4 flex items-center">
          <span
            className={`text-xs ${
              userDescription.length > 0 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {userDescription.length} characters
          </span>
          {userDescription.length > 0 && (
            <button
              onClick={() => setUserDescription("")}
              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear text"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-70">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {!isUploading && (
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Landing Page",
            "Dashboard",
            "Mobile App",
            "E-commerce",
            "Blog",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() =>
                setUserDescription(
                  (prevDesc) => prevDesc + (prevDesc ? " " : "") + suggestion
                )
              }
              className="px-3 py-1 bg-white bg-opacity-70 hover:bg-indigo-100 text-indigo-700 text-sm rounded-full border border-indigo-200 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="mt-6 p-4 bg-white bg-opacity-80 rounded-xl border border-indigo-100 shadow-inner">
          <p className="text-sm text-indigo-600 mb-3 font-medium flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Selected Image:
          </p>
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg transform rotate-3"></div>
            <img
              src={preview}
              alt="Preview"
              className="relative w-full h-full object-cover rounded-lg border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionInput;

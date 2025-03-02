import React from "react";

function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-r-blue-500 rounded-full animate-ping"></div>
      </div>
      <p className="mt-6 text-xl font-medium text-purple-800">
        Loading your designs...
      </p>
      <p className="text-gray-500">Fetching your creative masterpieces</p>
    </div>
  );
}

export default LoadingState;

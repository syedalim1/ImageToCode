"use client";

import React, { useState } from "react";
import {
  Copy,
  Code,
  Eye,
  Download,
  Check,
  Moon,
  Sun,
  Terminal,
  FolderTree,
  Maximize,
  Minimize,
  Share2,
  LayoutGrid,
  Settings,
  Cpu,
} from "lucide-react";
import { SandpackThemeProp } from "@codesandbox/sandpack-react";

// Available themes for the editor with enhanced options
const availableThemes: Record<string, SandpackThemeProp> = {
  light: "light",
  dark: "dark",
  
};

interface CodeEditorToolbarProps {
  activeTab: "code" | "preview" | "console" | "explorer" | "settings" | "performance";
  setActiveTab: (tab: "code" | "preview" | "console" | "explorer" | "settings" | "performance") => void;
  isMultiFile: boolean;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleCopyCode: () => void;
  handleShareCode: () => void;
  downloadCode: () => void;
  isCopied: boolean;
}

const CodeEditorToolbar: React.FC<CodeEditorToolbarProps> = ({
  activeTab,
  setActiveTab,
  isMultiFile,
  currentTheme,
  setCurrentTheme,
  isFullscreen,
  toggleFullscreen,
  handleCopyCode,
  handleShareCode,
  downloadCode,
  isCopied,
}) => {
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-indigo-900 text-white p-2.5 border-b border-indigo-500/30">
      <div className="flex space-x-1">
        {isMultiFile && (
          <button
            onClick={() => setActiveTab("explorer")}
            className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeTab === "explorer"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
                : "hover:bg-slate-700/70 hover:scale-105"
            }`}
          >
            <FolderTree size={16} className="mr-1.5" />
            <span>Files</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
            activeTab === "code"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
              : "hover:bg-slate-700/70 hover:scale-105"
          }`}
        >
          <Code size={16} className="mr-1.5" />
          <span>Code</span>
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
            activeTab === "preview"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
              : "hover:bg-slate-700/70 hover:scale-105"
          }`}
        >
          <Eye size={16} className="mr-1.5" />
          <span>Preview</span>
        </button>
        <button
          onClick={() => setActiveTab("console")}
          className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
            activeTab === "console"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
              : "hover:bg-slate-700/70 hover:scale-105"
          }`}
        >
          <Terminal size={16} className="mr-1.5" />
          <span>Console</span>
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
            activeTab === "performance"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
              : "hover:bg-slate-700/70 hover:scale-105"
          }`}
        >
          <Cpu size={16} className="mr-1.5" />
          <span>Performance</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
              : "hover:bg-slate-700/70 hover:scale-105"
          }`}
        >
          <Settings size={16} className="mr-1.5" />
          <span>Settings</span>
        </button>
      </div>

      <div className="flex space-x-2">
        {/* Theme selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="p-1.5 rounded-md hover:bg-slate-700/70 relative group transition-all duration-200 hover:scale-110"
            aria-label="Change theme"
          >
            {currentTheme.includes("dark") || currentTheme.includes("night") || currentTheme.includes("monokai") ? (
              <Moon size={18} className="text-blue-300" />
            ) : (
              <Sun size={18} className="text-yellow-300" />
            )}
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Change theme
            </span>
          </button>

          {showThemeSelector && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                {Object.entries(availableThemes).map(([name, theme]) => (
                  <button
                    key={name}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentTheme === name
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setCurrentTheme(name);
                      setShowThemeSelector(false);
                    }}
                  >
                    {name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Share button */}
        <button
          onClick={handleShareCode}
          className="p-1.5 rounded-md hover:bg-slate-700/70 relative group transition-all duration-200 hover:scale-110"
          aria-label="Share code"
        >
          <Share2 size={18} className="text-blue-300" />
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Share code
          </span>
        </button>

        {/* Copy code button */}
        <button
          onClick={handleCopyCode}
          className="p-1.5 rounded-md hover:bg-slate-700/70 relative group transition-all duration-200 hover:scale-110"
          aria-label="Copy code"
        >
          {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-blue-300" />}
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {isCopied ? "Copied!" : "Copy code"}
          </span>
        </button>

        {/* Download button */}
        <button
          onClick={downloadCode}
          className="p-1.5 rounded-md hover:bg-slate-700/70 relative group transition-all duration-200 hover:scale-110"
          aria-label="Download code"
        >
          <Download size={18} className="text-blue-300" />
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Download {isMultiFile ? "project" : "code"}
          </span>
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-md hover:bg-slate-700/70 relative group transition-all duration-200 hover:scale-110"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} className="text-blue-300" /> : <Maximize size={18} className="text-blue-300" />}
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CodeEditorToolbar;

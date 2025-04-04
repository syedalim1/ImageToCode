"use client";

import React, { useState } from "react";
import { Settings, FileType, LayoutGrid, Monitor, Type, Zap, Save, RotateCcw } from "lucide-react";

interface EditorSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  wordWrap: boolean;
  setWordWrap: (wrap: boolean) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (show: boolean) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
  autoSave: boolean;
  setAutoSave: (autoSave: boolean) => void;
  formatOnSave: boolean;
  setFormatOnSave: (format: boolean) => void;
}

const EditorSettings: React.FC<Partial<EditorSettingsProps>> = ({
  fontSize = 14,
  setFontSize = () => {},
  lineHeight = 1.5,
  setLineHeight = () => {},
  wordWrap = true,
  setWordWrap = () => {},
  showLineNumbers = true,
  setShowLineNumbers = () => {},
  tabSize = 2,
  setTabSize = () => {},
  theme = "light",
  setTheme = () => {},
  autoSave = true,
  setAutoSave = () => {},
  formatOnSave = true,
  setFormatOnSave = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<"appearance" | "editor" | "behavior">("appearance");
  
  // Setting presets for quick configuration
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "compact":
        setFontSize(12);
        setLineHeight(1.3);
        setWordWrap(true);
        break;
      case "comfortable":
        setFontSize(16);
        setLineHeight(1.8);
        setWordWrap(true);
        break;
      case "presentation":
        setFontSize(18);
        setLineHeight(2);
        setWordWrap(true);
        break;
      case "default":
      default:
        setFontSize(14);
        setLineHeight(1.5);
        setWordWrap(true);
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-auto rounded-b-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Settings className="mr-2" />
          Editor Settings
        </h2>
        <p className="text-sm opacity-80 mt-1">
          Customize your coding experience
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "appearance"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <Monitor className="inline-block w-4 h-4 mr-1.5" />
          Appearance
        </button>
        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "editor"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <Type className="inline-block w-4 h-4 mr-1.5" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab("behavior")}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "behavior"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <Zap className="inline-block w-4 h-4 mr-1.5" />
          Behavior
        </button>
      </div>

      {/* Settings content - Appearance */}
      <div className="p-4 flex-grow overflow-auto">
        {activeTab === "appearance" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-3 border rounded-lg text-center ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <div className="h-12 mb-2 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-800">Light</span>
                  </div>
                  <span className="text-xs">Light Theme</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-3 border rounded-lg text-center ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <div className="h-12 mb-2 bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-200">Dark</span>
                  </div>
                  <span className="text-xs">Dark Theme</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Size</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">12px</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mx-3 accent-blue-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">24px</span>
              </div>
              <div className="text-center mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Line Height</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">1.2</span>
                <input
                  type="range"
                  min="1.2"
                  max="2.2"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mx-3 accent-blue-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">2.2</span>
              </div>
              <div className="text-center mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{lineHeight}x</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Presets</h3>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => applyPreset("compact")}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Compact
                </button>
                <button
                  onClick={() => applyPreset("default")}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => applyPreset("comfortable")}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Comfortable
                </button>
                <button
                  onClick={() => applyPreset("presentation")}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Presentation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editor settings */}
        {activeTab === "editor" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Word Wrap</span>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Wrap long lines to fit the editor width
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={() => setWordWrap(!wordWrap)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Line Numbers</span>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Show line numbers in the editor
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={() => setShowLineNumbers(!showLineNumbers)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tab Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {[2, 4, 6, 8].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTabSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      tabSize === size
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {size} spaces
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Keyboard Shortcuts</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Format document</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-mono">
                      Shift+Alt+F
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Find</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-mono">
                      Ctrl+F
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toggle comment</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-mono">
                      Ctrl+/
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toggle word wrap</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-mono">
                      Alt+Z
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Behavior settings */}
        {activeTab === "behavior" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Save</span>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Automatically save changes
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Format on Save</span>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  Automatically format code when saving
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formatOnSave}
                  onChange={() => setFormatOnSave(!formatOnSave)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Auto Formatting</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <input
                    id="prettier"
                    type="checkbox"
                    checked={true}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="prettier" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Use Prettier
                  </label>
                </div>
                <div className="pl-6 text-xs text-gray-500 dark:text-gray-400">
                  <p>Current config: Default</p>
                  <div className="mt-2 flex gap-2">
                    <button className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                      <FileType className="w-3 h-3 mr-1" />
                      View Config
                    </button>
                    <button className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                      <LayoutGrid className="w-3 h-3 mr-1" />
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button className="inline-flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm font-medium">
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Settings
                </button>
                <button className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm font-medium">
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSettings;

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import {
  Copy,
  Code,
  Eye,
  Download,
  Check,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react";

interface EnhancedCodeEditorProps {
  code: string;
  onCodeChange?: (code: string | { content: string }) => void;
  isLoading?: boolean;
}

// Custom hook to capture code changes
function CodeEditorWithCapture({
  setCode,
  readOnly = false,
}: {
  setCode: (code: string | { content: string }) => void;
  readOnly?: boolean;
}) {
  const { code, updateCode } = useActiveCode();

  const handleCodeUpdate = (newCode: string | { content: string }) => {
    if (typeof newCode === "string") {
      setCode(newCode);
    } else if (
      typeof newCode === "object" &&
      newCode !== null &&
      "content" in newCode
    ) {
      setCode(newCode.content);
    }
  };

  // Update the parent component's state when code changes
  React.useEffect(() => {
    handleCodeUpdate(code);
  }, [code, setCode]);

  return (
    <SandpackCodeEditor
      style={{
        minWidth: "100%",
        height: "600px",
      }}
      showLineNumbers
      showTabs
      readOnly={readOnly}
    />
  );
}
interface CodeContent {
  content: string;
}
const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  code,
  onCodeChange,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const [currentCode, setCurrentCode] = useState(code);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let processedCode = code;

    // Try to parse the code if it's a JSON string containing AI response
    try {
      // Check if the code starts with a JSON object pattern
      if (
        typeof code === "string" &&
        code.trim().startsWith("{") &&
        code.includes('"message"')
      ) {
        const parsedData = JSON.parse(code);

        // Check if this is an AI response with content
        if (
          parsedData.choices &&
          parsedData.choices[0] &&
          parsedData.choices[0].message &&
          parsedData.choices[0].message.content
        ) {
          // Extract the actual code from the AI response
          processedCode = parsedData.choices[0].message.content;
        }
      }
    } catch (e) {
      console.error("Failed to parse code as JSON:", e);
      // If parsing fails, continue with the original code
    }

    // Remove markdown code blocks if present
    if (typeof processedCode === "string") {
      processedCode = processedCode
        .replace(/```javascript|```typescript|```typescrpt|```/g, "")
        .trim();
    }

    // Set the processed code
    setCurrentCode(processedCode);
  }, [code]);

  const handleCodeChange = (code: string | CodeContent) => {
    let codeContent: string;

    if (typeof code === "object" && code !== null && "content" in code) {
      codeContent = code.content;
      setCurrentCode(codeContent);
    } else if (typeof code === "string") {
      codeContent = code;
      setCurrentCode(codeContent);
    } else {
      // Fallback for unexpected types
      codeContent = String(code);
      setCurrentCode(codeContent);
    }

    if (onCodeChange) {
      onCodeChange(code);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([currentCode], { type: "text/javascript" });
    element.href = URL.createObjectURL(file);
    element.download = "App.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${
        isFullscreen ? "fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 flex flex-wrap justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-all ${
              activeTab === "code"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Code className="h-4 w-4 mr-1.5" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-all ${
              activeTab === "preview"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Preview
          </button>
        </div>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <motion.button
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCopied}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-1.5 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1.5" />
                <span>Copy</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={downloadCode}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span>Download</span>
          </motion.button>

          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-10 w-10 text-blue-600" />
            </motion.div>
            <p className="ml-3 text-lg font-medium text-blue-800 dark:text-blue-300">
              Processing your code...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sandpack Editor */}
      <div className="relative">
        {/* Display error message if code is invalid */}
        {currentCode && currentCode.trim().startsWith("{") && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The received data appears to be in JSON format instead of
                  code. Attempting to extract code content.
                </p>
              </div>
            </div>
          </div>
        )}

        <SandpackProvider
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            classes: {
              "sp-wrapper":
                "custom-wrapper rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
              "sp-layout": "custom-layout",
              "sp-tab-button": "custom-tab",
            },
          }}
          customSetup={{
            dependencies: {
              "react-markdown": "latest",
              "lucide-react": "latest",
            },
          }}
          files={{
            "/App.js": currentCode.startsWith("{")
              ? "// Error: Invalid code format received\n// Please regenerate the code"
              : currentCode,
          }}
          theme="auto"
          template="react"
        >
          <SandpackLayout
            style={{
              width: "100%",
              height: activeTab === "preview" ? "700px" : "800px",
              borderRadius: "0",
            }}
          >
            {activeTab === "code" && (
              <CodeEditorWithCapture
                setCode={(newCode) => {
                  if (typeof newCode === "string") {
                    handleCodeChange(newCode);
                  } else if (
                    typeof newCode === "object" &&
                    newCode !== null &&
                    "content" in newCode
                  ) {
                    handleCodeChange(newCode.content);
                  }
                }}
                readOnly={false}
              />
            )}
            {activeTab === "preview" && (
              <SandpackPreview
                style={{
                  height: "100%",
                  minWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                }}
                showNavigator
                showRefreshButton
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </motion.div>
  );
};

export default EnhancedCodeEditor;

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useActiveCode,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackThemeProp,
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
  Terminal,
  AlertTriangle,
  FolderTree,
  Maximize,
  Minimize,
  Share2,
} from "lucide-react";
import ClientOnly from "./ClientOnly";
import AILookup from "@/data/AILookup";
import { file } from "jszip";

interface EnhancedCodeEditorProps {
  code: string;
  onCodeChange?: (code: string | { content: string }) => void;
  isLoading?: boolean;
}

interface SandpackProject {
  projectTitle?: string;
  explanation?: string;
  files: Record<string, { code: string }>;
  generatedFiles?: string[];
}

// Custom hook to capture code changes
function CodeEditorWithCapture({
  setCode,
  readOnly = false,
  style,
}: {
  setCode: (code: string) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}) {
  const { code, updateCode } = useActiveCode();

  // Update the parent component's state when code changes
  useEffect(() => {
    setCode(code);
  }, [code, setCode]);

  return (
    <SandpackCodeEditor
      style={{
        minWidth: "100%",
        height: "600px",
        ...style,
      }}
      showLineNumbers
      showTabs
      readOnly={readOnly}
    />
  );
}

// Function to ensure code is a valid React component
const ensureValidReactComponent = (code: string): string => {
  // If code doesn't contain export default or export function, wrap it
  if (
    !code.includes("export default") &&
    !code.includes("export function") &&
    !code.includes("export const")
  ) {
    // Check if code looks like JSX
    if (code.includes("<") && code.includes("/>")) {
      return `import React from 'react';\n\nexport default function App() {\n  return (\n    ${code}\n  );\n}`;
    } else {
      // Just return the code as a snippet
      return `// Code snippet:\n${code}`;
    }
  }
  return code;
};

// Available themes for the editor
const availableThemes: Record<string, SandpackThemeProp> = {
  light: "light",
  dark: "dark",
};

const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  code,
  onCodeChange,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    "code" | "preview" | "console" | "explorer"
  >("preview");
  const [currentCode, setCurrentCode] = useState(code);
  const [processedCode, setProcessedCode] = useState("");

  const [projectData, setProjectData] = useState<SandpackProject | null>(null);
  const [entryFile, setEntryFile] = useState<string>("/App.js");
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [files, setFiles] = useState<Record<string, { code: string }> | null>(
    null
  );

  useEffect(() => {
    let processedCode = code;
    setHasError(false);

    try {
      // Check if code is actually a JSON string representing multiple files
      const parsedFiles = JSON.parse(code);
      if (typeof parsedFiles === "object" && parsedFiles !== null) {
        // It's a multi-file project
        setIsMultiFile(true);
        setFiles(parsedFiles);

        // Determine the entry file (first file with App.js, index.js, or first in the list)
        const fileKeys = Object.keys(parsedFiles);
        const appFile =
          fileKeys.find((f) => f.includes("App.js")) ||
          fileKeys.find((f) => f.includes("index.js")) ||
          fileKeys[0];
        setEntryFile(appFile);

        // If there's project data, set it
        if (parsedFiles.projectInfo) {
          setProjectData({
            projectTitle: parsedFiles.projectInfo.title || "React Project",
            explanation: parsedFiles.projectInfo.description || "",
            files: parsedFiles,
            generatedFiles: fileKeys,
          });
        }
      } else {
        // It's a single file
        setIsMultiFile(false);
        setFiles({ "/App.js": { code: processedCode } });
      }
    } catch (e) {
      // Not JSON, handle as a single file
      setIsMultiFile(false);

      // Set the processed code for single-file mode
      setCurrentCode(processedCode);

      // Ensure the code is a valid React component for the preview
      try {
        const validReactCode = ensureValidReactComponent(processedCode);
        setProcessedCode(validReactCode);
        setFiles({ "/App.js": { code: validReactCode } });
      } catch (e) {
        console.error("Error processing code:", e);
        setHasError(true);
        setProcessedCode(
          `// Error: Invalid code format\n// ${
            e instanceof Error ? e.message : String(e)
          }`
        );
        setFiles({ "/App.js": { code: processedCode } });
      }
    }
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Fallback code for when the preview has errors

  console.log(files, "files");

  return (
    <ClientOnly>
      <div className="my-4">
        {/* Project title and explanation */}
        {isMultiFile && projectData?.projectTitle && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {projectData.projectTitle}
            </h2>
            {projectData.explanation && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {projectData.explanation}
              </p>
            )}
          </div>
        )}

        {/* Editor container */}
        <div
          className={`rounded-xl overflow-hidden shadow-lg ${
            isFullscreen
              ? "fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900"
              : ""
          }`}
        >
          {/* Tabs navigation */}
          <div className="flex items-center justify-between bg-slate-800 text-white p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  activeTab === "code" ? "bg-blue-600" : "hover:bg-slate-700"
                }`}
              >
                <Code size={16} className="mr-1.5" />
                <span>Code</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  activeTab === "preview" ? "bg-blue-600" : "hover:bg-slate-700"
                }`}
              >
                <Eye size={16} className="mr-1.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center px-3 py-1.5 rounded-md ${
                  activeTab === "console" ? "bg-blue-600" : "hover:bg-slate-700"
                }`}
              >
                <Terminal size={16} className="mr-1.5" />
                <span>Console</span>
              </button>
              {isMultiFile && (
                <button
                  onClick={() => setActiveTab("explorer")}
                  className={`flex items-center px-3 py-1.5 rounded-md ${
                    activeTab === "explorer"
                      ? "bg-blue-600"
                      : "hover:bg-slate-700"
                  }`}
                >
                  <FolderTree size={16} className="mr-1.5" />
                  <span>Files</span>
                </button>
              )}
            </div>

            {/* Theme toggle and fullscreen buttons could go here */}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-900">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Loading code...
              </span>
            </div>
          )}

          {/* Error indicator */}
          {hasError && !isLoading && (
            <div className="flex items-center bg-red-50 text-red-600 p-2 border-b border-red-200">
              <AlertTriangle size={16} className="mr-2" />
              <span className="text-sm font-medium">
                There are errors in the code that may affect rendering
              </span>
            </div>
          )}

          {/* Sandpack editor */}
          <AnimatePresence mode="wait">
            <motion.div
              key={
                activeTab + (isMultiFile ? "multi" : "single") + currentTheme
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full bg-white"
            >
              {files && (
                <SandpackProvider
                  theme={availableThemes[currentTheme]}
                  template="react"
                  files={files}
                  customSetup={{
                    dependencies: {
                      ...AILookup.DEPENDANCY,
                    },
                    entry: isMultiFile ? entryFile : "/App.js",
                  }}
                >
                  <SandpackLayout>
                    {activeTab === "explorer" && isMultiFile && (
                      <SandpackFileExplorer style={{ height: "600px" }} />
                    )}
                    {activeTab === "code" &&
                      (isMultiFile ? (
                        <SandpackCodeEditor
                          showTabs
                          showLineNumbers
                          showInlineErrors
                          wrapContent
                          closableTabs
                          style={{ height: "600px" }}
                        />
                      ) : (
                        <CodeEditorWithCapture
                          setCode={handleCodeChange}
                          style={{ height: "600px" }}
                        />
                      ))}
                    {activeTab === "preview" && (
                      <SandpackPreview
                        showOpenInCodeSandbox
                        showRefreshButton
                        style={{ height: "600px" }}
                      />
                    )}
                    {activeTab === "console" && (
                      <SandpackConsole style={{ height: "600px" }} />
                    )}
                  </SandpackLayout>
                </SandpackProvider>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ClientOnly>
  );
};

export default EnhancedCodeEditor;

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
} from "lucide-react";
import ClientOnly from "./ClientOnly";

interface EnhancedCodeEditorProps {
  code: string;
  onCodeChange?: (code: string | { content: string }) => void;
  isLoading?: boolean;
}

interface CodeContent {
  content: string;
}

// Custom hook to capture code changes
function CodeEditorWithCapture({
  setCode,
  readOnly = false,
}: {
  setCode: (code: string) => void;
  readOnly?: boolean;
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
      }}
      showLineNumbers
      showTabs
      readOnly={readOnly}
    />
  );
}

// Function to ensure code is a valid React component
const ensureValidReactComponent = (code: string): string => {
  // If code doesn't contain export default or export const App, wrap it
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

const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  code,
  onCodeChange,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "console">(
    "preview"
  );
  const [currentCode, setCurrentCode] = useState(code);
  const [processedCode, setProcessedCode] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let processedCode = code;
    setHasError(false);

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
        .replace(
          /```javascript|```typescript|```typescrpt|```jsx|```tsx|```/g,
          ""
        )
        .trim();
    }

    // Set the processed code
    setCurrentCode(processedCode);

    // Ensure the code is a valid React component for the preview
    try {
      const validReactCode = ensureValidReactComponent(processedCode);
      setProcessedCode(validReactCode);
    } catch (e) {
      console.error("Error processing code:", e);
      setHasError(true);
      setProcessedCode(
        `// Error: Invalid code format\n// ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    
    if (onCodeChange) {
      // Always pass the code as a string to the parent component
      onCodeChange(newCode);
    }
  };

  // Clipboard operations should only run on client
  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Download operation should only run on client
  const downloadCode = () => {
    if (typeof document !== 'undefined') {
      const element = document.createElement("a");
      const file = new Blob([currentCode], { type: "text/javascript" });
      element.href = URL.createObjectURL(file);
      element.download = "App.js";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fallback code for when the preview has errors
  const fallbackCode = `
// This is a fallback component shown when there are errors in the code
import React from 'react';

export default function ErrorFallback() {
  return (
    <div style={{ 
      padding: '20px', 
      color: '#e53e3e', 
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ marginBottom: '16px' }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>Preview Error</h2>
      <p style={{ marginBottom: '16px', color: '#718096' }}>
        There was an error rendering this component.
      </p>
      <p style={{ fontSize: '14px', color: '#718096' }}>
        Check the console tab for more details.
      </p>
    </div>
  );
}
`;

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
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-3 flex flex-wrap justify-between items-center">
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
          <button
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-all ${
              activeTab === "console"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Terminal className="h-4 w-4 mr-1.5" />
            Console
          </button>
        </div>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <ClientOnly>
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
          </ClientOnly>

          <ClientOnly>
            <motion.button
              onClick={downloadCode}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span>Download</span>
            </motion.button>
          </ClientOnly>

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

      {/* Warning for JSON data */}
      {currentCode && currentCode.trim().startsWith("{") && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                The received data appears to be in JSON format instead of code.
                Attempting to extract code content.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sandpack Editor - Wrapped in ClientOnly to prevent hydration issues */}
      <ClientOnly>
        <div className="relative">
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
                "react": "^18.0.0",
                "react-dom": "^18.0.0",
                "react-markdown": "latest",
                "lucide-react": "latest",
              },
              entry: "/index.js",
            }}
            files={{
              "/App.js": hasError ? fallbackCode : processedCode,
              "/index.js": `
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error("Error rendering component:", error);
  root.render(
    <div style={{ 
      padding: '20px', 
      color: 'red', 
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center' 
    }}>
      <h2>Error Rendering Component</h2>
      <p>{error.message}</p>
    </div>
  );
}
`,
            }}
            theme={isDarkMode ? "dark" : "light"}
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
                  setCode={handleCodeChange}
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
              {activeTab === "console" && (
                <SandpackConsole
                  style={{
                    height: "100%",
                    minWidth: "100%",
                  }}
                />
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </ClientOnly>
    </motion.div>
  );
};

export default EnhancedCodeEditor;

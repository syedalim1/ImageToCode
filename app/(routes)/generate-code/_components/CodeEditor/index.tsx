"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
  SandpackFiles,
  SandpackThemeProp,
} from "@codesandbox/sandpack-react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import AILookup from "@/data/AILookup";
import ClientOnly from "../ClientOnly";

// Import our custom components
import CodeEditorToolbar from "./CodeEditorToolbar";
import EnhancedFileExplorer from "./EnhancedFileExplorer";
import CodeEditorWithCapture from "./CodeEditorWithCapture";
import PerformanceAnalyzer from "./PerformanceAnalyzer";
import EditorSettings from "./EditorSettings";

// Available themes for the editor
const availableThemes: Record<string, SandpackThemeProp> = {
  light: "light",
  dark: "dark",

};

interface EnhancedCodeEditorProps {
  code: string;
  onCodeChange?: (code: string | { content: string }) => void;
  isLoading?: boolean;
}

interface SandpackProject {
  projectTitle?: string;
  explanation?: string;
  files: Record<string, { code: string }>;

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

// Convert the JSON project format to Sandpack files format
const convertToSandpackFiles = (files: Record<string, { code: string }>): SandpackFiles => {
  const sandpackFiles: SandpackFiles = {};

  Object.entries(files).forEach(([path, { code }]) => {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    sandpackFiles[normalizedPath] = { code };
  });

  return sandpackFiles;
};


const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  code,
  onCodeChange,
  isLoading = false,
}) => {
  // Core state
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "console" | "explorer" | "settings" | "performance">("preview");
  const [currentCode, setCurrentCode] = useState(code);
  const [processedCode, setProcessedCode] = useState("");
  const [sandpackFiles, setSandpackFiles] = useState<SandpackFiles | null>(null);
  const [projectData, setProjectData] = useState<SandpackProject | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Editor settings
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [tabSize, setTabSize] = useState(2);
  const [autoSave, setAutoSave] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);

  // Process code on initial load and when code prop changes
  useEffect(() => {
    let processedCode = code;
    setHasError(false);
    setIsMultiFile(false);

    // Try to parse the code if it's a JSON string
    try {
      // Check if the code is a JSON string
      if (typeof code === "string" && code.trim().startsWith("{")) {
        const parsedData = JSON.parse(code);

        // Check if this is a Sandpack project format
        if (parsedData.files && typeof parsedData.files === "object") {
          setProjectData(parsedData);
          const files = convertToSandpackFiles(parsedData.files);
          setSandpackFiles(files);
          setIsMultiFile(true);
          return; // Exit early since we've handled the multi-file case
        }

        // Check if this is an AI response with content
        if (
          parsedData.choices &&
          parsedData.choices[0] &&
          parsedData.choices[0].message &&
          parsedData.choices[0].message.content
        ) {
          // Extract the actual code from the AI response
          processedCode = parsedData.choices[0].message.content;

          // Check if the extracted content might be a JSON project
          try {
            if (processedCode.includes('"files"') && processedCode.includes('"code"')) {
              // Try to find JSON within markdown code blocks
              const jsonMatch = processedCode.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
              if (jsonMatch && jsonMatch[1]) {
                const projectJson = JSON.parse(jsonMatch[1]);
                if (projectJson.files && typeof projectJson.files === "object") {
                  setProjectData(projectJson);
                  const files = convertToSandpackFiles(projectJson.files);
                  setSandpackFiles(files);
                  setIsMultiFile(true);
                  return; // Exit early
                }
              }
            }
          } catch (innerError) {
            // If nested parsing fails, continue with the extracted content
            console.error("Failed to parse nested JSON:", innerError);
          }
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

    // Set the processed code for single-file mode
    setCurrentCode(processedCode);

    // Ensure the code is a valid React component for the preview
    try {
      const validReactCode = ensureValidReactComponent(processedCode);
      setProcessedCode(validReactCode);
    } catch (e) {
      console.error("Error processing code:", e);
      setHasError(true);
      setProcessedCode(
        `// Error: Invalid code format\n// ${e instanceof Error ? e.message : String(e)
        }`
      );
    }
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Handle copying code
  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      if (isMultiFile && projectData) {
        // For multi-file, stringify the project JSON
        navigator.clipboard.writeText(JSON.stringify(projectData, null, 2));
      } else {
        // For single file
        navigator.clipboard.writeText(currentCode);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Share code as URL
  const handleShareCode = () => {
    if (typeof window !== "undefined") {
      try {
        const codeToShare = isMultiFile && projectData
          ? JSON.stringify(projectData)
          : currentCode;

        const encodedCode = encodeURIComponent(codeToShare);
        const shareUrl = `${window.location.origin}/shared-code?code=${encodedCode}`;

        navigator.clipboard.writeText(shareUrl);
        alert("Share URL copied to clipboard!");
      } catch (error) {
        console.error("Error sharing code:", error);
        alert("Failed to generate share URL");
      }
    }
  };

  // Download operation should only run on client
  const downloadCode = () => {
    if (typeof document !== "undefined") {
      if (isMultiFile && projectData) {
        // For multi-file projects, create a zip file
        import('jszip').then((JSZip) => {
          const { default: JSZipModule } = JSZip;
          const zip = new JSZipModule();

          // Add all files to the zip
          Object.entries(projectData.files).forEach(([path, { code }]) => {
            const filePath = path.startsWith('/') ? path.substring(1) : path;
            zip.file(filePath, code);
          });

          // Add README with project information
          let readmeContent = `# ${projectData.projectTitle || 'Generated Project'}\n\n`;
          if (projectData.explanation) {
            readmeContent += `${projectData.explanation}\n\n`;
          }
          readmeContent += `## Files\n${Object.keys(projectData.files).map(f => `- ${f}`).join('\n')}`;
          zip.file('README.md', readmeContent);

          // Generate the zip file
          zip.generateAsync({ type: 'blob' }).then((blob) => {
            const element = document.createElement('a');
            element.href = URL.createObjectURL(blob);
            element.download = `${projectData.projectTitle || 'generated-project'}.zip`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          });
        }).catch(err => {
          console.error('Error creating zip file:', err);
          alert('Failed to download project. JSZip module could not be loaded.');
        });
      } else {
        // For single files
        const element = document.createElement("a");
        const file = new Blob([currentCode], { type: "text/javascript" });
        element.href = URL.createObjectURL(file);
        element.download = "App.js";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
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
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <h2 style={{ marginTop: '20px', fontWeight: 'bold' }}>Code Error</h2>
      <p style={{ marginTop: '10px' }}>
        There are errors in the code that prevent it from rendering correctly.
      </p>
      <p style={{ marginTop: '5px', fontSize: '0.9em' }}>
        Check the console tab for more details.
      </p>
    </div>
  );
}`;

  return (
    <ClientOnly>
      <div className="my-4">
        {/* Project title and explanation with improved styling */}
        {isMultiFile && projectData?.projectTitle && (
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
              {projectData.projectTitle}
            </h2>
            {projectData.explanation && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {projectData.explanation}
              </p>
            )}
          </div>
        )}

        {/* Editor container with responsive design */}
        <div
          className={`rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 
            ${isFullscreen
              ? 'fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900'
              : 'transition-all duration-300 hover:shadow-2xl'}`
          }
        >
          {/* Toolbar */}
          <CodeEditorToolbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMultiFile={isMultiFile}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            handleCopyCode={handleCopyCode}
            handleShareCode={handleShareCode}
            downloadCode={downloadCode}
            isCopied={isCopied}
          />

          {/* Loading indicator with improved animation */}
          {isLoading && (
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-4">
                <RefreshCw className="animate-spin text-blue-500" size={24} />
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Loading code...
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Preparing your coding experience
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error indicator with improved styling */}
          {hasError && !isLoading && (
            <div className="flex items-center bg-red-50 text-red-600 p-3 border-b border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium">
                  There are errors in the code that may affect rendering
                </span>
                <p className="text-xs mt-0.5 text-red-500 dark:text-red-300">
                  Check the console tab for more details
                </p>
              </div>
            </div>
          )}

          {/* Sandpack editor with responsive design */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isMultiFile ? "multi" : "single") + currentTheme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-[1000px] overflow-hidden"
              style={{
                maxHeight: isFullscreen ? 'calc(100vh - 120px)' : '1000px',
                height: isFullscreen ? 'calc(100vh - 120px)' : '1000px'
              }}
            >
              {/* Performance Analysis Tab */}
              {activeTab === "performance" && (
                <PerformanceAnalyzer code={currentCode} />
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <EditorSettings
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  lineHeight={lineHeight}
                  setLineHeight={setLineHeight}
                  wordWrap={wordWrap}
                  setWordWrap={setWordWrap}
                  showLineNumbers={showLineNumbers}
                  setShowLineNumbers={setShowLineNumbers}
                  tabSize={tabSize}
                  setTabSize={setTabSize}
                  theme={currentTheme}
                  setTheme={setCurrentTheme}
                  autoSave={autoSave}
                  setAutoSave={setAutoSave}
                  formatOnSave={formatOnSave}
                  setFormatOnSave={setFormatOnSave}
                />
              )}

              {/* Multi-file Sandpack setup */}
              {isMultiFile && sandpackFiles && activeTab !== "performance" && activeTab !== "settings" && (
                <SandpackProvider
                  theme={availableThemes[currentTheme]}
                  template="react"
                  files={sandpackFiles}
                  customSetup={{
                    dependencies: {
                      ...AILookup.DEPENDANCY
                    },

                  }}
                >
                  <SandpackLayout className="h-full">
                    {activeTab === "explorer" && (
                      <div className="h-full" style={{ width: '250px' }}>
                        <EnhancedFileExplorer showFileInfo />
                      </div>
                    )}

                    {activeTab === "code" && (
                      <CodeEditorWithCapture
                        setCode={handleCodeChange}
                        fontSize={fontSize}
                        lineHeight={lineHeight}
                        showLineNumbers={showLineNumbers}
                        wrapContent={wordWrap}
                        style={{ height: "100%", overflow: "auto" }}
                      />
                    )}

                    {activeTab === "preview" && (
                      <SandpackPreview
                        showOpenInCodeSandbox
                        showRefreshButton
                        style={{ height: "100%", overflow: "auto" }}
                      />
                    )}

                    {activeTab === "console" && (
                      <SandpackConsole className="h-full" />
                    )}
                  </SandpackLayout>
                </SandpackProvider>
              )}

              {/* Single file Sandpack setup */}
              {(!isMultiFile || !sandpackFiles) && activeTab !== "performance" && activeTab !== "settings" && (
                <SandpackProvider
                  theme={availableThemes[currentTheme]}
                  template="react"
                  files={{
                    "/App.js": {
                      code: hasError ? fallbackCode : processedCode,
                    },
                  }}
                  customSetup={{
                    dependencies: {
                      ...AILookup.DEPENDANCY
                    }
                  }}
                >
                  <SandpackLayout className="h-full">
                    {activeTab === "code" && (
                      <CodeEditorWithCapture
                        setCode={handleCodeChange}
                        fontSize={fontSize}
                        lineHeight={lineHeight}
                        showLineNumbers={showLineNumbers}
                        wrapContent={wordWrap}
                        style={{ height: "100%", overflow: "auto" }}
                      />
                    )}

                    {activeTab === "preview" && (
                      <SandpackPreview
                        showOpenInCodeSandbox
                        showRefreshButton
                        style={{ height: "100%", overflow: "auto" }}
                      />
                    )}

                    {activeTab === "console" && (
                      <SandpackConsole className="h-full" />
                    )}
                  </SandpackLayout>
                </SandpackProvider>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Animated decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
        </div>

        {/* Additional features info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Code Explanation</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Analyze code structure, complexity, and patterns in the Performance tab
            </p>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Export Options</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Export your code in multiple formats: JS, TS, JSX, TSX, HTML, or as a project
            </p>
          </div>

          <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800">
            <h3 className="text-sm font-medium text-pink-700 dark:text-pink-300">Responsive Preview</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Preview your code in different screen sizes and responsive breakpoints
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default EnhancedCodeEditor;

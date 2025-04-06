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
  SandpackFiles,
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
      return `import React from 'react';\nimport './index.css';\n\nexport default function App() {\n  return (\n    ${code}\n  );\n}`;
    } else {
      // Just return the code as a snippet
      return `// Code snippet:\n${code}`;
    }
  } else if (!code.includes("import './index.css'") && !code.includes("import './index.css';")) {
    // If it has export but no CSS import, add the CSS import
    return `import './index.css';\n${code}`;
  }
  return code;
};

// Convert the JSON project format to Sandpack files format
const convertToSandpackFiles = (
  files: Record<string, { code: string }>
): SandpackFiles => {
  const sandpackFiles: SandpackFiles = {};

  Object.entries(files).forEach(([path, { code }]) => {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    sandpackFiles[normalizedPath] = { code };
  });

  return sandpackFiles;
};

// Function to determine the entry file for the Sandpack preview
const determineEntryFile = (files: SandpackFiles): string => {
  // Priority order for entry files
  const possibleEntries = [
    "/src/main.jsx",
    "/src/main.tsx",
    "/src/index.jsx",
    "/src/index.tsx",
    "/src/App.jsx",
    "/src/App.tsx",
    "/src/App.js",
    "/src/App.ts",
    "/index.jsx",
    "/index.js",
  ];

  for (const entry of possibleEntries) {
    if (files[entry]) {
      return entry;
    }
  }

  // If no standard entry is found, return the first .jsx or .js file found
  const firstJsxFile = Object.keys(files).find((file) => file.endsWith(".jsx"));
  if (firstJsxFile) return firstJsxFile;

  const firstJsFile = Object.keys(files).find((file) => file.endsWith(".js"));
  if (firstJsFile) return firstJsFile;

  // Default to the first file as a last resort
  return Object.keys(files)[0];
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
  const [sandpackFiles, setSandpackFiles] = useState<SandpackFiles | null>(
    null
  );
  const [projectData, setProjectData] = useState<SandpackProject | null>(null);
  const [entryFile, setEntryFile] = useState<string>("/src/index.jsx");
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

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
          const entry = determineEntryFile(files);
          setEntryFile(entry);
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
            if (
              processedCode.includes('"files"') &&
              processedCode.includes('"code"')
            ) {
              // Try to find JSON within markdown code blocks
              const jsonMatch = processedCode.match(
                /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
              );
              if (jsonMatch && jsonMatch[1]) {
                const projectJson = JSON.parse(jsonMatch[1]);
                if (
                  projectJson.files &&
                  typeof projectJson.files === "object"
                ) {
                  setProjectData(projectJson);
                  const files = convertToSandpackFiles(projectJson.files);
                  setSandpackFiles(files);
                  const entry = determineEntryFile(files);
                  setEntryFile(entry);
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
        const codeToShare =
          isMultiFile && projectData
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
        import("jszip")
          .then((JSZip) => {
            const { default: JSZipModule } = JSZip;
            const zip = new JSZipModule();

            // Add all files to the zip
            Object.entries(projectData.files).forEach(([path, { code }]) => {
              const filePath = path.startsWith("/") ? path.substring(1) : path;
              zip.file(filePath, code);
            });

            // Add README with project information
            let readmeContent = `# ${projectData.projectTitle || "Generated Project"
              }\n\n`;
            if (projectData.explanation) {
              readmeContent += `${projectData.explanation}\n\n`;
            }
            readmeContent += `## Files\n${Object.keys(projectData.files)
              .map((f) => `- ${f}`)
              .join("\n")}`;
            zip.file("README.md", readmeContent);

            // Generate the zip file
            zip.generateAsync({ type: "blob" }).then((blob) => {
              const element = document.createElement("a");
              element.href = URL.createObjectURL(blob);
              element.download = `${projectData.projectTitle || "generated-project"
                }.zip`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            });
          })
          .catch((err) => {
            console.error("Error creating zip file:", err);
            alert(
              "Failed to download project. JSZip module could not be loaded."
            );
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
          className={`rounded-xl overflow-hidden shadow-lg ${isFullscreen
            ? "fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900"
            : ""
            }`}
        >
          {/* Tabs navigation */}
          <div className="flex items-center justify-between bg-slate-800 text-white p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center px-3 py-1.5 rounded-md ${activeTab === "code" ? "bg-blue-600" : "hover:bg-slate-700"
                  }`}
              >
                <Code size={16} className="mr-1.5" />
                <span>Code</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center px-3 py-1.5 rounded-md ${activeTab === "preview" ? "bg-blue-600" : "hover:bg-slate-700"
                  }`}
              >
                <Eye size={16} className="mr-1.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`flex items-center px-3 py-1.5 rounded-md ${activeTab === "console" ? "bg-blue-600" : "hover:bg-slate-700"
                  }`}
              >
                <Terminal size={16} className="mr-1.5" />
                <span>Console</span>
              </button>
              {isMultiFile && (
                <button
                  onClick={() => setActiveTab("explorer")}
                  className={`flex items-center px-3 py-1.5 rounded-md ${activeTab === "explorer"
                    ? "bg-blue-600"
                    : "hover:bg-slate-700"
                    }`}
                >
                  <FolderTree size={16} className="mr-1.5" />
                  <span>Files</span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              {/* Theme selector */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className="p-1.5 rounded-md hover:bg-slate-700 relative group"
                  aria-label="Change theme"
                >
                  {currentTheme.includes("dark") ? (
                    <Moon size={18} className="text-blue-300" />
                  ) : (
                    <Sun size={18} className="text-yellow-300" />
                  )}
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Change theme
                  </span>
                </button>

                {showThemeSelector && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      {Object.entries(availableThemes).map(([name, theme]) => (
                        <button
                          key={name}
                          className={`block w-full text-left px-4 py-2 text-sm ${currentTheme === name
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
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
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
                className="p-1.5 rounded-md hover:bg-slate-700 relative group"
                aria-label="Share code"
              >
                <Share2 size={18} />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Share code
                </span>
              </button>

              {/* Copy code button */}
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-md hover:bg-slate-700 relative group"
                aria-label="Copy code"
              >
                {isCopied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} />
                )}
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {isCopied ? "Copied!" : "Copy code"}
                </span>
              </button>

              {/* Download button */}
              <button
                onClick={downloadCode}
                className="p-1.5 rounded-md hover:bg-slate-700 relative group"
                aria-label="Download code"
              >
                <Download size={18} />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Download {isMultiFile ? "project" : "code"}
                </span>
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-md hover:bg-slate-700 relative group"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </span>
              </button>
            </div>
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
              {isMultiFile && sandpackFiles ? (
                // Multi-file Sandpack setup
                <SandpackProvider
                  theme={availableThemes[currentTheme]}
                  template="react"
                  options={{
                    externalResources: ["https://cdn.tailwindcss.com"],
                  }}
                  files={sandpackFiles}
                  customSetup={{
                    dependencies: {
                      ...AILookup.DEPENDANCY,
                    },
                    entry: entryFile,
                  }}
                >
                  <SandpackLayout>
                    {activeTab === "explorer" && (
                      <SandpackFileExplorer style={{ height: "900px" }} />
                    )}
                    {activeTab === "code" && (
                      <SandpackCodeEditor
                        showTabs
                        showLineNumbers
                        showInlineErrors
                        wrapContent
                        closableTabs
                        style={{ height: "600px" }}
                      />
                    )}
                    {activeTab === "preview" && (
                      <SandpackPreview
                        showOpenInCodeSandbox
                        showRefreshButton
                        style={{ height: "900px" }}
                      />
                    )}
                    {activeTab === "console" && (
                      <SandpackConsole style={{ height: "900px" }} />
                    )}
                  </SandpackLayout>
                </SandpackProvider>
              ) : (
                // Single file Sandpack setup
                <SandpackProvider
                  theme={availableThemes[currentTheme]}
                  template="react"
                  options={{
                    externalResources: ["https://cdn.tailwindcss.com"],
                  }}
                  files={{
                    "/src/index.css": {
                      code: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
                    },
                    "/src/index.jsx": {
                      code: `import React from 'react';\nimport ReactDOM from 'react-dom';\nimport './index.css';\nimport App from './App';\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById('root')\n);`
                    },
                    "/src/App.js": {
                      code: hasError ? fallbackCode : processedCode,
                    },
                  }}
                  customSetup={{
                    dependencies: {
                      ...AILookup.DEPENDANCY,

                    },
                  }}
                >
                  <SandpackLayout>
                    {activeTab === "code" && (
                      <CodeEditorWithCapture
                        setCode={handleCodeChange}
                        style={{ height: "600px" }}
                      />
                    )}
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

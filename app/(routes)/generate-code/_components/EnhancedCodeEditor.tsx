"use client";

import React, { useState, useEffect, useContext } from "react";
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
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { UserUidContext } from "@/app/context/UserUidContext";
import { UserDesignContext } from "@/app/context/UserDesignContext";
import { LanguageContext } from "@/app/context/LanguageContext";

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
  } else if (
    !code.includes("import './index.css'") &&
    !code.includes("import './index.css';")
  ) {
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
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const { userUid, setUserUid } = useContext(UserUidContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const { design, setDesign } = useContext(UserDesignContext);

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
          return; // Exit early since we've handled the multi-file
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
          /```javascript|```typescript|```typescrpt|```jsx|```tsx|```|```json|json/g,
          ""
        )
        .trim();
    }
    console.log(processedCode, "processedCode");

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

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const result = await db
          .select()
          .from(imagetocodeTable)
          .where(eq(imagetocodeTable.uid, userUid ?? ""))
          .orderBy(desc(imagetocodeTable.createdAt));

        if (result.length > 0) {
          setDesign(result[0]);
        } else {
          console.log("No design found.");
        }
      } catch (err) {
        console.error("Error fetching design:", err);
      } finally {
      }
    };
    fetchDesign();
    console.log(design, "design");
  }, [userUid]);


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


  return (
    <ClientOnly>
      <div className="my-4">
        {/* Enhanced Project title and explanation */}
        {isMultiFile && projectData?.projectTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative overflow-hidden"
          >
            <div className="relative z-10 p-6 bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-full -mr-10 -mt-10 z-0 animate-pulse"></div>
              <div
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/30 via-yellow-500/30 to-emerald-500/30 blur-2xl rounded-full -ml-10 -mb-10 z-0 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-xl rounded-full z-0 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>

              {/* Code pattern background overlay */}
              <div className="absolute inset-0 opacity-5">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="codePattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <text
                      x="0"
                      y="10"
                      fill="currentColor"
                      fontSize="10"
                    >{`{}`}</text>
                    <text
                      x="10"
                      y="20"
                      fill="currentColor"
                      fontSize="10"
                    >{`()`}</text>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#codePattern)" />
                </svg>
              </div>

              {/* Enhanced floating animated dots */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0
                      ? "bg-indigo-500/40 dark:bg-indigo-400/40"
                      : i % 3 === 1
                        ? "bg-cyan-500/40 dark:bg-cyan-400/40"
                        : "bg-purple-500/40 dark:bg-purple-400/40"
                      }`}
                    style={{
                      width: `${Math.max(2, Math.random() * 6)}px`,
                      height: `${Math.max(2, Math.random() * 6)}px`,
                    }}
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                    }}
                    animate={{
                      x: [
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                      ],
                      y: [
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                      ],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 20,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Enhanced title with 3D effect and animated icon */}
              <div className="relative">
                <div className="flex items-center mb-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                    className="mr-3 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-lg text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{
                        rotateZ: [0, 10, 0, -10, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </motion.svg>
                  </motion.div>

                  <div className="flex flex-col">
                    <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 drop-shadow-sm">
                      {projectData.projectTitle}
                    </h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mt-1 shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced project stats with animations and more visual appeal */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-6 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div
                  className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/30 shadow-md relative overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.div
                    className="absolute -right-3 -top-3 w-12 h-12 bg-blue-500/10 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="text-xs uppercase text-blue-600 dark:text-blue-300 font-bold tracking-wider mb-1">
                    Files
                  </div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-200">
                    {Object.keys(projectData.files || {}).length}
                  </div>
                </motion.div>

                <motion.div
                  className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/30 shadow-md relative overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-purple-600/5 dark:bg-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.div
                    className="absolute -right-3 -top-3 w-12 h-12 bg-purple-500/10 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                  <div className="text-xs uppercase text-purple-600 dark:text-purple-300 font-bold tracking-wider mb-1">
                    Components
                  </div>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-200">
                    {Math.max(
                      1,
                      Math.floor(
                        Object.keys(projectData.files || {}).length / 2
                      )
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="text-center p-3 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl border border-pink-200/50 dark:border-pink-700/30 shadow-md relative overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-pink-600/5 dark:bg-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.div
                    className="absolute -right-3 -top-3 w-12 h-12 bg-pink-500/10 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  />
                  <div className="text-xs uppercase text-pink-600 dark:text-pink-300 font-bold tracking-wider mb-1">
                    Complexity
                  </div>
                  <div className="text-2xl font-black text-pink-700 dark:text-pink-200 flex items-center justify-center">
                    {Object.keys(projectData.files || {}).length > 3
                      ? "Advanced"
                      : "Basic"}
                    <motion.span
                      className="ml-1 text-yellow-500"
                      animate={{ rotate: [0, 20, 0, -20, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      {Object.keys(projectData.files || {}).length > 3
                        ? "⭐"
                        : ""}
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced explanation with animated left border and card effect */}
              {projectData.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="relative bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/50 dark:to-gray-700/50 p-4 rounded-lg shadow-md border border-gray-100/50 dark:border-gray-700/30"
                >
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 via-blue-500 to-indigo-300 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-200 rounded-l-lg"></div>
                  <motion.div
                    animate={{
                      y: [0, -5, 0, -5, 0],
                      opacity: [0.3, 0.6, 0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -right-2 -bottom-2 w-16 h-16 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-md rounded-full"
                  />
                  <div className="pl-4">
                    <h3 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                      Project Overview
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                      {projectData.explanation}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Technical specification tags */}
              <motion.div
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  React Project
                </div>
                <div className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  TypeScript
                </div>
                <div className="px-2.5 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Tailwind CSS
                </div>
              </motion.div>
            </div>

            {/* Enhanced action buttons with floating effects and better icons */}
            <motion.div
              className="flex justify-end space-x-1 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {/* Share button */}
              <motion.button
                onClick={handleShareCode}
                className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Share code"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Share2 size={18} />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Share code
                </span>
              </motion.button>

              {/* Copy code button */}
              <motion.button
                onClick={handleCopyCode}
                className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Copy code"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isCopied ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Copy size={18} />
                )}
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {isCopied ? "Copied!" : "Copy code"}
                </span>
              </motion.button>

              {/* Download button */}
              <motion.button
                onClick={downloadCode}
                className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download code"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Download size={18} />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Download {isMultiFile ? "project" : "code"}
                </span>
              </motion.button>

              {/* Fullscreen toggle */}
              <motion.button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Editor container */}
        <div
          className={`rounded-xl overflow-hidden shadow-lg ${isFullscreen
            ? "fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900"
            : ""
            }`}
        >
          {/* Tabs navigation */}
          {sandpackFiles && (

            <div className="flex items-center justify-between bg-slate-800 text-white p-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center px-3 py-1.5 rounded-md ${activeTab === "code" ? "bg-blue-600" : "hover:bg-slate-700"
                    }`}
                >
                  <Code size={16} className="mr-1.5" />
                  <span>Code + Files</span>
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
              </div>
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
              {/* //This is Only For React and Tailwind Css  */}
              {language == "react-tailwind" && isMultiFile && sandpackFiles ? (
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
                  }}
                >
                  <SandpackLayout>
                    {/* Always show file explorer when in multi-file mode */}
                    {(activeTab === "explorer" || activeTab === "code") && (
                      <div
                        className="sandpack-wrapper"
                        style={{ display: "flex", height: "900px" }}
                      >
                        <div
                          style={{
                            width: "25%",
                            height: "100%",
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          <SandpackFileExplorer style={{ height: "100%" }} />
                        </div>
                        <div style={{ width: "75%", height: "100%" }}>
                          <SandpackCodeEditor
                            showTabs
                            showLineNumbers
                            showInlineErrors
                            wrapContent
                            closableTabs
                            style={{ height: "100%" }}
                          />
                        </div>
                      </div>
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
              ) : language == "html-css" && isMultiFile && sandpackFiles ? (
                // Single file Sandpack setup
                <div>
                  <SandpackProvider
                    theme={availableThemes[currentTheme]}
                    template="static"

                    files={sandpackFiles}

                  >
                    <SandpackLayout>
                      {/* Always show file explorer when in multi-file mode */}
                      {(activeTab === "explorer" || activeTab === "code") && (
                        <div
                          className="sandpack-wrapper"
                          style={{ display: "flex", height: "900px", width: "100%" }}
                        >
                          <div
                            style={{
                              width: "25%",
                              height: "100%",
                              borderRight: "1px solid #e5e7eb",
                            }}
                          >
                            <SandpackFileExplorer style={{ height: "100%", width: "100%" }} />
                          </div>
                          <div style={{ width: "75%", height: "100%", }}>
                            <SandpackCodeEditor
                              showTabs
                              showLineNumbers
                              showInlineErrors
                              wrapContent
                              closableTabs
                              style={{ height: "100%", width: "100%" }}
                            />
                          </div>
                        </div>
                      )}
                      {activeTab === "preview" && (
                        <SandpackPreview
                          showOpenInCodeSandbox
                          showRefreshButton
                          style={{ height: "900px", width: "100%" }}
                        />
                      )}
                      {activeTab === "console" && (
                        <SandpackConsole style={{ height: "900px", width: "100%" }} />
                      )}
                    </SandpackLayout>
                  </SandpackProvider>
                </div>
              ) : (
                // Single file Sandpack setup
                <div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ClientOnly>
  );
};

export default EnhancedCodeEditor;

import React from 'react'
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
            let readmeContent = `# ${
              projectData.projectTitle || "Generated Project"
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
              element.download = `${
                projectData.projectTitle || "generated-project"
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

function dummy() {
  return (
    <div>   <div className="flex space-x-2">
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
                </div></div>
  )
}

export default dummy
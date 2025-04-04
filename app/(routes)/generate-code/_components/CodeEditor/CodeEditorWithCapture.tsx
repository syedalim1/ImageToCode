"use client";

import React, { useEffect } from "react";
import { SandpackCodeEditor, useActiveCode } from "@codesandbox/sandpack-react";
import { AlertTriangle } from "lucide-react";

interface CodeEditorWithCaptureProps {
  setCode: (code: string) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
  showInlineHints?: boolean;
  fontSize?: number;
  lineHeight?: number;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
  highlightedLines?: number[];
}

const CodeEditorWithCapture: React.FC<CodeEditorWithCaptureProps> = ({
  setCode,
  readOnly = false,
  style,
  showInlineHints = true,
  fontSize = 14,
  lineHeight = 1.5,
  showLineNumbers = true,
  wrapContent = true,
  highlightedLines = [],
}) => {
  const { code, updateCode } = useActiveCode();
  
  // Update the parent component's state when code changes
  useEffect(() => {
    setCode(code);
  }, [code, setCode]);

  return (
    <div className="relative h-full">
      {/* Hints panel - shows as a floating element near relevant code */}
      {showInlineHints && (
        <div className="absolute top-2 right-2 z-10 max-w-xs bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-3 shadow-lg animate-fadeIn">
          <div className="flex items-start">
            <AlertTriangle className="text-blue-500 mt-0.5 w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Pro Tips</h4>
              <ul className="mt-1 text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Press Ctrl+Space for code completion</li>
                <li>• Press Alt+Z to toggle word wrap</li>
                <li>• Press F1 to open the command palette</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* The actual code editor */}
      <SandpackCodeEditor
        style={{
          minWidth: "100%",
          height: "100%",
          ...style,
        }}
        showLineNumbers={showLineNumbers}
        showTabs
        readOnly={readOnly}
        wrapContent={wrapContent}
        showInlineErrors
        closableTabs
        // Extension support can be added with proper CodeMirror extension types
        // We're commenting this out for now to fix type errors
        /*
        extensions={[
          // Custom extensions would go here
        ]}
        */
        className="enhanced-code-editor"
      />

      {/* Custom styling */}
      <style jsx global>{`
        .enhanced-code-editor {
          --sp-font-size: ${fontSize}px;
          --sp-layout-height: 100%;
        }
        
        .enhanced-code-editor .cm-editor {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: ${fontSize}px;
          line-height: ${lineHeight};
        }
        
        .enhanced-code-editor .cm-line {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        
        .enhanced-code-editor .cm-activeLineGutter,
        .enhanced-code-editor .cm-activeLine {
          background-color: rgba(24, 144, 255, 0.1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CodeEditorWithCapture;

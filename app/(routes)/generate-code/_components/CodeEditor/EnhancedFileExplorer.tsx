"use client";

import React, { useState } from "react";
import { SandpackFileExplorer, useSandpack } from "@codesandbox/sandpack-react";
import { FolderTree, Info, FileJson, Search } from "lucide-react";

interface EnhancedFileExplorerProps {
  showFileInfo?: boolean;
}

const EnhancedFileExplorer: React.FC<EnhancedFileExplorerProps> = ({ showFileInfo = false }) => {
  const { sandpack } = useSandpack();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFileDetails, setShowFileDetails] = useState<string | null>(null);
  
  // Get all files from sandpack
  const allFiles = Object.keys(sandpack.files);
  
  // Filter files based on search term
  const filteredFiles = searchTerm 
    ? allFiles.filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFiles;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
          <FolderTree className="w-4 h-4 mr-2 text-blue-500" />
          Project Files
        </h3>
        
        {/* Search box */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm placeholder-gray-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search files..."
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        {/* Custom file list with animations */}
        {searchTerm && filteredFiles.length > 0 && (
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Found {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
          </div>
        )}
        
        {searchTerm && filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <FileJson className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No files matching "{searchTerm}"</p>
          </div>
        )}
        
        {/* Regular file explorer for browsing */}
        <div className="custom-file-explorer">
          <SandpackFileExplorer 
            className="flex-grow overflow-auto custom-scrollbar" 
          />
        </div>
      </div>
      
      {/* File info panel at the bottom */}
      {showFileInfo && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4 mr-1" />
            <span>{allFiles.length} files in project</span>
          </div>
          <div className="mt-2 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>JavaScript</span>
              <span>{allFiles.filter(f => f.endsWith('.js')).length}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>React</span>
              <span>{allFiles.filter(f => f.endsWith('.jsx')).length}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>TypeScript</span>
              <span>{allFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>CSS</span>
              <span>{allFiles.filter(f => f.endsWith('.css')).length}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom styling for the file explorer */}
      <style jsx global>{`
        .custom-file-explorer .sp-file-explorer {
          --sp-colors-surface1: transparent;
          --sp-colors-surface2: transparent;
          padding: 0.5rem;
        }
        
        .custom-file-explorer .sp-file-explorer-list {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .custom-file-explorer .sp-file-item {
          margin: 2px 0;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .custom-file-explorer .sp-file-item:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .custom-file-explorer .sp-file-item-active {
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default EnhancedFileExplorer;

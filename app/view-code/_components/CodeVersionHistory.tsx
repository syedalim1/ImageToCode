"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, Code, Clock, Check } from "lucide-react";

interface CodeVersion {
  code: string;
  timestamp: string;
  versionNumber: number;
}

interface CodeVersionHistoryProps {
  versions: CodeVersion[];
  currentVersion: number;
  onSelectVersion: (version: CodeVersion) => void;
  maxVersionsReached: boolean;
}

const CodeVersionHistory: React.FC<CodeVersionHistoryProps> = ({
  versions,
  currentVersion,
  onSelectVersion,
  maxVersionsReached,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (versions.length === 0) return null;

  return (
    <div className="mb-6">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Code Version History
            </h3>
            {maxVersionsReached && (
              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                Max regenerations reached
              </span>
            )}
          </div>
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {maxVersionsReached ? (
                    <p>You've reached the maximum number of code regenerations (3). Here are all your previous versions:</p>
                  ) : (
                    <p>You've generated {versions.length} version{versions.length !== 1 ? 's' : ''} so far. You can regenerate code up to 3 times.</p>
                  )}
                </div>

                <div className="space-y-3">
                  {versions.map((version) => (
                    <motion.div
                      key={version.versionNumber}
                      className={`p-3 rounded-lg border ${
                        currentVersion === version.versionNumber
                          ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                          : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                      } cursor-pointer transition-colors`}
                      onClick={() => onSelectVersion(version)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">
                            Version {version.versionNumber}
                          </span>
                          {currentVersion === version.versionNumber && (
                            <span className="flex items-center text-green-600 dark:text-green-400 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {version.timestamp}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-mono bg-gray-50 dark:bg-gray-900/50 p-1 rounded">
                        {version.code.substring(0, 100)}...
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CodeVersionHistory;

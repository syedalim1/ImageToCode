"use client";

import React, { useEffect, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { Cpu, AlertTriangle, CheckCircle, Zap, Clock, FileCode, BarChart3 } from "lucide-react";

interface PerformanceResult {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  location?: string;
}

interface PerformanceAnalyzerProps {
  code: string;
}

const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ code }) => {
  const { sandpack } = useSandpack();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PerformanceResult[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({
    complexity: 0,
    size: 0,
    renderEfficiency: 0,
    overallScore: 0,
  });

  // Analyze code for common performance issues
  useEffect(() => {
    const analyzeCode = () => {
      setIsAnalyzing(true);
      
      // Get active file content
      const activeFile = sandpack.activeFile;
      // Add null checking to avoid 'object possibly undefined' error
      const fileContent = activeFile && sandpack.files[activeFile]?.code ? sandpack.files[activeFile].code : code;
      
      // Simple metrics calculation
      const fileSize = new Blob([fileContent]).size;
      const lineCount = fileContent.split('\n').length;
      const complexity = calculateComplexity(fileContent);
      
      setTimeout(() => {
        // This is a simplified analysis - in a real implementation,
        // you would use more sophisticated static analysis tools
        const analysisResults: PerformanceResult[] = [];
        
        // Check for useState in loops (React anti-pattern)
        if (fileContent.match(/for\s*\(.*useState\(/) || fileContent.match(/while\s*\(.*useState\(/)) {
          analysisResults.push({
            type: "warning",
            title: "useState in loops detected",
            description: "Using useState inside loops can cause unexpected behavior and performance issues.",
            impact: "high",
          });
        }
        
        // Check for excessive re-renders potential
        // if (fileContent && fileContent.match(/useState\(/g)?.length > 10) {
        //   analysisResults.push({
        //     type: "warning",
        //     title: "High state count",
        //     description: "Using many state variables may cause excessive re-renders. Consider consolidating related state.",
        //     impact: "medium",
        //   });
        // }
        
        // Check for missing dependency arrays in useEffect
        if (fileContent.match(/useEffect\(\s*\(\)\s*=>\s*\{[^}]*\}\s*\)/g)) {
          analysisResults.push({
            type: "warning",
            title: "Missing dependency array in useEffect",
            description: "useEffect without dependency array will run on every render, which may cause performance issues.",
            impact: "high",
          });
        }
        
        // Check for large component file size
        if (fileSize > 15000) {
          analysisResults.push({
            type: "warning",
            title: "Large component file",
            description: `File size is ${(fileSize/1024).toFixed(1)} KB. Consider breaking this into smaller components.`,
            impact: "medium",
          });
        }
        
        // Check for inline functions in JSX (creates new functions on every render)
        if (fileContent.match(/<[A-Za-z]+[^>]*\bon[A-Z][a-zA-Z]*=\{(?!\s*[a-zA-Z0-9_]+\s*\})[^>]*>/g)) {
          analysisResults.push({
            type: "warning",
            title: "Inline functions in JSX",
            description: "Inline functions in JSX create new function instances on every render. Consider using memoized callbacks.",
            impact: "low",
          });
        }
        
        // Check for potential memory leaks in useEffect
        if (fileContent.match(/useEffect\([^}]*setInterval|setTimeout[^}]*return\s*\(\s*\)\s*=>/g)) {
          analysisResults.push({
            type: "warning",
            title: "Potential memory leak",
            description: "Ensure intervals and timeouts are properly cleaned up in useEffect return function.",
            impact: "medium",
          });
        }
        
        // Add some positive feedback if code looks good
        if (analysisResults.length === 0) {
          analysisResults.push({
            type: "success",
            title: "No major issues detected",
            description: "Your code follows good performance practices. Great job!",
            impact: "low",
          });
        }
        
        if (fileContent.match(/React\.memo|useMemo|useCallback/g)) {
          analysisResults.push({
            type: "success",
            title: "Optimization techniques used",
            description: "You're using memoization techniques which can improve performance in the right scenarios.",
            impact: "medium",
          });
        }
        
        // Calculate metrics
        const overallScore = calculateOverallScore(analysisResults, complexity, fileSize);
        
        setResults(analysisResults);
        setMetrics({
          complexity,
          size: fileSize,
          renderEfficiency: Math.max(0, 100 - (analysisResults.length * 15)),
          overallScore,
        });
        setIsAnalyzing(false);
      }, 1000); // Simulate analysis time
    };
    
    analyzeCode();
  }, [code, sandpack]);
  
  // Calculate code complexity (simplified)
  const calculateComplexity = (content: string): number => {
    // Count control flow statements as a simple proxy for cyclomatic complexity
    const controlFlowMatches = content.match(/if|else|for|while|switch|case|&&|\|\||\?/g) || [];
    const nestedComponentMatches = content.match(/<[A-Z][a-zA-Z]*[^>]*>/g) || [];
    
    return Math.min(100, Math.round((controlFlowMatches.length * 2 + nestedComponentMatches.length) / 3));
  };
  
  // Calculate overall score based on issues found and complexity
  const calculateOverallScore = (results: PerformanceResult[], complexity: number, size: number): number => {
    let score = 100;
    
    // Reduce score based on issues found
    results.forEach(result => {
      if (result.type === "warning") {
        score -= result.impact === "high" ? 15 : 
                result.impact === "medium" ? 10 : 5;
      }
    });
    
    // Adjust for complexity
    score -= Math.round(complexity / 10);
    
    // Adjust for file size (if over 5KB)
    if (size > 5000) {
      score -= Math.min(20, Math.round((size - 5000) / 1000));
    }
    
    return Math.max(0, Math.min(100, score));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Cpu className="mr-2" />
          Performance Analysis
        </h2>
        <p className="text-sm opacity-80 mt-1">
          Identify potential performance issues and optimization opportunities
        </p>
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
            <BarChart3 className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Overall Score</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {metrics.overallScore}/100
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getScoreColorClass(metrics.overallScore)}`}
              style={{ width: `${metrics.overallScore}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-yellow-600 dark:text-yellow-400 mb-2">
            <FileCode className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Complexity</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {metrics.complexity}/100
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getInverseScoreColorClass(metrics.complexity)}`}
              style={{ width: `${metrics.complexity}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Size</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {(metrics.size / 1024).toFixed(1)} KB
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {metrics.size > 50000 ? "Large" : metrics.size > 15000 ? "Medium" : "Small"} file size
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
            <Zap className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Render Efficiency</h3>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {metrics.renderEfficiency}/100
          </div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getScoreColorClass(metrics.renderEfficiency)}`}
              style={{ width: `${metrics.renderEfficiency}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Analysis results */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Analysis Results</h3>
        
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin mr-2">
              <Cpu className="h-6 w-6 text-indigo-500" />
            </div>
            <span className="text-gray-600 dark:text-gray-300">Analyzing your code...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  result.type === "warning" 
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                    : result.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.type === "warning" ? (
                      <AlertTriangle className={`h-5 w-5 text-amber-500`} />
                    ) : result.type === "success" ? (
                      <CheckCircle className={`h-5 w-5 text-green-500`} />
                    ) : (
                      <Zap className={`h-5 w-5 text-blue-500`} />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-sm font-medium ${
                      result.type === "warning" 
                        ? "text-amber-800 dark:text-amber-300"
                        : result.type === "success"
                        ? "text-green-800 dark:text-green-300"
                        : "text-blue-800 dark:text-blue-300"
                    }`}>
                      {result.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {result.description}
                    </p>
                    {result.location && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Location: {result.location}
                      </p>
                    )}
                    {result.type === "warning" && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium mr-2">Impact:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          result.impact === "high" 
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : result.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {result.impact.charAt(0).toUpperCase() + result.impact.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Tips section */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800">
        <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">Optimization Tips</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li className="flex items-start">
            <span className="text-indigo-500 mr-1">•</span>
            <span>Use React.memo for components that render often but with the same props</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-1">•</span>
            <span>Extract event handlers outside of render to avoid recreating functions</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-1">•</span>
            <span>Consider using useCallback for functions passed as props</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-1">•</span>
            <span>Use useMemo for expensive calculations</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to get color class based on score
const getScoreColorClass = (score: number): string => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

// Helper function to get inverse color class based on score (higher is worse)
const getInverseScoreColorClass = (score: number): string => {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-green-500";
};

export default PerformanceAnalyzer;

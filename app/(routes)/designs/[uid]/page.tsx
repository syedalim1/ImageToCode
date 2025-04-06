"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Code,
  Home,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Download,
  ExternalLink,
  Maximize,
  Minimize,
  Eye,
  Share2,
  FileCode,
  Copy,
  Check
} from "lucide-react";

// Components
import EnhancedCodeEditor from "../../generate-code/_components/EnhancedCodeEditor";
import StatusNotification from "../../generate-code/_components/StatusNotification";
import DarkModeToggle from "../../generate-code/_components/DarkModeToggle";
import SuccessConfetti from "../../generate-code/_components/SuccessConfetti";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

interface CodeContent {
  content: string;
}

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  language: string;
  options: string[];
  code: CodeContent;
}

// Format date function
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const DesignPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState<string>("");
  const [zoomImage, setZoomImage] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  useEffect(() => {
    if (uid) {
      fetchDesign();
    }
  }, [uid]);

  useEffect(() => {
    if (design?.code?.content) {
      setCode(design.code.content);
      // const result = JSON.parse(design.code.content);
      console.log(code, "design code content");
    }
  }, [design]);

  const fetchDesign = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await db
        .select()
        .from(imagetocodeTable)
        .where(eq(imagetocodeTable.uid, uid ?? ""))
        .orderBy(desc(imagetocodeTable.createdAt));

      if (result.length > 0) {
        setDesign(result[0] as Design);
      } else {
        setError("No design found.");
      }
    } catch (err) {
      setError("Failed to fetch design. Please try again later.");
      console.error("Error fetching design:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Functions for handling user actions
  const navigateHome = () => {
    router.push("/");
  };

  const handleCodeChange = (newCode: string | { content: string }) => {
    if (typeof newCode === "string") {
      setCode(newCode);
    } else if (
      typeof newCode === "object" &&
      newCode !== null &&
      "content" in newCode
    ) {
      setCode(newCode.content);
    }
  };

  const handleCopyCode = () => {
    if (!code) return;
    
    navigator.clipboard.writeText(code);
    setCopiedToClipboard(true);
    setSuccess("Code copied to clipboard!");
    
    setTimeout(() => {
      setCopiedToClipboard(false);
      setSuccess("");
    }, 3000);
  };
  
  const handleDownloadCode = () => {
    if (!code) return;
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${design?.description || "design"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess("Code downloaded successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };
  
  const handleShareDesign = () => {
    if (!design) return;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    
    setSuccess("Design URL copied to clipboard! Ready to share.");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Theme toggle button */}
      <DarkModeToggle />

      {/* Success confetti effect */}
      <SuccessConfetti trigger={!!success} />

      <div className="p-4 mx-auto">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center space-x-2 mb-6 text-sm">
          <button
            onClick={navigateHome}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href="/designs"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Designs
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            {design?.description || "Design Details"}
          </span>
        </nav>

        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center mb-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </motion.button>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header with animated gradient border */}
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="p-6">
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white rounded-lg overflow-hidden">
                {/* Animated background patterns */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                  <div className="absolute -bottom-24 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                <h1 className="text-3xl font-extrabold mb-3 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                  {design?.description || "Untitled Design"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm relative z-10 mt-4">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <svg
                      className="w-5 h-5 mr-2 text-pink-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Created: {formatDate(design?.createdAt || "")}</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <svg
                      className="w-5 h-5 mr-2 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <span>Model: {design?.model}</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Language: {design?.language || "HTML/CSS"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Notifications */}
            <div className="space-y-2">
              <StatusNotification
                type="loading"
                title="Loading design..."
                message="Please wait while we load your design"
                visible={loading}
              />

              <StatusNotification
                type="error"
                title="Error"
                message={error}
                onAction={fetchDesign}
                actionLabel="Try Again"
                visible={!!error}
              />

              <StatusNotification
                type="success"
                title="Success"
                message={success}
                visible={!!success}
              />
            </div>

            {/* Design content */}
            {!loading && !error && design && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Code preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Code className="h-5 w-5 text-indigo-500" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Generated Code</span>
                    </h2>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={handleCopyCode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                        title="Copy code"
                      >
                        {copiedToClipboard ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </motion.button>
                      
                      <motion.button
                        onClick={handleDownloadCode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                        title="Download code"
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        onClick={handleShareDesign}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                        title="Share design"
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-5 left-10 w-3 h-3 bg-blue-500 rounded-full opacity-30 animate-float"></div>
                      <div className="absolute top-20 right-10 w-2 h-2 bg-purple-500 rounded-full opacity-30 animate-float animation-delay-300"></div>
                      <div className="absolute bottom-10 left-1/4 w-4 h-4 bg-pink-500 rounded-full opacity-30 animate-float animation-delay-700"></div>
                    </div>
                    
                    <EnhancedCodeEditor 
                      code={code}
                      isLoading={loading}
                    />
                  </div>
                  
                  {/* Code explanation area */}
                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <h3 className="text-sm font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
                      <Sparkles className="h-4 w-4" />
                      Code Details
                    </h3>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <p><span className="font-medium">Model:</span> {design?.model || 'AI Generator'}</p>
                      <p><span className="font-medium">Language:</span> {design?.language || 'HTML/CSS'}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(design?.createdAt || '')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Image preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-indigo-500" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Design Image</span>
                    </h2>
                    
                    <motion.button
                      onClick={() => setZoomImage(!zoomImage)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                      title={zoomImage ? "Minimize" : "Maximize"}
                    >
                      {zoomImage ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </motion.button>
                  </div>
                  
                  <motion.div 
                    className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow"
                    whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  >
                    <div className="relative aspect-auto overflow-auto max-h-[600px]">
                      {design?.imageUrl && (
                        <img
                          src={design.imageUrl}
                          alt={design?.description || "Design image"}
                          className="w-full h-auto object-contain"
                        />
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Image information */}
                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <h3 className="text-sm font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
                      <FileCode className="h-4 w-4" />
                      Design Information
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      This design was created using {design?.model || 'AI'} to generate code from the image. 
                      You can view, modify, and download the generated code using the tools provided.
                    </p>
                  </div>
                </div>
              </div>
            )
            
            {/* Full screen image preview */}
            {zoomImage && design && design.imageUrl && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              >
                <motion.button
                  onClick={() => setZoomImage(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minimize className="h-6 w-6" />
                </motion.button>
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={design.imageUrl}
                  alt={design?.description || "Design image"}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DesignPage;
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
                <div className="absolute -bottom-24 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-1/3 w-20 h-20 bg-yellow-300 opacity-20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-300 opacity-20 rounded-full blur-xl animate-float animation-delay-2000"></div>
              </div>

              <h1 className="text-4xl font-extrabold mb-3 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                {design.description || "Untitled Design"}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm relative z-10 mt-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg
                    className="w-5 h-5 mr-2 text-pink-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Created: {formatDate(design.createdAt)}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span>Model: {design.model}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>UID: {design.uid}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-8 py-4 text-sm font-medium flex items-center transition-all ${activeTab === "preview"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800"
                    : "text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-8 py-4 text-sm font-medium flex items-center transition-all ${activeTab === "code"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800"
                    : "text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Code
                </button>
              </div>
            </div>

            {/* Design image */}
            {design.imageUrl && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Original Image
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setZoomImage(!zoomImage)}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            zoomImage
                              ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                              : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          }
                        />
                      </svg>
                      {zoomImage ? "Shrink" : "Expand"}
                    </button>
                    <a
                      href={design.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Full Size
                    </a>
                  </div>
                </div>
                <div
                  className={`relative ${zoomImage ? "h-96 md:h-[500px]" : "h-64"
                    } transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={design.imageUrl}
                    alt={design.description || "Design image"}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Sandpack */}
            <div className="p-6">

              <SandpackProvider
                options={{
                  externalResources: ["https://cdn.tailwindcss.com"],
                  classes: {
                    "sp-wrapper":
                      "custom-wrapper rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg",
                    "sp-layout": "custom-layout",
                    "sp-tab-button": "custom-tab",
                  },
                }}
                customSetup={{
                  dependencies: {
                    "react-markdown": "latest",
                    "lucide-react": "latest",
                  },
                }}
                files={{
                  "/App.js": design.code.content,
                }}
                theme="auto"
                template="react"
              >
                <SandpackLayout
                  style={{
                    width: "100%",
                    height: activeTab === "preview" ? "700px" : "800px",
                    borderRadius: "0.5rem",
                  }}
                >
                  {activeTab === "code" && (
                    <SandpackCodeEditor
                      style={{
                        height: "100%",
                        minWidth: "100%",
                      }}
                      showLineNumbers
                      showTabs
                      readOnly
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
                    />
                  )}
                </SandpackLayout>
              </SandpackProvider>

            </div>

            {/* Actions */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900/80 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {formatDate(design.createdAt)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => window.print()}
                  className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg transition-all shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
                    />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <DesignPage />
    </div>
  );
}



"use client";
import { db } from "@/configs/db";
import { imagetocodeTable } from "@/configs/schema";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { desc, eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  language: string;
  options: string[];
  code: {
    content: string;
  };
}

function DesignPage() {
  const params = useParams();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [zoomImage, setZoomImage] = useState(false);
  const [Template, setTemplate] = useState<string>("");

  useEffect(() => {
    if (uid) {
      fetchDesign();
    }
  }, [uid]);

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
        console.log(result[0], "designs");
        if (design?.language == "react-tailwind") {
          setTemplate("react");
        }
        else if (design?.language == "nextjs-tailwind") {
          setTemplate("nextjs");
        }
        else if(design?.language == "html-css") {
          setTemplate("html");
      } }else {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-96 -right-24 w-96 h-96 bg-yellow-400 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-96 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link
              href="/"
              className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <svg
              className="mx-2 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <Link
              href="/designs"
              className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Designs
            </Link>
            <svg
              className="mx-2 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
              {design?.description || "Design Details"}
            </span>
          </nav>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-xl backdrop-blur-sm">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-violet-500 animate-spin animation-delay-300"></div>
              <div className="absolute inset-4 rounded-full border-4 border-t-purple-500 animate-spin animation-delay-600"></div>
            </div>
            <p className="mt-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent animate-pulse">
              Loading design...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border-l-4 border-red-500">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Error Loading Design
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <button
                onClick={fetchDesign}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <span className="flex items-center justify-center">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </span>
              </button>
            </div>
          </div>
        ) : design ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
            {/* Design header */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white rounded-t-xl overflow-hidden">
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
                  className={`px-8 py-4 text-sm font-medium flex items-center transition-all ${
                    activeTab === "preview"
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
                  className={`px-8 py-4 text-sm font-medium flex items-center transition-all ${
                    activeTab === "code"
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
                  className={`relative ${
                    zoomImage ? "h-96 md:h-[500px]" : "h-64"
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
        ) :null}
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

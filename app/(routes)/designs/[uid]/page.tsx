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
import Image from "next/image";
import Link from "next/link";

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  options: string[];
  code: {
    content: string;
  };
}

export default function Page() {
  const params = useParams();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
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
            <Link href="/designs" className="hover:text-blue-600 dark:hover:text-blue-400">
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
            <span className="text-gray-800 dark:text-gray-200">
              {design?.description || "Design Details"}
            </span>
          </nav>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              Loading design...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
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
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
              Error Loading Design
            </h2>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={fetchDesign}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : design ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {/* Design header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">
                {design.description || "Untitled Design"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Created: {formatDate(design.createdAt)}</span>
                </div>
                <div className="flex items-center">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span>Model: {design.model}</span>
                </div>
                <div className="flex items-center">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>UID: {design.uid}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "preview"
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "code"
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Code
                </button>
              </div>
            </div>

            {/* Design image */}
            {design.imageUrl && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Original Image
                  </h2>
                  <a
                    href={design.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Full Size
                  </a>
                </div>
                <div className="relative h-64 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
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
                    "sp-wrapper": "custom-wrapper rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
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
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-end">
              <Link
                href={`/view-code/${design.uid}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Edit Code
              </Link>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
              >
                Print / Export
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-yellow-500"
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
            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              No Design Available
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300">
              The requested design could not be found.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

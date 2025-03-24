"use client";

import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Home,
  ChevronRight,
  Sparkles,
  BarChart2,
  FileCode2,
  Zap,
  Star,
  Cpu,
  ArrowLeft,
} from "lucide-react";

// Components
import CodeHeader from "../_components/CodeHeader";
import EnhancedCodeEditor from "../_components/EnhancedCodeEditor";
import StatusNotification from "../_components/StatusNotification";
import ImagePreview from "../_components/ImagePreview";
import ActionButtons from "../_components/ActionButtons";
import DarkModeToggle from "../_components/DarkModeToggle";
import SuccessConfetti from "../_components/SuccessConfetti";
import ClientDate from "../_components/ClientDate";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

interface CodeContent {
  content: string;
}

interface CodeRecord {
  id: number;
  uid: string;
  Language: string;
  mode: string;
  description: string;
  model: string;
  imageUrl: string;
  code: CodeContent;
  createdAt: string;
  options: Record<string, any>;
}

type APIResponse = Omit<CodeRecord, "code"> & {
  code: string | CodeContent;
};

const MAX_REGENERATIONS = 3;

const Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<CodeRecord | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [codeStats, setCodeStats] = useState({
    lines: 0,
    characters: 0,
    functions: 0,
    quality: 0,
  });
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  // Calculate code statistics
  useEffect(() => {
    if (response) {
      const lines = response.split("\n").length;
      const characters = response.length;
      const functionMatches = response.match(/function\s+\w+\s*\(/g) || [];
      const arrowFunctionMatches =
        response.match(/const\s+\w+\s*=\s*(\([^)]*\)|[^=]+)=>/g) || [];
      const functions = functionMatches.length + arrowFunctionMatches.length;

      // Simple quality score based on code length and structure
      const qualityBase = Math.min(lines / 10, 10);
      const qualityBonus = Math.min(functions / 2, 5);
      const quality = Math.min(Math.round(qualityBase + qualityBonus), 10);
    
      setCodeStats({
        lines,
        characters,
        functions,
        quality,
      });
    }
  }, [response]);

  // Handle success message timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Load record data
  useEffect(() => {
    uid && getRecordInfo(uid);
  }, [uid]);

  const getRecordInfo = async (uid: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get<APIResponse>(
        `/api/codetoimage?uid=${uid}`
      );
   
      const normalizedRecord: CodeRecord = {
        ...data,
        code:
          typeof data.code === "string" ? { content: data.code } : data.code,
      };

      setRecord(normalizedRecord);

      // Get the raw code content
      let codeContent =
        typeof data.code === "string" ? data.code : data.code?.content || "";

      // Try to parse the code if it's a JSON string containing AI response
      try {
        if (
          codeContent.trim().startsWith("{") &&
          codeContent.includes('"message"')
        ) {
          const parsedData = JSON.parse(codeContent);

          // Check if this is an AI response with content
          if (
            parsedData.choices &&
            parsedData.choices[0] &&
            parsedData.choices[0].message &&
            parsedData.choices[0].message.content
          ) {
            // Extract the actual code from the AI response
            codeContent = parsedData.choices[0].message.content;
          }
        }
      } catch (e) {
        console.error("Failed to parse code as JSON:", e);
        // If parsing fails, continue with the original code
      }

      // Clean up the code content - remove markdown code blocks
      setResponse(
        codeContent
          .replace(
            /```javascript|```typescript|```typescrpt|```jsx|```tsx|```/g,
            ""
          )
          .trim() || ""
      );
    } catch (err) {
      handleError(err, "Error fetching record:");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown, context: string) => {
    console.error(context, error);
    setError(
      axios.isAxiosError(error)
        ? `${context} ${error.response?.data?.error || error.message}`
        : `${context} Unknown error`
    );
  };

  const generateCode = async (record: CodeRecord) => {
    // if (regenerationCount >= MAX_REGENERATIONS) {
    //   setError("Maximum regenerations reached");
    //   return;
    // }

    const userdatabase = await db
      .select()
      .from(usersTable)
      .where(
        eq(usersTable.email, user?.primaryEmailAddress?.emailAddress ?? "")
      );

    const currentCredits = userdatabase[0]?.credits ?? 0;

    if (currentCredits < 10) {
      setError("You have no credits left to regenerate code.");
      return;
    }
    // Check if user is logged in
    if (!user) {
      setError("User not found. Please log in to generate code.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      setError("");
      setShowStats(false);
      
console.log('====================================');
console.log(record," record");
console.log('====================================');
      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: record.description,
          imageUrl: record.imageUrl,
          mode: record.mode,
          options: record.options,
          model: record.model,
          language: record.Language,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let generatedCode = "";
      let processedCode = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        generatedCode += chunk;

        console.log("====================================");
        console.log(chunk, "   chunk");
        console.log("====================================");

        // Try to extract code from JSON if it looks like a JSON response
        try {
          if (
            generatedCode.trim().startsWith("{") &&
            generatedCode.includes('"message"')
          ) {
            const parsedData = JSON.parse(generatedCode);

            if (
              parsedData.choices &&
              parsedData.choices[0] &&
              parsedData.choices[0].message &&
              parsedData.choices[0].message.content
            ) {
              processedCode = parsedData.choices[0].message.content;
              setResponse(processedCode);
            } else {
              // If we can't extract the content, just use the raw response
              setResponse((prev) => prev + chunk);
            }
          } else {
            // Not JSON, just append the chunk
            setResponse((prev) => prev + chunk);
          }
        } catch (e) {
          // If JSON parsing fails, just append the chunk
          setResponse((prev) => prev + chunk);
        }
      }

      // Use the processed code if available, otherwise use the raw generated code
      const finalCode = processedCode || generatedCode;

      // Clean up code by removing markdown code blocks if present
      const cleanedCode = finalCode
        .replace(
          /```javascript|```typescript|```typescrpt|```jsx|```tsx|```|js/g,
          ""
        )
        .trim();

      await axios.put(`/api/codetoimage?uid=${uid}`, {
        code: { content: cleanedCode },
        model: record.model,
        email: user?.primaryEmailAddress?.emailAddress || "",
        options: record.options || {},
      });

      setRegenerationCount((prev) => prev + 1);
    } catch (err) {
      handleError(err, "Error generating code:");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCode = async () => {
    try {
      setLoading(true);
      setError("");

      // Ensure code is properly formatted as a JSON object with content property
      const formattedCode = { content: response };

      await axios.put("/api/update-code", {
        uid,
        code: formattedCode,
        email: user?.primaryEmailAddress?.emailAddress || "",
      });

      setSuccess("Code saved successfully!");
      getRecordInfo(uid!);
    } catch (err) {
      handleError(err, "Error updating code:");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode: string | { content: string }) => {
    if (typeof newCode === "string") {
      setResponse(newCode);
    } else if (
      typeof newCode === "object" &&
      newCode !== null &&
      "content" in newCode
    ) {
      setResponse(newCode.content);
    }
  };

  const navigateHome = () => {
    router.push("/");
  };

  // Quality indicator colors
  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-500";
    if (quality >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  // Render quality stars
  const renderQualityStars = (quality: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const filled = i < Math.ceil(quality / 2);
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Theme toggle button - moved to client component */}
      <DarkModeToggle />

      {/* Success confetti effect - moved to client component */}
      <SuccessConfetti trigger={!!success} />

      {/* Floating action button */}
      <AnimatePresence>
        {showFloatingButton && response && (
          <motion.button
            onClick={() => setShowStats(!showStats)}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            title="View code statistics"
          >
            <BarChart2 className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="p-4 max-w-6xl mx-auto">
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
          <button
            onClick={() => router.push("/designs")}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Designs
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            View Code
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
              <CodeHeader {...record} />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Notifications */}
            <div className="space-y-2">
              <StatusNotification
                type="loading"
                title="Crafting your code..."
                message="This typically takes 10-30 seconds"
                visible={loading}
              />

              <StatusNotification
                type="error"
                title="Generation Error"
                message={error}
                onAction={() => record && generateCode(record)}
                actionLabel="Retry Generation"
                visible={!!error}
              />

              <StatusNotification
                type="success"
                title="Success"
                message={success}
                visible={!!success}
              />
            </div>

            {/* Action area */}
            {record && (
              <div className="flex flex-wrap justify-between items-center gap-4">
                {record.imageUrl && <ImagePreview imageUrl={record.imageUrl} />}
                <ActionButtons
                  onSave={handleUpdateCode}
                  onGenerate={() => generateCode(record)}
                  isLoading={loading}
                  hasCode={!!response}
                  regenerationCount={regenerationCount}
                  maxRegenerations={MAX_REGENERATIONS}
                  code={response}
                />
              </div>
            )}

            {/* Code statistics panel */}
            <AnimatePresence>
              {showStats && response && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                    Code Statistics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-1">
                        <FileCode2 className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Lines of Code
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {codeStats.lines}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-1">
                        <Code className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Characters
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {codeStats.characters}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-1">
                        <Cpu className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Functions
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {codeStats.functions}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-1">
                        <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Quality Score
                        </span>
                      </div>
                      <div className="flex items-center">
                        <p
                          className={`text-2xl font-bold mr-2 ${getQualityColor(
                            codeStats.quality
                          )}`}
                        >
                          {codeStats.quality}/10
                        </p>
                        <div className="flex">
                          {renderQualityStars(codeStats.quality)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Generated with {record?.model || "AI"} on{" "}
                      <ClientDate
                        date={record?.createdAt || Date.now()}
                        format="local"
                        fallback="..."
                      />
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code editor */}
            <div className="h-full">
              {response ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <EnhancedCodeEditor
                    code={response}
                    onCodeChange={handleCodeChange}
                    isLoading={loading}
                  />
                </motion.div>
              ) : (
                !loading &&
                record && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-center py-12">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Sparkles className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        No Code Generated Yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Click "Generate Code" to create code from your image.
                        Our AI will analyze the design and produce the
                        corresponding code.
                      </p>
                      <motion.button
                        onClick={() => record && generateCode(record)}
                        className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                      >
                        <span className="flex items-center">
                          <Code className="h-5 w-5 mr-2" />
                          Generate Code Now
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add CSS for background pattern */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .dark .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
};

export default Page;

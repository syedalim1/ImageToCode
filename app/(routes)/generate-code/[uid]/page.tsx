"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Code,
  Home,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Import,
} from "lucide-react";

// Components
import CodeHeader from "../_components/CodeHeader";
import EnhancedCodeEditor from "../_components/EnhancedCodeEditor";
import StatusNotification from "../_components/StatusNotification";
import ImagePreview from "../_components/ImagePreview";
import ActionButtons from "../_components/ActionButtons";
import DarkModeToggle from "../_components/DarkModeToggle";
import SuccessConfetti from "../_components/SuccessConfetti";
import { db } from "@/configs/db";
import { imagetocodeTable, usersTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import Constants from "@/data/Constants";

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
  const [design, setDesign] = useState<Design | null>(null);
  useEffect(() => {
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
    fetchDesign();
    console.log(design, "design");
  }, [uid]);
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

      const res = await fetch("/api/image-to-code-ai", {
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

      console.log(res, "res");

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
          /```javascript|```typescript|```typescrpt|```jsx|```tsx|```/g,
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

  const Extraimproveai = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if user is logged in first
      if (!user || !user.primaryEmailAddress?.emailAddress) {
        setError("User not found. Please log in to improve code.");
        return;
      }

      // Get user credits from database
      const userdatabase = await db
        .select()
        .from(usersTable)
        .where(
          eq(usersTable.email, user.primaryEmailAddress.emailAddress)
        );

      if (!userdatabase || userdatabase.length === 0) {
        setError("User not found in database. Please log in again.");
        return;
      }

      const currentCredits = userdatabase[0]?.credits ?? 0;

      // Check if user has enough credits
      if (currentCredits < Constants.CREDIT_COSTS.EXPERT_MODE) {
        setError(`You need ${Constants.CREDIT_COSTS.EXPERT_MODE} credits to use Extra Improve AI. You have ${currentCredits} credits.`);
        return;
      }

      // Call API to improve code
      const improvecode = await fetch("/api/googleimprovecode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: response,
          userEmail: user.primaryEmailAddress.emailAddress
        }),
      });

      if (!improvecode.ok) {
        const errorData = await improvecode.json();
        throw new Error(errorData.error || "Request failed");
      }

      // Process response
      const responseData = await improvecode.text();
      let optimizedCode = responseData;

      // Try to parse as JSON if it looks like a JSON response
      try {
        if (
          optimizedCode.trim().startsWith("{") &&
          optimizedCode.includes('"message"')
        ) {
          const parsedData = JSON.parse(optimizedCode);
          if (
            parsedData.choices &&
            parsedData.choices[0] &&
            parsedData.choices[0].message &&
            parsedData.choices[0].message.content
          ) {
            optimizedCode = parsedData.choices[0].message.content;
          }
        }
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
      }

      // Clean up code by removing markdown code blocks if present
      optimizedCode = optimizedCode
        .replace(
          /```(javascript|typescript|jsx|tsx|typescrpt)?/g,
          ""
        )
        .trim();

      // Update state with improved code
      setResponse(optimizedCode);
      setSuccess("Code improved successfully with DeepSeek AI!");
      setRegenerationCount((prev) => prev + 1);

    } catch (err) {
      handleError(err, "Error improving code with DeepSeek AI:");
    } finally {
      setLoading(false);
    }
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

      <div className="p-4  mx-auto">
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
            Generating Code
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
                {response ? (
                  <motion.button
                    onClick={Extraimproveai}
                    className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg transition-all`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Import className="h-5 w-5" />
                    <span className="font-medium text-white">
                      Extra Improve Code
                    </span>
                  </motion.button>
                ) : null}
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

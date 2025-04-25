"use client";

import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
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
import CodeHeader from "../../generate-code/_components/CodeHeader";
import EnhancedCodeEditor from "../../generate-code/_components/EnhancedCodeEditor";
import StatusNotification from "../../generate-code/_components/StatusNotification";
import ImagePreview from "../../generate-code/_components/ImagePreview";
import ActionButtons from "../../generate-code/_components/ActionButtons";
import DarkModeToggle from "../../generate-code/_components/DarkModeToggle";
import SuccessConfetti from "../../generate-code/_components/SuccessConfetti";
import { db } from "@/configs/db";
import { imagetocodeTable, usersTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { LanguageContext } from "@/app/context/LanguageContext";

interface CodeContent {
  content: string;
}

interface CodeRecord {
  id: number;
  uid: string;
  language: string;
  mode: string;
  description: string;
  model: string;
  imageUrl: string;
  code: CodeContent;
  createdAt: string;
  options: Record<string, any>;
  projectTitle: string;
  explanation: string;
}

type APIResponse = Omit<CodeRecord, "code"> & {
  code: string | CodeContent;
};

const MAX_REGENERATIONS = 3;

const Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid || "";
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<CodeRecord | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regenerationCount, setRegenerationCount] = useState(0);
  const { language, setLanguage } = useContext(LanguageContext);

  interface Design {
    id: number;
    uid: string;
    imageUrl: string;
    description: string | null;
    createdAt: string;
    language: string;
    options: string[];
    code: {
      content: string;
    };
    projectTitle: string;
    explanation: string;
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
          // console.log(result[0], "designs");
          setLanguage(result[0].language);
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

    // console.log(design, "design");
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

      // Create object to accumulate streamed content
      let accumulatedContent = "";
      let projectTitle = "";
      let explanation = "";
      let parsedData = null;

      // Make the POST request with streaming response handling
      const response = await fetch("/api/image-to-code-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: record.description,
          imageUrl: record.imageUrl,
          mode: record.mode,
          options: record.options,
          model: record.model,
          language: record.language,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} - ${errorText}`
        );
      }

      // Check if response is streamed
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("text/event-stream")) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response stream reader");
        }

        const decoder = new TextDecoder();

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Process SSE format (Server-Sent Events)
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              // Skip [DONE] message
              if (data === "[DONE]") continue;

              try {
                // Parse the JSON data from the stream
                const parsedChunk = JSON.parse(data);

                if (parsedChunk.content) {
                  // Accumulate content
                  accumulatedContent += parsedChunk.content;
                  // Update the response state progressively
                  setResponse((prev) => prev + parsedChunk.content);
                } else if (parsedChunk.error) {
                  throw new Error(parsedChunk.error);
                } else if (parsedChunk.complete && parsedChunk.fullContent) {
                  // Final message with complete content
                  accumulatedContent = parsedChunk.fullContent;
                  setResponse(parsedChunk.fullContent);
                }
              } catch (parseError) {
                console.warn("Error parsing stream chunk:", parseError);
                // If we couldn't parse as JSON, treat it as raw text
                if (data && data !== "[DONE]") {
                  accumulatedContent += data;
                  setResponse((prev) => prev + data);
                }
              }
            }
          }
        }

        // Process the accumulated content after stream is complete
        try {
          parsedData = JSON.parse(accumulatedContent);
          projectTitle = parsedData?.projectTitle || "";
          explanation = parsedData?.explanation || "";
        } catch (e) {
          // If not valid JSON, use as is
          console.log(
            "Accumulated content is not valid JSON, using as raw text"
          );
        }
      } else {
        // Handle non-streaming response (fallback)
        const res = await response.json();

        // Extract the content from the response
        let codeContent;

        // Handle different response formats
        if (res && typeof res === "object") {
          // If response is an object with content property
          if (res.content) {
            codeContent = res.content;
            // Try to parse if it's a stringified JSON
            try {
              if (typeof codeContent === "string") {
                parsedData = JSON.parse(codeContent);
              } else {
                parsedData = codeContent;
              }
            } catch (e) {
              // If not valid JSON, use as is
              parsedData = null;
            }
            setResponse(
              typeof codeContent === "string"
                ? codeContent
                : JSON.stringify(codeContent)
            );
            accumulatedContent =
              typeof codeContent === "string"
                ? codeContent
                : JSON.stringify(codeContent);
          } else {
            // If it's already the code object
            parsedData = res;
            codeContent = JSON.stringify(res);
            setResponse(codeContent);
            accumulatedContent = codeContent;
          }
        } else if (typeof res === "string") {
          // If response is a string
          codeContent = res;
          // Try to parse if it's a stringified JSON
          try {
            parsedData = JSON.parse(codeContent);
          } catch (e) {
            // If not valid JSON, use as is
            parsedData = null;
          }
          setResponse(codeContent);
          accumulatedContent = codeContent;
        }

        // Extract metadata
        projectTitle = parsedData?.projectTitle || "";
        explanation = parsedData?.explanation || "";
      }

      // console.log("Saving to database with:", {
      //   projectTitle,
      //   explanation,
      // });

      // Update the database with the new code
      await axios.put("/api/codetoimage", {
        uid: uid,
        code: { content: accumulatedContent },
        projectTitle: projectTitle,
        explanation: explanation,
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

  return (
    <div className="min-h-screen transition-colors duration-300">
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
            <Home className="h-7 w-7 mr-1" />
            <span className="text-xl font-bold">Home</span>
          </button>
          <ChevronRight className="h-7 w-7 text-gray-400" />
          <button
            onClick={() => router.push("/designs")}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <span className="text-xl font-bold">Designs</span>
          </button>
          <ChevronRight className="h-7 w-7 text-gray-400" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            <span className="text-xl font-bold">Generating Code</span>
          </span>
        </nav>

        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center mb-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-7 w-7 mr-1" />
          <span className="text-xl font-bold">Back</span>
        </motion.button>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white  dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
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

            {/* Code editor */}
            <div className="h-full">
              {design ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <EnhancedCodeEditor
                    code={response || design?.code.content}
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

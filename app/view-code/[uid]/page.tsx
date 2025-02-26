"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import { useUser } from "@clerk/nextjs";

interface CodeContent {
  content: string;
}

interface Record {
  id: number;
  uid: string;
  description: string;
  model: string;
  imageUrl: string;
  code: CodeContent;
  createdAt: string;
  options: globalThis.Record<string, any>;
}

type APIResponse = Omit<Record, "code"> & {
  code: string | CodeContent;
};

// Custom hook to capture code changes
function CodeEditorWithCapture({
  setCode,
}: {
  setCode: (code: string) => void;
}) {
  const { code, updateCode } = useActiveCode();

  // Update the parent component's state when code changes
  React.useEffect(() => {
    setCode(code);
  }, [code, setCode]);

  return (
    <SandpackCodeEditor
      style={{
        minWidth: "100%",
        height: "500px", // Increase the height
      }}
      showLineNumbers
      showTabs
    />
  );
}

function Page() {
  const params = useParams();
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [record, setRecord] = useState<Record | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  useEffect(() => {
    if (uid) {
      getRecordInfo(uid);
    }
  }, [uid]);

  const getRecordInfo = async (uid: string) => {
    setLoading(true);
    try {
      console.log("🔍 Fetching record for UID:", uid);
      const res = await axios.get(`/api/codetoimage?uid=${uid}`);
      const data: APIResponse = res.data;

      console.log("📥 Received data:", data);

      // Normalize the record structure to ensure code is always a CodeContent object
      const normalizedRecord: Record = {
        ...data,
        code:
          typeof data.code === "string"
            ? { content: data.code }
            : data.code && typeof data.code === "object"
            ? (data.code as CodeContent)
            : { content: "" },
      };

      setRecord(normalizedRecord);

      // Extract and set the code content based on its format
      if (typeof data.code === "string") {
        const cleanedCode = data.code.replace(/```javascript|```/g, "").trim();
        setResponse(cleanedCode);
        console.log("📝 Set response from string code");
      } else if (
        data.code &&
        typeof data.code === "object" &&
        "content" in data.code
      ) {
        setResponse(data.code.content);
        console.log("📝 Set response from code.content");
      } else {
        console.log("⚠️ No code content found in the database");
        setError(
          "No code content found for this design. Please use the Generate button to create code."
        );
      }
    } catch (error) {
      console.error("❌ Error fetching record:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        setError(`Error fetching record: ${errorMessage}`);
      } else {
        setError("Error fetching record. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (record: Record): Promise<void> => {
    try {
      setLoading(true);
      setResponse("");
      setError("");

      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: record.description,
          imageUrl: record.imageUrl,
          model: record.model,
          options: record.options,
          userEmail: user?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      let generatedCode = "";

      console.log("Content Type:", contentType);
      if (contentType?.includes("application/json")) {
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          generatedCode = data.choices[0].message.content;
          console.log("Generated Code (JSON):", generatedCode);
          setResponse(
            generatedCode.replace("```javascript", "").replace("```", "")
          );
        } else {
          throw new Error("Unexpected response format");
        }
      } else if (contentType?.includes("text/plain")) {
        generatedCode = await res.text();
        console.log("Generated Code (text/plain):", generatedCode);
        setResponse(generatedCode);
      } else if (contentType?.includes("text/event-stream")) {
        if (!res.ok || !res.body) {
          const errorText = await res.text();
          throw new Error(`API Error: ${errorText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          generatedCode += chunk;
          setResponse((prev) => prev + chunk);
        }

        console.log("Generated Code (text/event-stream):", generatedCode);
        try {
          await axios.put("/api/codetoimage", {
            uid: uid,
            description: record.description,
            imageUrl: record.imageUrl,
            code: generatedCode, // Use generatedCode
            model: record.model,
            email: user?.primaryEmailAddress?.emailAddress || "",
            options: record.options || {},
          });
        } catch (putError) {
          console.error("Error in PUT to /api/codetoimage:", putError);
          console.log("UID used in codetoimage PUT:", uid);
        }
      } else {
        throw new Error("Unsupported content type");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setError(
        error instanceof Error ? error.message : "Error generating code"
      );
    } finally {
      setLoading(false);
      // Don't call handleUpdateCode here to avoid recursive loop
      // The code is already updated in the PUT to /api/codetoimage above
    }
  };

  // Clear success message after a few seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleUpdateCode = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      console.log("🔄 handleUpdateCode - uid:", uid);

      // Ensure we have all required data
      if (!uid || !response) {
        console.error("❌ Missing required data for update:", {
          uid,
          responseLength: response?.length,
        });
        setError("Missing required data for update");
        return;
      }

      console.log("📤 Sending PUT to update-code:", {
        uid: uid,
        codeLength: response?.length,
        email: user?.primaryEmailAddress?.emailAddress || "",
      });

      const res = await axios.put("/api/update-code", {
        uid: uid,
        code: response,
        email: user?.primaryEmailAddress?.emailAddress || "",
      });

      console.log("✅ Code updated successfully:", res.data);
      setSuccess("Code saved successfully to database!");

      // Refresh the record to ensure we have the latest data
      await getRecordInfo(uid);
    } catch (error) {
      console.error("❌ Error updating code:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        setError(
          `Error updating code: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        setError("Error updating code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
            Code Generation Studio
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Transform your ideas into executable code with AI-powered generation
        </p>
      </header>

      <div className="space-y-6">
        {loading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center space-x-3">
            <div className="animate-spin text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Crafting your code...
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                This typically takes 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-3">
            <div className="text-red-600 dark:text-red-400 pt-1">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">
                Generation Error
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              <button
                onClick={() => record && generateCode(record)}
                className="mt-2 text-sm text-red-800 dark:text-red-200 hover:underline"
              >
                Retry Generation
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start space-x-3">
            <div className="text-green-600 dark:text-green-400 pt-1">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Success
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                {success}
              </p>
            </div>
          </div>
        )}

        <div className="h-full">
          {response && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleUpdateCode}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-[1.02] shadow-md flex items-center space-x-2"
                  disabled={loading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span>Save Code to Database</span>
                </button>
              </div>
              <div className="relative">
                <div className="p-6">
                  <SandpackProvider
                    options={{
                      externalResources: ["https://cdn.tailwindcss.com"],
                      classes: {
                        "sp-wrapper":
                          "custom-wrapper rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700",
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
                      "/App.js": response,
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
                <div className="absolute top-0 right-0 p-2 bg-yellow-100 text-yellow-800 text-xs rounded-bl-md">
                  Note: Click "Save Code to Database" after making changes
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && !response && record && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600 dark:text-yellow-400 pt-1">
                  <svg
                    className="w-5 h-5"
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
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    No Code Available
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    This design doesn't have any code associated with it yet.
                    Generate code to get started.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => generateCode(record)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Generate Production-Ready Code</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;

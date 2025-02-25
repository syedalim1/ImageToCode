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
} from "@codesandbox/sandpack-react";

import { useUser } from "@clerk/nextjs";

interface CodeContent {
  content: string;
}

interface RECORD {
  id: number;
  uid: string;
  description: string;
  model: string;
  imageUrl: string;
  code: CodeContent;
  createdAt: string;
  options: Record<string, any>;
}

type APIResponse = Omit<RECORD, "code"> & {
  code: string | CodeContent;
};

function Page() {
  const params = useParams();
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [record, setRecord] = useState<RECORD | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (uid) {
      GetRecordInfo(uid);
      console.log(uid, " uid ");
    }
    9;
  }, [uid]);

  const GetRecordInfo = async (uid: string) => {
    setLoading(true);
    try {
      console.log(uid, " Uid ");

      const res = await axios.get(`/api/codetoimage?uid=${uid}`);
      const data: APIResponse = res.data;
      // Convert legacy string code to CodeContent format
      const normalizedRecord: RECORD = {
        ...data,
        code:
          typeof data.code === "string"
            ? { content: data.code }
            : (data.code as CodeContent),
      };

      setRecord(normalizedRecord);
      console.log(normalizedRecord, " Data console ");

      if (typeof data.code === "string") {
        setResponse(data.code.replace("```javascript", "").replace("```", ""));
      } else if ("content" in data.code) {
        setResponse(data.code.content);
      } else {
        await GenerateCode(normalizedRecord);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      setError("Error fetching record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GenerateCode = async (record: RECORD): Promise<void> => {
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
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const contentType = res.headers.get("content-type");
      let generatedCode = "";
      if (contentType?.includes("application/json")) {
        const data = await res.json();

        if (data.choices?.[0]?.message?.content) {
          generatedCode = data.choices[0].message.content;
          setResponse(generatedCode);
        } else {
          throw new Error("Unexpected response format");
        }
      } else if (contentType?.includes("text/plain")) {
        generatedCode = await res.text();
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

        const result = await axios.post("/api/codetoimage", {
          uid: uid,
          description: record.description,
          imageUrl: record.imageUrl,
          code: response, // Store code as JSON object
          model: record.model,
          email: user?.primaryEmailAddress?.emailAddress || "",
          options: record.options || {},
        });

        console.log("✅ Success:", result.data);
        console.log(response, " response ");
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
      const result = await axios.put("/api/codetoimage", {
        uid: uid,
        description: record.description,
        imageUrl: record.imageUrl,
        code: response, // Store code as JSON object
        model: record.model,
        email: user?.primaryEmailAddress?.emailAddress || "",
        options: record.options || {},
      });
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

      <section className="space-y-6">
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
                onClick={() => record && GenerateCode(record)}
                className="mt-2 text-sm text-red-800 dark:text-red-200 hover:underline"
              >
                Retry Generation
              </button>
            </div>
          </div>
        )}

        <div className="h-full">
          {response && (
            <SandpackProvider
              options={{
                externalResources: ["https://cdn.tailwindcss.com"],
                classes: {
                  "sp-wrapper": "custom-wrapper",
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
                "/App.js": `${response}`,
              }}
              theme="light"
              template="react"
            >
              <SandpackLayout>
                <SandpackCodeEditor
                  style={{ minWidth: "100%" }}
                  showLineNumbers
                  showTabs
                />
                <SandpackPreview />
              </SandpackLayout>
            </SandpackProvider>
          )}
        </div>

        {!loading && !response && record && (
          <button
            onClick={() => GenerateCode(record)}
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
        )}
      </section>
    </div>
  );
}

export default Page;

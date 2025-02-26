"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Components
import CodeHeader from "../_components/CodeHeader";
import EnhancedCodeEditor from "../_components/EnhancedCodeEditor";
import StatusNotification from "../_components/StatusNotification";
import ImagePreview from "../_components/ImagePreview";
import ActionButtons from "../_components/ActionButtons";

interface CodeContent {
  content: string;
}

interface CodeRecord {
  id: number;
  uid: string;
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
  const { user } = useUser();
  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<CodeRecord | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regenerationCount, setRegenerationCount] = useState(0);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      let codeContent = typeof data.code === "string" 
        ? data.code 
        : data.code?.content || "";
      
      // Try to parse the code if it's a JSON string containing AI response
      try {
        if (codeContent.trim().startsWith('{') && codeContent.includes('"message"')) {
          const parsedData = JSON.parse(codeContent);
          
          // Check if this is an AI response with content
          if (parsedData.choices && 
              parsedData.choices[0] && 
              parsedData.choices[0].message && 
              parsedData.choices[0].message.content) {
            
            // Extract the actual code from the AI response
            codeContent = parsedData.choices[0].message.content;
          }
        }
      } catch (e) {
        console.error("Failed to parse code as JSON:", e);
        // If parsing fails, continue with the original code
      }
      
      // Clean up the code content - remove markdown code blocks
      setResponse(codeContent.replace(/```javascript|```typescript|```typescrpt|```/g, "").trim() || "");
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
    if (regenerationCount >= MAX_REGENERATIONS) {
      setError("Maximum regenerations reached");
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      setError("");

      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: record.description,
          imageUrl: record.imageUrl,
          model: record.model,
          options: record.options,
          userEmail: user?.primaryEmailAddress?.emailAddress || "",
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
        
        // Try to extract code from JSON if it looks like a JSON response
        try {
          if (generatedCode.trim().startsWith('{') && generatedCode.includes('"message"')) {
            const parsedData = JSON.parse(generatedCode);
            
            if (parsedData.choices && 
                parsedData.choices[0] && 
                parsedData.choices[0].message && 
                parsedData.choices[0].message.content) {
              
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
      const cleanedCode = finalCode.replace(/```javascript|```typescript|```typescrpt|```/g, "").trim();

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
      const formattedCode = typeof response === 'string' 
        ? { content: response } 
        : (response || { content: '' });

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

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-screen">
      <CodeHeader {...record} />

      <div className="space-y-2 mb-6">
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

      {record && (
        <div className="flex flex-wrap justify-between items-center mb-6">
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

      <div className="h-full">
        {response ? (
          <EnhancedCodeEditor
            code={response}
            onCodeChange={(newCode) => {
              if (typeof newCode === 'string') {
                setResponse(newCode);
              } else if (typeof newCode === 'object' && newCode !== null && 'content' in newCode) {
                setResponse(newCode.content);
              }
            }}
            isLoading={loading}
          />
        ) : (
          !loading &&
          record && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No code available. Click "Generate Code" to create code from your image.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Page;

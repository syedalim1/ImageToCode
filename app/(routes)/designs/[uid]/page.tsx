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

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: string;
  description: string | null;
  createdAt: string;
  options: unknown;
}

export default function Page() {
  const params = useParams();

  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;

  const [designs, setDesigns] = useState<Design>(); // ✅ Fixed: Array of Designs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (uid) {
      fetchDesigns();
    }
  }, [uid]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await db
        .select()
        .from(imagetocodeTable)
        .where(eq(imagetocodeTable.uid, uid ?? ""))
        .orderBy(desc(imagetocodeTable.createdAt));

      setDesigns(result[1] as Design); // ✅ Ensure result is an array
      console.log(result, "designs");
    } catch (err) {
      setError("Failed to fetch designs. Please try again later.");
      console.error("Error fetching designs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Designs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          <li key={designs?.uid}>
            <h2>{designs?.description}</h2>
            {typeof designs?.code === "function" ||
            typeof designs?.code === "string" ? (
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
                  "/App.js": `${designs?.code}`,
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
            ) : null}
          </li>
        </ul>
      )}
    </div>
  );
}

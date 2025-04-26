"use client";

import { useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { sendErrorToAI } from "@/app/utils/sandpackErrorHandler";

interface SandpackMessage {
    type: string;
    codesandbox: boolean;
    data: any;
}

export default function SandpackErrorListener() {
    const { listen, sandpack } = useSandpack();

    useEffect(() => {
        // Subscribe to all Sandpack messages
        const unsubscribe = listen((msg: SandpackMessage) => {
            // Check for error messages
            if (msg.type === "compile-error" || msg.type === "runtime-error" || msg.type === "error") {
                console.log(`Sandpack ${msg.type} detected:`, msg.data);

                // Forward to AI
                sendErrorToAI({
                    source: msg.type === "compile-error" ? "compiler" : "runtime",
                    error: msg.data,
                    file: sandpack.activeFile
                });
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [listen, sandpack.activeFile]);

    // This component doesn't render anything
    return null;
}

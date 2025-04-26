import { toast } from "react-hot-toast";

// Helper function to send errors to AI endpoint
export async function sendErrorToAI(payload: {
    source: string;
    error: any;
    stack?: any;
    file?: string
}) {
    try {
        const res = await fetch("/api/ai/handle-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("AI response:", result);

        // Show a toast notification with the AI suggestion if available
        if (result?.suggestion) {
            toast(result.suggestion, {
                icon: "💡",
                duration: 6000,
                style: {
                    background: "#333",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #555",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                },
            });
        }

        return result;
    } catch (e) {
        console.error("Failed to send error to AI:", e);
        return null;
    }
}

// Handle runtime logs/errors from console
export function handleRuntimeLog(log: {
    type: string;
    message: string;
    trace?: any
}) {
    if (log.type === "error") {
        console.log("Runtime error detected:", log.message);

        // Forward runtime errors to AI
        sendErrorToAI({
            source: "runtime",
            error: log.message,
            stack: log.trace
        });
    }
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify"; // Import ToastContainer

export const metadata: Metadata = {
  title: "Image to Code - AI Powered Design to Code Conversion",
  description: "Transform your designs into production-ready code with AI",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.error(
      "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable"
    );
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <html lang="en" className="scroll-smooth">
        <head>
        
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body>
          <Provider>
            {children}
            <ToastContainer position="bottom-right" theme="colored" />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientLayout } from "./_components/ClientLayout";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

// Optimize font loading - simplified for development
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: "#4F46E5",
};

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
          {/* PWA tags */}
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            <ClientLayout>
              {children}
              <ToastContainer position="bottom-right" theme="colored" /> {/* Add ToastContainer */}
            </ClientLayout>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

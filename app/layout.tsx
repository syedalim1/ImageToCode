import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify"; // Import ToastContainer

export const metadata: Metadata = {
  title: "ImageToCode | #1 AI Design to Code Generator Tool | CodeNovaTech",
  description:
    "Transform designs into code with ImageToCodeGenerator AI. Convert images to HTML, CSS, React & Next.js code instantly. Best AI prompt to code service by CodeNovaTech.",
  keywords: [
    "ImageToCodeGenerator",
    "AI design to code",
    "image to code converter",
    "AI prompt to code",
    "design to HTML",
    "UI design converter",
    "HTML generator",
    "CSS generator",
    "React code generator",
    "Next.js generator",
    "CodeNovaTech",
    "AI development tools",
    "mockup to html",
    "screenshot to code",
    "image to react",
    "UI automation",
    "free design to code",
    "design to frontend",
  ],
  authors: [{ name: "CodeNovaTech" }],
  creator: "CodeNovaTech",
  publisher: "CodeNovaTech",
  openGraph: {
    title: "ImageToCode | #1 AI Design to Code Generator Tool",
    description:
      "Transform any UI designs into production-ready HTML/CSS/React code with our AI. Start for free today. Best design to code converter. Created by CodeNovaTech.",
    url: "https://imagetocode.codenovatech.in",
    siteName: "ImageToCode by CodeNovaTech",
    images: [
      {
        url: "logo.png",
        width: 1200,
        height: 630,
        alt: "ImageToCode AI Generator - Transform Designs to Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageToCode | #1 AI Design to Code Generator Tool",
    description:
      "Transform any UI designs into production-ready HTML/CSS/React code with our AI. Start for free today. The fastest way to convert designs to code.",
    images: ["logo.png"],
    creator: "@CodeNovaTech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_code", // Replace with your actual verification code
    yandex: "yandex_verification", // Optional: Add if you use Yandex
    other: { name: "msvalidate.01", content: "bing_verification" }, // Bing verification
  },
  alternates: {
    canonical: "https://imagetocode.codenovatech.in",
  },
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
          <link rel="icon" href="logo.png" />
          <link rel="apple-touch-icon" href="logo.png" />
          <link rel="manifest" href="manifest.json" />
          <meta name="application-name" content="ImageToCode" />
          <meta name="msapplication-TileImage" content="logo.png" />
          <meta name="theme-color" content="#9333ea" />

          {/* Schema.org structured data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ImageToCode",
              alternateName: "ImageToCodeGenerator",
              description:
                "Transform designs into code with ImageToCodeGenerator AI. Convert images to HTML, CSS & React code instantly. Best AI prompt to code service by CodeNovaTech.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "156",
                bestRating: "5",
                worstRating: "1",
              },
              featureList:
                "AI-powered design recognition, HTML/CSS generation, React/Next.js conversion, responsive design, export options",
              screenshot: "https://imagetocode.codenovatech.in/screenshot.png",
              creator: {
                "@type": "Organization",
                name: "CodeNovaTech",
                url: "https://imagetocode.codenovatech.in",
                logo: {
                  "@type": "ImageObject",
                  url: "https://imagetocode.codenovatech.in/logo.png",
                },
              },
            })}
          </script>
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

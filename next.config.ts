import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm", "@neondatabase/serverless"],

  // Image optimization
  images: {
    domains: [
      "randomuser.me",
      "placehold.co",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },

  // Basic configuration
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["tsx", "ts", "jsx", "js"],

  // Simplified experimental options
  experimental: {
    optimizePackageImports: ["framer-motion", "@clerk/nextjs"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Add response headers for better performance
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=60",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

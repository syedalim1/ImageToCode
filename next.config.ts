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

  // Compression
  compress: true,

  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Improve page transitions
  pageExtensions: ["tsx", "ts", "jsx", "js"],

  // Production optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "@clerk/nextjs"],
    optimisticClientCache: true, // Enhance client-side transitions
    serverActions: {
      bodySizeLimit: "2mb",
    },
    webVitalsAttribution: ["CLS", "LCP"], // Monitor core web vitals
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        minimize: true,
        concatenateModules: true,
      };

      // Handle punycode deprecation
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };

      // Speed up builds and improve caching
      if (config.cache) {
        config.cache = {
          ...config.cache,
          type: "filesystem",
          cacheDirectory: ".next/cache",
          compression: false, // Faster at the cost of more disk space
        };
      }
    }

    return config;
  },

  // Faster redirects by returning HTTP headers for redirect instead of
  // rendering a page which then redirects
  redirects: async () => {
    return [
      // Add your redirects here
    ];
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

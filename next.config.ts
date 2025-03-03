import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm", "@neondatabase/serverless"],
  
  // Image optimization
  images: {
    domains: [
      'randomuser.me', 
      'placehold.co',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Compression
  compress: true,

  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Production optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@clerk/nextjs'],
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
      };

      // Handle punycode deprecation
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }

    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

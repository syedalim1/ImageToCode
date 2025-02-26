import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm", "@neondatabase/serverless"],
};

export default nextConfig;

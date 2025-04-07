import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm",
useFileSystemPublicRoutes: false,
 "@neondatabase/serverless"],
  trailingSlash: true, // Optional: Avoid 404s for subpages
};

export default nextConfig;

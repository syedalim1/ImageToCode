import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["drizzle-orm", "@neondatabase/serverless"],
  trailingSlash: true, // Optional: Avoid 404s for subpages
};
module.exports = {
  amplify: {
    timeout: 60, // Increases timeout to 60 seconds (max allowed)
  },
};

export default nextConfig;

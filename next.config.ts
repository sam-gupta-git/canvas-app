import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove webpack config for Turbopack compatibility
  // The canvas module will be handled by dynamic imports
};

export default nextConfig;

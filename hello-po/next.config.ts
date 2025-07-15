import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      // Enable Turbopack for faster development builds
      rules: {
        // You can add custom rules here if needed
      }
    }
  }
};

export default nextConfig;

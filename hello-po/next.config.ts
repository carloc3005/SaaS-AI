import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build for faster deployment
    ignoreBuildErrors: true,
  },
  turbopack: {
    // Enable Turbopack for faster development builds
    rules: {
      // You can add custom rules here if needed
    }
  }
};

export default nextConfig;

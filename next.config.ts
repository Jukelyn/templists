import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;

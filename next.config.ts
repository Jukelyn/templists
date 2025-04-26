import type { NextConfig } from "next";
import MillionLint from "@million/lint";

const nextConfig: NextConfig = {
  // experimental: {
  //   reactCompiler: true,
  // },
  turbopack: {},
  devIndicators: false,
  output: "standalone",
};

export default MillionLint.next({ rsc: true })(nextConfig);

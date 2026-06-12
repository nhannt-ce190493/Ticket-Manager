import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev tools (HMR, fonts) to be loaded from alternative localhost addresses
  // used by automated browser agents and tools.
  allowedDevOrigins: ['127.0.0.1', '[::1]', 'localhost.'],
};

export default nextConfig;

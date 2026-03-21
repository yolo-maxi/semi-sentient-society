import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily disable type checking during builds
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    "@buildersgarden/siwa",
    "@circle-fin/developer-controlled-wallets",
    "@openfort/openfort-node",
  ],
};

export default nextConfig;

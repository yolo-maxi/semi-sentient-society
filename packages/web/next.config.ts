import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@buildersgarden/siwa",
    "@circle-fin/developer-controlled-wallets",
    "@openfort/openfort-node",
  ],
};

export default nextConfig;

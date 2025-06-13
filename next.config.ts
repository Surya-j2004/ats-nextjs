import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  experimental: {
    serverComponentsExternalPackages: [
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-request-presigner"
    ],
  },
};

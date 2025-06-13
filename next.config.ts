/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds (fix issues locally)
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner'
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@aws-sdk/client-s3': 'commonjs @aws-sdk/client-s3',
        '@aws-sdk/s3-request-presigner': 'commonjs @aws-sdk/s3-request-presigner'
      });
    }
    return config;
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["finance.yahoo.com", "s.yimg.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["yahoo-finance2"],
  },
};

module.exports = nextConfig;

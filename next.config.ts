import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "bcfarmersmarkettrail.com" },
      { hostname: "staging.bcfarmersmarkettrail.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.mangozero.com" },
      { protocol: "https", hostname: "mangozero.com" },
      { protocol: "https", hostname: "cdn.mangozero.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default nextConfig;

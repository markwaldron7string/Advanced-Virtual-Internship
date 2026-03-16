import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "images.summarist.ai",
      "summarist.ai",
    ],
  },
};

export default nextConfig;
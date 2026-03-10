import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - Next.js 15+ may warn about this being an unknown property
    allowedDevOrigins: ["192.168.29.78:3000", "192.168.29.78"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Opening the dev server from a phone on the same wifi is how the intro
     animation and the mobile layouts actually get checked, and Next blocks
     cross-origin dev requests by default. Dev-only: it has no effect on a
     production build. */
  allowedDevOrigins: ["192.168.1.9"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

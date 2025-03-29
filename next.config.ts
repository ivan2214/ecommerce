import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
      },
    ],
  },
  allowedDevOrigins: ["https://a207-131-221-65-95.ngrok-free.app/"],
};

export default nextConfig;

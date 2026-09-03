import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
let apiHost = "localhost";
let apiPort = "3000";
let apiProtocol: "http" | "https" = "http";

try {
  const parsed = new URL(apiUrl);
  apiHost = parsed.hostname;
  apiPort = parsed.port;
  apiProtocol = parsed.protocol.replace(":", "") as "http" | "https";
} catch {
  // fallback to defaults
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHost,
        ...(apiPort ? { port: apiPort } : {}),
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;


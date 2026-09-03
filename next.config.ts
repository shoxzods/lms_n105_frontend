import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Figma dan eksport qilingan ikonkalar SVG — ular public/ ichida, o'zimizniki
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",

    /**
     * Next.js 16 da yangi cheklov: localhost va ichki IP manzillardagi
     * rasmlar `remotePatterns` ga mos kelsa ham bloklanadi (SSRF himoyasi).
     * Backend shu kompyuterda turgani uchun ruxsat berish shart.
     *
     * Ishlab chiqarishda backend boshqa domenda bo'ladi — o'shanda bu
     * qatorni olib tashlash kerak.
     */
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      {
        // Backend yuklagan rasm va videolar: http://localhost:3000/uploads/...
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

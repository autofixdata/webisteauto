import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com", pathname: "/w20/**" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space", pathname: "/Ojp9CgccP9bDnBtQ25kU/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap-index',
      },
    ];
  },
};

export default nextConfig;

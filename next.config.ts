import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ["lucide-react"] },
  async redirects() {
    return [
      { source: "/concepts", destination: "/", permanent: true },
      { source: "/concepts/:concept", destination: "/", permanent: true },
      { source: "/concepts/:concept/records/:id", destination: "/records/:id", permanent: true },
      { source: "/concepts/:concept/submit", destination: "/submit", permanent: true },
    ];
  },
};

export default nextConfig;

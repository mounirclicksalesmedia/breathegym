import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smallest), fall back to WebP, then the original.
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities on this allowlist (default is just 75).
    // 88 is used by the gallery for crisper club photos.
    qualities: [75, 88],
    // Cache optimized images at the edge for a year (sources are immutable).
    minimumCacheTTL: 31536000,
  },
  experimental: {
    // lucide-react & recharts are auto-optimized; framer-motion is not, so
    // tree-shake its named imports to shrink the client bundle.
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;

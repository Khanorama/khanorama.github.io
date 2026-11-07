import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files, so the whole app ships as a static export.
  output: "export",
  // next/image optimization needs a server; unavailable on Pages.
  images: { unoptimized: true },
  // Emit /path/index.html so Pages resolves routes without a rewrite layer.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;

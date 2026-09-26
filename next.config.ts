import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // inlineCss: most visitors arrive fresh from search, so skip the render-blocking stylesheet request.
  experimental: { globalNotFound: true, inlineCss: true },
};

export default nextConfig;

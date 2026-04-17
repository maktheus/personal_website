import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "personal_website";

const nextConfig: NextConfig = {
  output: "export",
  // Use basePath only when deploying to GitHub Pages (not on custom domain)
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

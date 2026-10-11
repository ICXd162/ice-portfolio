/** @type {import('next').NextConfig} */
// On GitHub Pages the site lives under /<repo>, so the workflow sets NEXT_PUBLIC_BASE_PATH=/ice-portfolio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};
export default nextConfig;

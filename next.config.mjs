/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js resolves the correct monorepo/workspace root when multiple lockfiles exist
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

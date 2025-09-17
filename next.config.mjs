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
  // Enable webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Reduce bundle size by excluding unnecessary modules
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }
    
    return config;
  },
  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
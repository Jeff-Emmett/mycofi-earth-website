/** @type {import('next').NextConfig} */
const nextConfig = {
  // Changed from 'export' to 'standalone' for Docker deployment
  output: 'standalone',
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

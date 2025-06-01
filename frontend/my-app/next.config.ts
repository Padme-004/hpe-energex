import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds:  process.env.NODE_ENV === 'production', // Disables ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: Disables TypeScript errors too
  },
  // ... your other configs
}

export default nextConfig
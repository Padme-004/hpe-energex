import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds:  true, // Disables ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: Disables TypeScript errors too
  },
  // ... your other configs
}

export default nextConfig
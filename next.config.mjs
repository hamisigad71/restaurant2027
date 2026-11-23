/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
    optimizePackageImports: [
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      '@heroicons/react/20/solid',
      '@heroicons/react',
      '@tabler/icons-react',
      '@phosphor-icons/react',
      'recharts',
      'date-fns',
    ],
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

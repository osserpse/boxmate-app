/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase from default 1MB to 5MB
    },
  },
  images: {
    domains: [
      'ifmlvwtezadtafcgwspq.supabase.co',
      '*.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig

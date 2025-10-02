/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase from default 1MB to 5MB
    },
  },
}

module.exports = nextConfig

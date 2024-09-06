/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/article/edit',
        destination: '/404'
      }
    ]
  }
}

export default nextConfig

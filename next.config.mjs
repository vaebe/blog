/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: '/rss',
        destination: '/api/feed.xml'
      },
      {
        source: '/rss.xml',
        destination: '/api/feed.xml'
      },
      {
        source: '/feed',
        destination: '/api/feed.xml'
      }
    ]
  }
}

export default nextConfig

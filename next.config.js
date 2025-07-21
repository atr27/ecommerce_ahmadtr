/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.freetogame.com',
      },
      {
        protocol: 'http',
        hostname: 'apollo2.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'apollo2.dl.playstation.net',
      },
      {
        protocol: 'http',
        hostname: 'apollo3.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'apollo3.dl.playstation.net',
      },
      {
        protocol: 'http',
        hostname: 'apollo4.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'apollo4.dl.playstation.net',
      },
      {
        protocol: 'https',
        hostname: 'store.playstation.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
      }
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig

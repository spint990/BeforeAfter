/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Vercel Blob storage
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
      // Public folder uploads (local development)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;

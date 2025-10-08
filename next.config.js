/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-mockup.onrender.com',
        port: '',
        pathname: '/**',
      },
      // Agrega otros dominios que uses para imágenes
    ],
  },
}

module.exports = nextConfig

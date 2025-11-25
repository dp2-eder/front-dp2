/** @type {import('next').NextConfig} */

// Extraer hostname de la URL del backend desde variables de entorno
const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
const getBackendHostname = () => {
  if (!apiUrl) return null
  try {
    const url = new URL(apiUrl)
    return url.hostname
  } catch {
    return null
  }
}

const backendHostname = getBackendHostname()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      ...(backendHostname ? [{
        protocol: 'https',
        hostname: backendHostname,
        port: '',
        pathname: '/**',
      }] : []),
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimizaciones de rendimiento
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compresión y optimización
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig

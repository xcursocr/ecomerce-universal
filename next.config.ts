import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.domcloud.io', // Permite subdominios de domcloud
      },
      {
        protocol: 'https',
        hostname: '*.domcloud.dev', // Tu dominio actual
      },

      // Agrega otros dominios si usas imágenes de prueba (ej: unsplash)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
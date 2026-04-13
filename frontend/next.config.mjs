/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com"
      },
      {
        protocol: "https",
        hostname: "letsflytravel.vn"
      },
      {
        protocol: "https",
        hostname: "www.letsflytravel.vn"
      },
      {
        protocol: "https",
        hostname: "i0.wp.com"
      },
      {
        protocol: "https",
        hostname: "i1.wp.com"
      },
      {
        protocol: "https",
        hostname: "i2.wp.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;

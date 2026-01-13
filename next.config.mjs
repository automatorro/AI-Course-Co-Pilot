/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  images: {
    unoptimized: true, // For now, to simplify migration if we use standard img tags or if Vercel constraints apply
  },
};

export default nextConfig;

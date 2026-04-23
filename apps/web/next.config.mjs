/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/optimization-algos",
        destination: "/optimisation-algos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

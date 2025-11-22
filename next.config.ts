import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Externalize problematic packages for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        pino: false,
        'pino-pretty': false,
      };
      
      config.externals.push('pino', 'thread-stream');
    }

    return config;
  },
  
  // This tells Next.js to treat these as external packages
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
import path from 'node:path';

const stub = path.resolve('./src/stubs/missing-optional-dep.js');

const optionalWagmiDeps = [
  'accounts$',
  '@walletconnect/ethereum-provider$',
  'porto$',
  'porto/internal$',
  '@base-org/account$',
  '@coinbase/wallet-sdk$',
  '@safe-global/safe-apps-sdk$',
  '@safe-global/safe-apps-provider$',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(optionalWagmiDeps.map((dep) => [dep, stub])),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
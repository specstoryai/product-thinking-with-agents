import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle WASM files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Fix for "Can't resolve 'wbg'" error
    config.resolve.alias = {
      ...config.resolve.alias,
      'wbg': false,
    };

    // Ignore specific warnings related to WASM
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  // Exclude Automerge from server-side rendering
  transpilePackages: ['@automerge/automerge', '@automerge/automerge-repo', '@automerge/automerge-codemirror'],
};

export default nextConfig;

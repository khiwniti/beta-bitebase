#!/usr/bin/env node
/**
 * Script to fix module loading errors in Next.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting module error fix...');

try {
  // 1. Clean up build artifacts
  console.log('Cleaning build artifacts...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 2. Install specific Firebase version that works better with Next.js
  console.log('Installing compatible Firebase version...');
  execSync('npm install firebase@9.17.2 --save-exact', { stdio: 'inherit' });

  // 3. Update next.config.js for better module handling
  console.log('Updating Next.js configuration...');
  const nextConfigPath = './next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  // Disable strict mode to help with React hooks issues
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Fix issues with Firebase and undici
    if (!isServer) {
      // Avoid undici issues by replacing with noop for client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false,
        // Prevent issues with node modules in the browser
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };
      
      // Ignore specific node modules that cause issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
      };
    }
    
    // Handle Firebase dependencies properly
    config.module.rules.push({
      test: /\\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  transpilePackages: ['firebase', '@firebase/auth', '@firebase/app', '@firebase/firestore'],
  experimental: {
    // Reduce serialization issues
    serverComponentsExternalPackages: ['firebase', '@firebase/auth', '@firebase/app', '@firebase/firestore'],
  },
}

module.exports = nextConfig`;

    fs.writeFileSync(nextConfigPath, nextConfig);
  }

  // 4. Start the development server
  console.log('Fixed module errors. Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error fixing module errors:', error);
  process.exit(1);
} 
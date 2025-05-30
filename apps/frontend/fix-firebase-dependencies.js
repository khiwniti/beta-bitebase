#!/usr/bin/env node
/**
 * Script to fix Firebase auth and undici issues with Next.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Firebase dependencies fix...');

try {
  // Downgrade or remove Firebase temporarily
  console.log('Updating Next.js config to fix Firebase/undici compatibility...');
  
  // Update next.config.js to handle Firebase dependencies properly
  const nextConfigPath = './next.config.js';
  
  if (fs.existsSync(nextConfigPath)) {
    console.log('Updating Next.js configuration to handle Firebase dependencies');
    
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Create a new config that properly handles Firebase dependencies
    const newConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Fix issues with Firebase and undici
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Avoid undici issues by replacing with noop for client-side
        undici: false,
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
  transpilePackages: ['firebase', '@firebase/auth'],
};

module.exports = nextConfig;
    `;
    
    fs.writeFileSync(nextConfigPath, newConfig);
    console.log('Updated Next.js configuration');
  }
  
  // Install Firebase version that works better with Next.js
  console.log('Installing compatible Firebase version...');
  execSync('npm install firebase@9.17.2 --save-exact', { stdio: 'inherit' });
  
  // Clean up Next.js cache
  console.log('Cleaning Next.js cache...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  console.log('Firebase dependencies fix completed');
  console.log('Try running: npm run dev');
} catch (error) {
  console.error('Error during Firebase dependencies fix:', error);
} 
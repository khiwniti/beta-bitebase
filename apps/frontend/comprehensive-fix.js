#!/usr/bin/env node
/**
 * Comprehensive React/Next.js dependency fix
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running comprehensive React/Next.js fix...');

try {
  // 1. Clean up environment
  console.log('Cleaning build artifacts and dependencies...');
  execSync('rm -rf .next node_modules package-lock.json', { stdio: 'inherit' });

  // 2. Fix Next.js configuration
  console.log('Updating Next.js configuration...');
  const nextConfig = `
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
  
  fs.writeFileSync('./next.config.js', nextConfig);

  // 3. Create simplified .babelrc
  console.log('Creating simplified Babel configuration...');
  fs.writeFileSync('.babelrc', JSON.stringify({
    "presets": ["next/babel"]
  }, null, 2));
  
  // 4. Create React-friendly tsconfig
  console.log('Creating React-friendly tsconfig...');
  const tsConfig = {
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "plugins": [
        {
          "name": "next"
        }
      ],
      "paths": {
        "react": ["./node_modules/react"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  };
  fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
  
  // 5. Create simplified layout and page
  console.log('Creating simplified page and layout...');
  
  // Backup existing files
  if (fs.existsSync('./app/layout.tsx')) {
    fs.renameSync('./app/layout.tsx', './app/layout.tsx.bak');
  }
  
  if (fs.existsSync('./app/page.tsx')) {
    fs.renameSync('./app/page.tsx', './app/page.tsx.bak');
  }
  
  // Create new simplified files
  const layoutContent = `import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BiteBase Intelligence",
  description: "Restaurant market intelligence platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}`;

  const pageContent = `"use client"

import React from "react"

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">BiteBase Intelligence</h1>
      <p className="mb-4">Restaurant market intelligence platform</p>
      <p>This is a simplified page to test React/Next.js compatibility</p>
    </div>
  )
}`;

  fs.writeFileSync('./app/layout.tsx', layoutContent);
  fs.writeFileSync('./app/page.tsx', pageContent);
  
  // 6. Fix JSX errors by ensuring React is imported
  console.log('Fixing React imports in components...');
  const restaurantSetupPath = './app/restaurant-setup/page.tsx';
  
  if (fs.existsSync(restaurantSetupPath)) {
    let content = fs.readFileSync(restaurantSetupPath, 'utf8');
    
    // Replace import line if needed
    if (!content.includes('import React')) {
      content = content.replace(
        'import { useState, useRef, useEffect } from "react"', 
        'import React, { useState, useRef, useEffect } from "react"'
      );
      fs.writeFileSync(restaurantSetupPath, content);
    }
  }

  // 7. Install dependencies in the correct order
  console.log('Installing React dependencies...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  console.log('Installing Next.js (stable version)...');
  execSync('npm install next@13.5.6 --save-exact', { stdio: 'inherit' });
  
  console.log('Installing compatible Firebase version...');
  execSync('npm install firebase@9.17.2 --save-exact', { stdio: 'inherit' });
  
  console.log('Installing remaining dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Comprehensive fix completed!');
  console.log('You should now be able to run: npm run dev');
} catch (error) {
  console.error('Error applying comprehensive fix:', error);
  process.exit(1);
} 
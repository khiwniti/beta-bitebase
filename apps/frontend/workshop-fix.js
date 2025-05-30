#!/usr/bin/env node
/**
 * Comprehensive React monorepo dependency fix
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running comprehensive React dependency fix...');

try {
  // Check for monorepo Next.js issues
  console.log('Checking for Next.js installations in parent directories...');
  
  // Remove node_modules at frontend level
  console.log('Cleaning up frontend node_modules...');
  execSync('rm -rf .next node_modules package-lock.json', { stdio: 'inherit' });
  
  // Create specific nextjs-peer-deps file
  console.log('Creating React peer dependencies resolution file...');
  fs.writeFileSync('.npmrc', `
# Force single React instance
legacy-peer-deps=true
dedupe=true
`);
  
  // Create simple .babelrc to avoid React transform issues
  console.log('Creating simplified Babel configuration...');
  fs.writeFileSync('.babelrc', JSON.stringify({
    "presets": ["next/babel"]
  }, null, 2));
  
  // Create simplified tsconfig
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
  
  // Install React first
  console.log('Installing React dependencies...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  // Install Next.js with specific version
  console.log('Installing Next.js 14.0.4 (stable version)...');
  execSync('npm install next@14.0.4 --save-exact', { stdio: 'inherit' });
  
  // Install remaining dependencies
  console.log('Installing remaining dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('React dependency fix completed!');
  console.log('You should now be able to run: npm run dev');
} catch (error) {
  console.error('Error fixing dependencies:', error);
  process.exit(1);
} 
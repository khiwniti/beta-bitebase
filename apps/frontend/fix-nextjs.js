#!/usr/bin/env node
/**
 * Script to fix Next.js/React compatibility issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Next.js/React compatibility fix...');

try {
  // Rename existing layout and page to backup
  if (fs.existsSync('./app/layout.tsx')) {
    console.log('Backing up existing layout.tsx');
    fs.renameSync('./app/layout.tsx', './app/layout.tsx.bak');
  }
  
  if (fs.existsSync('./app/page.tsx')) {
    console.log('Backing up existing page.tsx');
    fs.renameSync('./app/page.tsx', './app/page.tsx.bak');
  }
  
  // Copy simple versions
  if (fs.existsSync('./app/simple-root-layout.tsx')) {
    console.log('Installing simplified layout');
    fs.copyFileSync('./app/simple-root-layout.tsx', './app/layout.tsx');
  }
  
  if (fs.existsSync('./app/simple-app-page.tsx')) {
    console.log('Installing simplified page');
    fs.copyFileSync('./app/simple-app-page.tsx', './app/page.tsx');
  }
  
  // Clean up node_modules/next
  console.log('Cleaning Next.js installation');
  execSync('rm -rf node_modules/next node_modules/.bin/next node_modules/react node_modules/react-dom .next', { stdio: 'inherit' });
  
  // Install specific React and Next.js versions
  console.log('Installing Next.js 13.5.6 and React 18.2.0 (known compatible versions)');
  execSync('npm install next@13.5.6 react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  // Update eslint-config-next to match
  console.log('Updating eslint-config-next to match Next.js version');
  execSync('npm install eslint-config-next@13.5.6 --save-exact --save-dev', { stdio: 'inherit' });
  
  console.log('Next.js/React compatibility fix completed');
  console.log('Try running: npm run dev');
} catch (error) {
  console.error('Error during Next.js/React compatibility fix:', error);
} 
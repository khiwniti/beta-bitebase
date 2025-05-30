#!/usr/bin/env node
/**
 * This script helps fix React dependency issues in Next.js projects
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean up existing installation
console.log('Cleaning up existing React installation...');
try {
  // Create a clean slate
  execSync('rm -rf node_modules .next package-lock.json', { stdio: 'inherit' });
  
  // Install React first to ensure it's the primary instance
  console.log('Installing React dependencies first...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  // Install other dependencies
  console.log('Installing remaining dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('React dependencies fixed successfully!');
  console.log('Now try running: npm run dev');
} catch (error) {
  console.error('Error fixing React dependencies:', error);
  process.exit(1);
} 
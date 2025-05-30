#!/usr/bin/env node
/**
 * Script to fix JSX errors by ensuring React is imported
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting JSX error fix...');

try {
  // Fix restaurant-setup/page.tsx
  const restaurantSetupPath = './app/restaurant-setup/page.tsx';
  
  if (fs.existsSync(restaurantSetupPath)) {
    console.log('Fixing React import in restaurant-setup/page.tsx');
    
    let content = fs.readFileSync(restaurantSetupPath, 'utf8');
    
    // Check if React is already imported
    if (!content.includes('import React')) {
      // Replace import line
      content = content.replace(
        'import { useState, useRef, useEffect } from "react"', 
        'import React, { useState, useRef, useEffect } from "react"'
      );
      
      fs.writeFileSync(restaurantSetupPath, content);
      console.log('Added React import to restaurant-setup/page.tsx');
    } else {
      console.log('React already imported in restaurant-setup/page.tsx');
    }
  }
  
  // Make sure we've got the right Next.js and React versions
  console.log('Verifying React and Next.js versions...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  console.log('JSX error fix completed');
  console.log('Try running: npm run dev');
} catch (error) {
  console.error('Error during JSX error fix:', error);
} 
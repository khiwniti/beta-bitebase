// Script to fix React duplicate instances
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get node_modules path
const nodeModulesPath = path.join(__dirname, 'node_modules');

// Remove symbolic links that might cause duplicate React instances
try {
  console.log('Removing problematic React symlinks if they exist...');
  const reactPaths = [
    path.join(nodeModulesPath, 'react'),
    path.join(nodeModulesPath, 'react-dom'),
    path.join(nodeModulesPath, '@tanstack', 'react-query', 'node_modules', 'react'),
    path.join(nodeModulesPath, '@tanstack', 'react-query', 'node_modules', 'react-dom'),
  ];
  
  reactPaths.forEach(reactPath => {
    if (fs.existsSync(reactPath)) {
      console.log(`Removing ${reactPath}`);
      fs.rmSync(reactPath, { recursive: true, force: true });
    }
  });
  
  console.log('Installing React packages directly...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 --save-exact', { stdio: 'inherit' });
  
  console.log('React dependencies fixed successfully!');
} catch (error) {
  console.error('Error fixing React dependencies:', error);
} 
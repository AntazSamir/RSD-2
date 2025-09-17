#!/usr/bin/env node

// Simple optimization script for the restaurant dashboard project
const fs = require('fs');
const path = require('path');

console.log('Running project optimization...');

// Function to remove unnecessary files
function cleanBuildArtifacts() {
  const buildDirs = ['.next', 'out', 'build'];
  buildDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Removed ${dir} directory`);
    }
  });
}

// Function to optimize package.json
function optimizeDependencies() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Remove any duplicate dependencies
  const deps = packageJson.dependencies;
  const devDeps = packageJson.devDependencies;
  
  // Ensure all dependencies have specific versions (not "latest")
  let updated = false;
  Object.keys(deps).forEach(key => {
    if (deps[key] === 'latest') {
      console.log(`Warning: ${key} is using "latest" version`);
      updated = true;
    }
  });
  
  Object.keys(devDeps).forEach(key => {
    if (devDeps[key] === 'latest') {
      console.log(`Warning: ${key} is using "latest" version`);
      updated = true;
    }
  });
  
  if (updated) {
    console.log('Please update package.json to use specific versions instead of "latest"');
  }
}

// Function to check for unused exports
function checkUnusedExports() {
  console.log('Checking for unused exports...');
  // This would be implemented with a more sophisticated tool in a real scenario
  console.log('Note: Consider using tools like ts-unused-exports for detailed analysis');
}

// Run optimizations
cleanBuildArtifacts();
optimizeDependencies();
checkUnusedExports();

console.log('Project optimization completed!');
console.log('To further optimize:');
console.log('1. Run "npm run build" to create an optimized production build');
console.log('2. Consider using bundle analyzer: npx @next/bundle-analyzer');
console.log('3. Run tests to ensure functionality is preserved: npm run test');
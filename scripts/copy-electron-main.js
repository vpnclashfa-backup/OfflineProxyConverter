// scripts/copy-electron-main.js
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'main.js');
const destinationPath = path.join(__dirname, '..', 'build', 'main.js');

const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

fs.copyFile(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error('Error copying main.js:', err);
    process.exit(1);
  }
  console.log('main.js copied to build/main.js successfully!');
});

const preloadSourcePath = path.join(__dirname, '..', 'preload.js');
const preloadDestinationPath = path.join(__dirname, '..', 'build', 'preload.js');

fs.copyFile(preloadSourcePath, preloadDestinationPath, (err) => {
  if (err) {
    console.error('Error copying preload.js:', err);
    process.exit(1);
  }
  console.log('preload.js copied to build/preload.js successfully!');
});

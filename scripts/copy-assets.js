const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const srcAssets = path.join(projectRoot, 'src', 'assets');
    const distAssets = path.join(projectRoot, 'dist', 'assets');
    if (!fs.existsSync(srcAssets)) {
      console.warn('No src/assets directory found, skipping copy.');
      return;
    }
    await copyDir(srcAssets, distAssets);
    console.log('Copied src/assets to dist/assets');
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
})();

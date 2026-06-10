const fs = require('fs');
const path = require('path');

async function compile() {
  const projectRoot = path.resolve(__dirname, '..');
  const srcFile = path.join(projectRoot, 'src', 'styles', 'main.scss');
  const outDir = path.join(projectRoot, 'dist', 'assets');
  const outFile = path.join(outDir, 'main.css');

  try {
    let sass;
    try {
      sass = require('sass');
    } catch (e) {
      sass = require('sass-embedded');
    }

    const result = sass.renderSync({
      file: srcFile,
      outputStyle: 'compressed',
    });
    await fs.promises.mkdir(outDir, { recursive: true });
    await fs.promises.writeFile(outFile, result.css);
    console.log('Compiled SCSS to', outFile);
  } catch (err) {
    console.error('Failed to compile SCSS:', err);
    process.exit(1);
  }
}

compile();

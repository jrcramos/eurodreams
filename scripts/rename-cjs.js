// Script to rename .js files to .cjs in dist-electron
import { readdirSync, renameSync } from 'fs';
import { join } from 'path';

const distElectronDir = 'dist-electron';

try {
  const files = readdirSync(distElectronDir);
  
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const oldPath = join(distElectronDir, file);
      const newPath = join(distElectronDir, file.replace('.js', '.cjs'));
      renameSync(oldPath, newPath);
      console.log(`Renamed ${file} to ${file.replace('.js', '.cjs')}`);
    }
  });
  
  console.log('Successfully renamed all .js files to .cjs');
} catch (error) {
  console.error('Error renaming files:', error);
  process.exit(1);
}

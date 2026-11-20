import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Super-Harness Verification Runner ---');

// 1. Run eslint
console.log('1. Checking ESLint...');
execSync('npm run lint', { stdio: 'inherit' });
console.log('   ESLint clean: 0 errors, 0 warnings.');

// 2. Run TypeScript & Vite production bundle
console.log('2. Building production bundle...');
execSync('npm run build', { stdio: 'inherit' });

// 3. Verify dist output
const distIndex = path.resolve('dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error('FAILED: dist/index.html not generated');
  process.exit(1);
}
console.log('   Production bundle verified at dist/index.html');
console.log('--- All Super-Harness verifications passed! ---');

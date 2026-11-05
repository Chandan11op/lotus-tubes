import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(jsx?|tsx?|html)$/.test(item)) {
      files.push(full);
    }
  }
  return files;
}

const clientDir = path.resolve(__dirname, '..');
const publicDir = path.join(clientDir, 'public');
const srcFiles = walk(path.join(clientDir, 'src'));

const imgRegex = /["'](\/(?:assets|images|banner)[^"']*\.(?:png|jpe?g|svg|webp|gif|mp4))["']/g;
const missing = new Set();
const found = new Set();
const missingAlt = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const url = match[1];
    // Remove query string if any
    const cleanUrl = url.split('?')[0];
    const localPath = path.join(publicDir, cleanUrl.replace(/^\//, '').replace(/\//g, path.sep));
    if (!fs.existsSync(localPath)) {
      missing.add(`${cleanUrl} (in ${path.relative(clientDir, file)})`);
    } else {
      found.add(cleanUrl);
    }
  }

  // Check <img tags for alt attribute
  const imgTags = content.match(/<img[^>]*>/g) || [];
  for (const tag of imgTags) {
    if (!/alt\s*=\s*["'{]/.test(tag)) {
      missingAlt.push({ file: path.relative(clientDir, file), tag });
    }
  }
}

console.log(`\n========================================`);
console.log(`LOTUS TUBES ASSET & IMAGE AUDIT REPORT`);
console.log(`========================================`);
console.log(`Missing Assets Count: ${missing.size}`);
if (missing.size > 0) {
  missing.forEach(m => console.log('  ❌ MISSING:', m));
} else {
  console.log('  ✅ 0 missing assets detected across client codebase.');
}
console.log(`Total Verified Assets: ${found.size}`);
console.log(`Images Missing alt Attribute: ${missingAlt.length}`);
if (missingAlt.length > 0) {
  missingAlt.forEach(m => console.log(`  ⚠️  Missing alt in ${m.file}: ${m.tag}`));
} else {
  console.log('  ✅ All <img> tags have valid alt attributes.');
}
console.log(`========================================\n`);

if (missing.size > 0) {
  process.exit(1);
}

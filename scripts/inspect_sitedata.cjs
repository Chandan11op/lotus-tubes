const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../client/public');

function checkFile(relPath) {
  const fullPath = path.join(publicDir, relPath.replace(/^\//, ''));
  return fs.existsSync(fullPath);
}

// 1. Check siteData.js
console.log('=== CHECKING siteData.js ===');
const siteDataContent = fs.readFileSync(path.join(__dirname, '../client/src/data/siteData.js'), 'utf8');
const siteProductsMatch = siteDataContent.match(/featuredProducts:\s*\[([\s\S]*?)\]\s*,/);
if (siteProductsMatch) {
  const blocks = siteProductsMatch[1].split(/{\s*id:/g).slice(1);
  blocks.forEach(b => {
    const id = (b.match(/^\s*['"]([^'"]+)['"]/) || [])[1];
    const img = (b.match(/image:\s*['"]([^'"]+)['"]/) || [])[1];
    console.log(`siteData product [${id}]: ${img} -> exists: ${checkFile(img || '')}`);
  });
}

// 2. Check categoriesManifest.js
console.log('\n=== CHECKING categoriesManifest.js ===');
const catManifest = fs.readFileSync(path.join(__dirname, '../client/src/data/categoriesManifest.js'), 'utf8');
const catImgs = [...catManifest.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
catImgs.forEach(img => {
  console.log(`catManifest img: ${img} -> exists: ${checkFile(img)}`);
});

// 3. Check categoriesData.js
if (fs.existsSync(path.join(__dirname, '../client/src/data/categoriesData.js'))) {
  console.log('\n=== CHECKING categoriesData.js ===');
  const catData = fs.readFileSync(path.join(__dirname, '../client/src/data/categoriesData.js'), 'utf8');
  const imgs = [...catData.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  imgs.forEach(img => {
    console.log(`catData img: ${img} -> exists: ${checkFile(img)}`);
  });
}

// 4. Check ProductDetailView.jsx
console.log('\n=== CHECKING ProductDetailView.jsx ===');
const detailContent = fs.readFileSync(path.join(__dirname, '../client/src/pages/ProductDetailView.jsx'), 'utf8');
const detailImgs = [...detailContent.matchAll(/['"](\/assets\/images\/[^'"]+)['"]/g)].map(m => m[1]);
console.log('detailImgs in code:', detailImgs);


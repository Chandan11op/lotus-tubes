const fs = require('fs');
const path = require('path');

// Let's import or parse productsData.js
const productsDataContent = fs.readFileSync(path.join(__dirname, '../client/src/data/productsData.js'), 'utf8');

// Also siteData.js
const siteDataContent = fs.readFileSync(path.join(__dirname, '../client/src/data/siteData.js'), 'utf8');

console.log('Inspecting productsData and image files...');

const publicDir = path.join(__dirname, '../client/public');

// Find all image properties in productsData
const productBlocks = productsDataContent.split(/{\s*id:\s*['"]/g).slice(1);
console.log('Total products in productsData.js:', productBlocks.length);

const results = [];
productBlocks.forEach((block, idx) => {
  const idMatch = block.match(/^([^'"]+)/);
  const id = idMatch ? idMatch[1] : 'unknown_' + idx;
  
  const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
  const name = nameMatch ? nameMatch[1] : '';

  const imageMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
  const image = imageMatch ? imageMatch[1] : '';

  const imagesMatch = block.match(/images:\s*\[([\s\S]*?)\]/);
  let gallery = [];
  if (imagesMatch) {
    const rawList = imagesMatch[1];
    const itemMatches = [...rawList.matchAll(/['"]([^'"]+)['"]/g)];
    gallery = itemMatches.map(m => m[1]);
  }

  // Check main image
  const mainImageExists = image ? fs.existsSync(path.join(publicDir, image.replace(/^\//, ''))) : false;
  
  // Check gallery
  const galleryStatuses = gallery.map(img => {
    const exists = fs.existsSync(path.join(publicDir, img.replace(/^\//, '')));
    return { img, exists };
  });

  results.push({
    id,
    name,
    image,
    mainImageExists,
    galleryCount: gallery.length,
    galleryMissing: galleryStatuses.filter(g => !g.exists).map(g => g.img)
  });
});

console.log('--- PRODUCTS WITH MISSING MAIN IMAGES ---');
results.filter(r => !r.mainImageExists).forEach(r => {
  console.log(`[${r.id}] ${r.name}: ${r.image}`);
});

console.log('--- PRODUCTS WITH MISSING GALLERY IMAGES ---');
results.filter(r => r.galleryMissing.length > 0).forEach(r => {
  console.log(`[${r.id}] ${r.name}: missing ${r.galleryMissing.join(', ')}`);
});

console.log('--- KEY PRODUCTS CHECK ---');
['ss-sms-union', 'ss-tri-clamp-ferrule', 'ss-316l-ep-pipe', 'ss-tri-clamp-clamp', 'pipe-holding-clamp'].forEach(id => {
  const p = results.find(r => r.id === id);
  if (p) {
    console.log(`Product [${p.id}]:`);
    console.log(`  Name: ${p.name}`);
    console.log(`  Image: ${p.image} (exists: ${p.mainImageExists})`);
    console.log(`  Missing in gallery: ${p.galleryMissing.length}`);
  }
});

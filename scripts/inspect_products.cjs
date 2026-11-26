const fs = require('fs');
const path = require('path');

const productsDataContent = fs.readFileSync(path.join(__dirname, '../client/src/data/productsData.js'), 'utf8');
const publicDir = path.join(__dirname, '../client/public');

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
    gallery,
    galleryCount: gallery.length,
    galleryMissing: galleryStatuses.filter(g => !g.exists).map(g => g.img)
  });
});

console.log('--- PRODUCTS WITH MISSING MAIN IMAGES ---');
const missingMain = results.filter(r => !r.mainImageExists);
console.log('Count:', missingMain.length);
missingMain.forEach(r => {
  console.log(`[${r.id}] ${r.name}: ${r.image}`);
});

console.log('--- PRODUCTS WITH MISSING GALLERY IMAGES ---');
const missingGallery = results.filter(r => r.galleryMissing.length > 0);
console.log('Count:', missingGallery.length);
missingGallery.forEach(r => {
  console.log(`[${r.id}] ${r.name}: missing ${r.galleryMissing.length} items`);
  r.galleryMissing.forEach(m => console.log('   - ' + m));
});

console.log('--- ALL 30 PRODUCTS CURRENT MAIN IMAGE PATHS ---');
results.forEach(r => {
  console.log(`[${r.id}] -> ${r.image} (${r.mainImageExists ? 'EXISTS' : 'MISSING'})`);
});

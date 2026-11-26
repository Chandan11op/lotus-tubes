const fs = require('fs');
const path = require('path');

function searchAll(dir) {
  let res = [];
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.system_generated') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        res = res.concat(searchAll(full));
      } else if (/\.(jpg|jpeg|png|webp|svg)$/i.test(item)) {
        res.push(full);
      }
    }
  } catch (e) {}
  return res;
}

const allImages = searchAll(path.join(__dirname, '../client'));
console.log('Total images in client:', allImages.length);

const ferruleMatches = allImages.filter(p => /ferrule/i.test(p));
console.log('Ferrule matches:', ferruleMatches.map(p => path.relative(path.join(__dirname, '../client'), p)));

const clampMatches = allImages.filter(p => /clamp/i.test(p));
console.log('Clamp matches count:', clampMatches.length);
clampMatches.slice(0, 20).forEach(p => console.log('  ' + path.relative(path.join(__dirname, '../client'), p)));

const unionMatches = allImages.filter(p => /union/i.test(p));
console.log('Union matches count:', unionMatches.length);
unionMatches.forEach(p => console.log('  ' + path.relative(path.join(__dirname, '../client'), p)));

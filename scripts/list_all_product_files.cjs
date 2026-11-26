const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../client/public/assets/images/products images');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push({
        rel: path.relative(base, full).replace(/\\/g, '/'),
        size: stat.size,
        ext: path.extname(file).toLowerCase()
      });
    }
  });
  return results;
}

const all = walk(base);
console.log('Total files in products images:', all.length);

// Group by top-level folder
const groups = {};
all.forEach(f => {
  const top = f.rel.split('/')[0];
  if (!groups[top]) groups[top] = [];
  groups[top].push(f);
});

Object.keys(groups).sort().forEach(g => {
  console.log(`\n=== [${g}] (${groups[g].length} files) ===`);
  groups[g].forEach(f => {
    console.log(`  ${f.rel} (${Math.round(f.size/1024)} KB)`);
  });
});

const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(js|jsx|json)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const files = walk(path.join(__dirname, '../client/src'));
// Match /assets/images/products/ followed by anything except "images"
const oldPathRegex = /\/assets\/images\/products\/(?!images)[^\s'"`,)]+/g;

let total = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(oldPathRegex)];
  if (matches.length > 0) {
    console.log(`\n${path.relative(path.join(__dirname, '..'), f)}: ${matches.length} matches`);
    const unique = [...new Set(matches.map(m => m[0]))];
    unique.slice(0, 10).forEach(u => console.log('  ' + u));
    total += matches.length;
  }
});
console.log('\nTotal old path references in client/src:', total);

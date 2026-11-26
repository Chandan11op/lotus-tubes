const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../client/public/assets/images/products images');
const folders = fs.readdirSync(base);

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lotus Images Inventory</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }
    h1 { color: #f43f5e; }
    .folder { margin-bottom: 30px; background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; }
    .folder h2 { margin-top: 0; color: #38bdf8; font-size: 18px; }
    .grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .card { background: #0f172a; border: 1px solid #475569; padding: 8px; border-radius: 6px; width: 170px; text-align: center; }
    .card img { width: 100%; height: 110px; object-fit: contain; background: #ffffff; border-radius: 4px; }
    .name { font-size: 11px; margin-top: 6px; word-break: break-all; color: #cbd5e1; }
  </style>
</head>
<body>
  <h1>Lotus Tubes Real Product Images Inventory</h1>
`;

function traverse(dir, label) {
  const items = fs.readdirSync(dir);
  const imgFiles = items.filter(it => /\.(jpg|jpeg|png|webp)$/i.test(it));
  const subdirs = items.filter(it => fs.statSync(path.join(dir, it)).isDirectory());

  if (imgFiles.length > 0) {
    html += `<div class="folder"><h2>📁 ${label} (${imgFiles.length} photos)</h2><div class="grid">\n`;
    imgFiles.forEach(f => {
      const full = path.join(dir, f);
      const rel = path.relative(path.join(__dirname, '../client/public'), full).replace(/\\/g, '/');
      html += `  <div class="card"><img src="/${rel}" loading="lazy" alt="${f}"/><div class="name">${f}</div></div>\n`;
    });
    html += `</div></div>\n`;
  }

  subdirs.forEach(s => {
    traverse(path.join(dir, s), label + ' / ' + s);
  });
}

folders.forEach(f => {
  const full = path.join(base, f);
  if (fs.statSync(full).isDirectory()) {
    traverse(full, f);
  }
});

html += `</body></html>`;
fs.writeFileSync(path.join(__dirname, '../client/public/gallery-debug.html'), html);
console.log('Successfully written gallery-debug.html');

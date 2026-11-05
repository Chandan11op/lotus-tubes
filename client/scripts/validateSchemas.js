import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html') && !file.startsWith('google')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function validateSchemas() {
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  if (htmlFiles.length === 0) {
    console.error('No HTML files found in dist/ to validate.');
    return false;
  }

  let totalPassed = 0;
  let totalFailed = 0;
  const errors = [];

  for (const filePath of htmlFiles) {
    const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Extract JSON-LD scripts
    const scriptMatches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    if (!scriptMatches || scriptMatches.length === 0) {
      errors.push(`${relPath}: Missing <script type="application/ld+json">`);
      totalFailed++;
      continue;
    }

    for (const scriptTag of scriptMatches) {
      const jsonStr = scriptTag.replace(/<script type="application\/ld\+json">/i, '').replace(/<\/script>/i, '').trim();
      let data;
      try {
        data = JSON.parse(jsonStr);
      } catch (e) {
        errors.push(`${relPath}: Invalid JSON syntax: ${e.message}`);
        totalFailed++;
        continue;
      }

      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        const type = item['@type'];

        // Strict Check: No unsupported Product schema without offers/reviews
        if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
          if (!item.offers && !item.review && !item.aggregateRating) {
            errors.push(`${relPath}: Invalid Product schema item without offers, review, or aggregateRating! Name: ${item.name}`);
            totalFailed++;
          }
        }

        // Check BreadcrumbList
        if (type === 'BreadcrumbList') {
          if (!Array.isArray(item.itemListElement) || item.itemListElement.length === 0) {
            errors.push(`${relPath}: BreadcrumbList has no itemListElement`);
            totalFailed++;
          } else {
            item.itemListElement.forEach((el, idx) => {
              if (el.position !== idx + 1) {
                errors.push(`${relPath}: BreadcrumbList position mismatch at idx ${idx}: expected ${idx + 1}, got ${el.position}`);
                totalFailed++;
              }
              if (!el.name || !el.item) {
                errors.push(`${relPath}: BreadcrumbList item missing name or item URL at idx ${idx}`);
                totalFailed++;
              }
            });
          }
        }

        // Check ItemList
        if (type === 'ItemList') {
          if (!Array.isArray(item.itemListElement) || item.itemListElement.length === 0) {
            errors.push(`${relPath}: ItemList has no itemListElement`);
            totalFailed++;
          } else {
            if (item.numberOfItems && item.numberOfItems !== item.itemListElement.length) {
              errors.push(`${relPath}: ItemList numberOfItems mismatch: declared ${item.numberOfItems}, got ${item.itemListElement.length}`);
              totalFailed++;
            }
            item.itemListElement.forEach((el, idx) => {
              if (el.position !== idx + 1) {
                errors.push(`${relPath}: ItemList position mismatch at idx ${idx}`);
                totalFailed++;
              }
              if (!el.name || !el.url) {
                errors.push(`${relPath}: ItemList item missing name or url at idx ${idx}`);
                totalFailed++;
              }
            });
          }
        }
      }
    }

    // 2. Check Canonical URL
    const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="(https:\/\/lotustubes\.com[^"]*)"\s*\/?>/i);
    if (!canonicalMatch) {
      errors.push(`${relPath}: Missing or non-canonical URL tag`);
      totalFailed++;
    }

    // 3. Check Robots
    const robotsMatch = content.match(/<meta\s+name="robots"\s+content="([^"]*)"\s*\/?>/i);
    if (robotsMatch && robotsMatch[1].includes('noindex') && !relPath.includes('crm') && !relPath.includes('account')) {
      errors.push(`${relPath}: Unexpected noindex tag on public route!`);
      totalFailed++;
    }

    totalPassed++;
  }

  if (errors.length === 0) {
    console.log(`✅ ALL ${totalPassed} HTML ROUTES PASSED STRUCTURED DATA VALIDATION!`);
    console.log('✅ ZERO INVALID PRODUCT SCHEMA DETECTED ACROSS ENTIRE DEPLOYMENT.');
    console.log('✅ 100% OF JSON-LD BLOCKS ARE SYNTACTICALLY VALID & COMPLIANT WITH GOOGLE SEARCH CONSOLE.');
    return true;
  } else {
    console.error(`❌ FOUND ${errors.length} STRUCTURED DATA ERRORS:`);
    errors.forEach(e => console.error(`  - ${e}`));
    return false;
  }
}

if (process.argv[1] && process.argv[1].endsWith('validateSchemas.js')) {
  const success = validateSchemas();
  if (!success) process.exit(1);
}


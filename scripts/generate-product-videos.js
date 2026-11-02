/**
 * LOTUS TUBES - Master Automated 360° Product Video Generation Pipeline
 *
 * Scans catalog items, matches multi-angle photography or single images,
 * and synthesizes:
 *  - 360° Loop Video (.mp4 & .webm)
 *  - 10-Second 5-Scene Cinematic Showcase Video (.mp4)
 *  - High-Resolution Poster (.webp)
 *
 * Usage:
 *  node scripts/generate-product-videos.js --all
 *  node scripts/generate-product-videos.js --product=ss-316l-ep-pipe
 *  node scripts/generate-product-videos.js --category=valves
 *  node scripts/generate-product-videos.js --force
 */

import fs from 'fs';
import path from 'path';
import { VideoGenerator } from './video-engine/generator.js';
import { MASTER_PRODUCTS } from '../client/src/data/productsData.js';

const ASSET_BASE = path.resolve('client/public/assets/images/products');
const OUTPUT_BASE = path.resolve('client/public/assets/videos/products');
const MANIFEST_PATH = path.resolve('client/src/data/productVideosManifest.json');

// Map of Product IDs to multi-angle frame folders or image series
const PRODUCT_SERIES_MAP = {
  // Pipes & Tubes
  'ss-316l-ep-pipe': { folder: 'pipes/electro-polished', pattern: /ss-316l-electropolished-sanitary-tube-\d+\.jpg/i },
  'ss-304-ep-pipe': { folder: 'pipes/ss-304', pattern: /ss-304-sanitary-pipe-\d+\.jpg/i },
  'ss-316l-mp-pipe': { folder: 'pipes/mechanically-polished', pattern: /ss-sanitary-mechanical-polished-tube-\d+\.jpg/i },
  'ss-304-mp-pipe': { folder: 'pipes/welded', pattern: /ss-sanitary-welded-tube-\d+\.jpg/i },
  'ss-304-sanitary-pipe': { folder: 'pipes/ss-304', pattern: /ss-304-sanitary-pipe-\d+\.jpg/i },
  'ss-316l-sanitary-pipe': { folder: 'pipes/ss-316l', pattern: /ss-316l-sanitary-pipe-\d+\.jpg/i },
  'ss-304-seamless-sanitary-tube': { folder: 'pipes/seamless', pattern: /ss-sanitary-seamless-tube-\d+\.jpg/i },
  'ss-316l-seamless-sanitary-tube': { folder: 'pipes/seamless', pattern: /ss-sanitary-seamless-tube-\d+\.jpg/i },
  'ss-304-dairy-tube': { folder: 'pipes/welded', pattern: /ss-sanitary-welded-tube-\d+\.jpg/i },

  // Fittings (Bends, Tees, Reducers)
  'ss-316l-fittings-range': { folder: 'fittings/bends-and-elbows', pattern: /ss-sanitary-bend-elbow-\d+\.jpg/i },
  'ss-sanitary-90-bend': { folder: 'fittings/bends-and-elbows', pattern: /ss-sanitary-bend-elbow-\d+\.jpg/i },
  'ss-sanitary-equal-tee': { folder: 'fittings/tees', pattern: /ss-sanitary-tee-fitting-\d+\.jpg/i },
  'ss-sanitary-reducing-tee': { folder: 'fittings/tees', pattern: /ss-sanitary-welded-tee-fitting-\d+\.jpg/i },
  'ss-sanitary-concentric-reducer': { folder: 'fittings/reducers', pattern: /ss-sanitary-reducer-concentric-eccentric-\d+\.jpg/i },
  'ss-sanitary-eccentric-reducer': { folder: 'fittings/reducers', pattern: /ss-sanitary-reducer-concentric-eccentric-\d+\.jpg/i },

  // Tri-Clamp & Unions
  'ss-tri-clamp-ferrule': { folder: 'accessories', pattern: /ss-tri-clamp-ferrule-\d+\.jpg/i },
  'ss-tri-clamp-clamp': { folder: 'accessories/pipe-holders', pattern: /ss-sanitary-pipe-hanger-clamp-\d+\.jpg/i },
  'ss-sms-union': { folder: 'unions/sms-unions', pattern: /ss-sms-sanitary-union-assembly-\d+\.jpg/i },

  // Valves
  'ss-sanitary-butterfly-valve': { folder: 'valves/butterfly-valves', pattern: /ss-sanitary-butterfly-valve-\d+\.jpg/i },
  'ss-316l-diaphragm-valve': { folder: 'valves/diaphragm-valves', pattern: /ss-316l-sanitary-diaphragm-valve-\d+\.jpg/i },
  'ss-3-piece-ball-valve-tc': { folder: 'valves/ball-valves', pattern: /ss-316l-sanitary-ball-valve-\d+\.jpg/i },
  'pneumatic-sanitary-ball-valve': { folder: 'valves/pneumatic-valves', pattern: /ss-pneumatic-actuated-sanitary-ball-valve-\d+\.jpg/i },
  'ss-sanitary-non-return-valve': { folder: 'valves/check-valves', pattern: /ss-sanitary-check-non-return-valve-\d+\.jpg/i }
};

/**
 * Discovers rotation frames for a product
 */
function findProductFrames(product) {
  const mapEntry = PRODUCT_SERIES_MAP[product.id];
  if (mapEntry) {
    const fullDir = path.join(ASSET_BASE, mapEntry.folder);
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir)
        .filter((f) => mapEntry.pattern.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map((f) => path.join(fullDir, f));

      if (files.length > 1) {
        return { type: 'multi-angle', frames: files };
      }
    }
  }

  // Check product.images array if multiple exist (raster image rotation frames only)
  if (product.images && product.images.length > 2) {
    const valid = product.images
      .filter((img) => !img.endsWith('.svg'))
      .map((img) => path.join('client/public', img))
      .filter((img) => fs.existsSync(img));
    if (valid.length > 2) {
      return { type: 'multi-angle', frames: valid };
    }
  }

  // Single primary image fallback (prefer raster PNG if SVG)
  if (product.image) {
    let singlePath = path.join('client/public', product.image);
    if (singlePath.endsWith('.svg')) {
      const pngCandidate = singlePath.replace(/\.svg$/, '.png');
      if (fs.existsSync(pngCandidate)) {
        singlePath = pngCandidate;
      }
    }
    if (fs.existsSync(singlePath)) {
      return { type: 'single', file: singlePath };
    }
  }

  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const targetProduct = args.find((a) => a.startsWith('--product='))?.split('=')[1];
  const targetCategory = args.find((a) => a.startsWith('--category='))?.split('=')[1];

  console.log('================================================================');
  console.log('LOTUS TUBES — AUTOMATED 360° PRODUCT VIDEO GENERATION PIPELINE');
  console.log('================================================================');
  console.log(`Scanning Master Catalog: ${MASTER_PRODUCTS.length} products`);
  console.log(`Asset Input Root:        ${ASSET_BASE}`);
  console.log(`Video Output Root:       ${OUTPUT_BASE}`);

  const generator = new VideoGenerator();
  const manifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : { generatedAt: new Date().toISOString(), totalProducts: MASTER_PRODUCTS.length, products: {} };

  let processedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < MASTER_PRODUCTS.length; i++) {
    const product = MASTER_PRODUCTS[i];

    if (targetProduct && product.id !== targetProduct) continue;
    if (targetCategory && product.categorySlug !== targetCategory) continue;

    const outDir = path.join(OUTPUT_BASE, product.id);
    const mp4360 = path.join(outDir, '360.mp4');
    const showcaseMp4 = path.join(outDir, 'showcase.mp4');

    if (!force && fs.existsSync(mp4360) && fs.existsSync(showcaseMp4)) {
      skippedCount++;
      manifest.products[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        categorySlug: product.categorySlug,
        has360: true,
        video360: `/assets/videos/products/${product.id}/360.mp4`,
        video360Webm: `/assets/videos/products/${product.id}/360.webm`,
        videoShowcase: `/assets/videos/products/${product.id}/showcase.mp4`,
        poster: `/assets/videos/products/${product.id}/poster.webp`,
        status: 'completed',
        sizeBytes: fs.statSync(mp4360).size,
        lastGenerated: manifest.products[product.id]?.lastGenerated || new Date().toISOString()
      };
      continue;
    }

    console.log(`\n[${i + 1}/${MASTER_PRODUCTS.length}] Processing: ${product.name} (${product.id})`);

    const assetInfo = findProductFrames(product);
    if (!assetInfo) {
      console.warn(`  ⚠️ No valid frames or image found for ${product.id}`);
      failedCount++;
      continue;
    }

    try {
      if (assetInfo.type === 'multi-angle') {
        console.log(`  📸 Multi-angle series detected: ${assetInfo.frames.length} frames`);
        console.log(`  🎬 Rendering 360° rotation video (.mp4 & .webm)...`);
        await generator.generate360FromFrames(assetInfo.frames, outDir, product.id);

        console.log(`  🎥 Rendering 10s 5-scene cinematic showcase video...`);
        await generator.generateShowcaseFromFrames(assetInfo.frames, outDir, product);
      } else {
        console.log(`  🖼️ Single-image asset: using Studio 2.5D Camera & Orbital Engine...`);
        await generator.generateFromSingleImage(assetInfo.file, outDir, product);
      }

      processedCount++;
      const sizeBytes = fs.existsSync(mp4360) ? fs.statSync(mp4360).size : 0;

      manifest.products[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        categorySlug: product.categorySlug,
        has360: true,
        video360: `/assets/videos/products/${product.id}/360.mp4`,
        video360Webm: `/assets/videos/products/${product.id}/360.webm`,
        videoShowcase: `/assets/videos/products/${product.id}/showcase.mp4`,
        poster: `/assets/videos/products/${product.id}/poster.webp`,
        duration: 8.0,
        aspectRatio: '16:9',
        resolution: '1920x1080',
        fps: 30,
        status: 'completed',
        mode: assetInfo.type === 'multi-angle' ? 'multi-angle-frames' : 'studio-2.5d-engine',
        frameCount: assetInfo.type === 'multi-angle' ? assetInfo.frames.length : 1,
        sizeBytes,
        lastGenerated: new Date().toISOString()
      };

      console.log(`  ✅ Done! Video assets written to: ${path.relative(process.cwd(), outDir)}`);
    } catch (err) {
      console.error(`  ❌ Failed to generate video for ${product.id}:`, err.message);
      failedCount++;
      manifest.products[product.id] = {
        id: product.id,
        name: product.name,
        has360: false,
        status: 'failed',
        error: err.message
      };
    }
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.completedCount = Object.values(manifest.products).filter((p) => p.status === 'completed').length;
  manifest.failedCount = Object.values(manifest.products).filter((p) => p.status === 'failed').length;

  const jsonContent = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(MANIFEST_PATH, jsonContent, 'utf8');

  // Also write JS module for seamless universal import in Vite and Node
  const jsManifestPath = MANIFEST_PATH.replace(/\.json$/, '.js');
  fs.writeFileSync(
    jsManifestPath,
    `export const productVideosManifest = ${jsonContent};\nexport default productVideosManifest;\n`,
    'utf8'
  );

  console.log('\n================================================================');
  console.log('GENERATION RUN COMPLETED');
  console.log('================================================================');
  console.log(`Newly Processed: ${processedCount}`);
  console.log(`Already Cached:  ${skippedCount}`);
  console.log(`Failed:          ${failedCount}`);
  console.log(`Total Ready:     ${manifest.completedCount} of ${MASTER_PRODUCTS.length}`);
  console.log(`Manifest Saved:  ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error('Fatal Pipeline Error:', err);
  process.exit(1);
});

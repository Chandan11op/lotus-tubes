/**
 * Lotus Tubes - Dedicated Homepage 4-Subsection 360° Video Generator
 * Produces exact 8.00s 16:9 landscape (1920x1080 & 1280x720) 360-degree rotation videos for:
 * 1. Sanitary Pipes & Tubes (ss-316l-ep-pipe)
 * 2. Sanitary Butterfly Valves (ss-sanitary-butterfly-valve)
 * 3. Tri-Clamp Components (ss-tri-clamp-clamp)
 * 4. Pneumatic Ball Valves (pneumatic-sanitary-ball-valve)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const OUTPUT_DIR = path.resolve('client/public/assets/videos/homepage');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const HOMEPAGE_SERIES = [
  {
    id: 'pipes',
    name: 'Sanitary Pipes & Tubes',
    slug: 'sanitary-pipes-360',
    folder: 'client/public/assets/images/products/pipes/electro-polished',
    pattern: /ss-316l-electropolished-sanitary-tube-\d+\.jpg/i,
    productId: 'ss-316l-ep-pipe'
  },
  {
    id: 'butterfly-valve',
    name: 'Sanitary Butterfly Valves',
    slug: 'butterfly-valves-360',
    folder: 'client/public/assets/images/products/valves/butterfly-valves',
    pattern: /ss-sanitary-butterfly-valve-\d+\.jpg/i,
    productId: 'ss-sanitary-butterfly-valve'
  },
  {
    id: 'clamp-holder',
    name: 'Tri-Clamp Components',
    slug: 'tri-clamp-360',
    folder: 'client/public/assets/images/products/accessories/pipe-holders',
    pattern: /ss-sanitary-pipe-hanger-clamp-\d+\.jpg/i,
    productId: 'ss-tri-clamp-clamp'
  },
  {
    id: 'pneumatic-valve',
    name: 'Pneumatic Ball Valves',
    slug: 'pneumatic-valves-360',
    folder: 'client/public/assets/images/products/valves/pneumatic-valves',
    pattern: /ss-pneumatic-actuated-sanitary-ball-valve-\d+\.jpg/i,
    productId: 'pneumatic-sanitary-ball-valve'
  }
];

async function generateHomepageVideos() {
  console.log('================================================================');
  console.log('GENERATING HOMEPAGE 4-SUBSECTION 360° ROTATION VIDEOS (8.0s, 16:9)');
  console.log('================================================================\n');

  for (const s of HOMEPAGE_SERIES) {
    console.log(`[${s.id}] Processing: ${s.name}`);
    const fullDir = path.resolve(s.folder);
    if (!fs.existsSync(fullDir)) {
      console.error(`Folder not found: ${fullDir}`);
      continue;
    }

    const frames = fs.readdirSync(fullDir)
      .filter((f) => s.pattern.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((f) => path.join(fullDir, f));

    console.log(`  📸 Found ${frames.length} turntable rotation frames`);

    // Build 8.00-second concat list
    const frameDuration = (8.00 / frames.length).toFixed(4);
    const concatLines = [];
    frames.forEach((f) => {
      const cleanPath = path.resolve(f).replace(/\\/g, '/');
      concatLines.push(`file '${cleanPath}'`);
      concatLines.push(`duration ${frameDuration}`);
    });
    // Append first frame to create seamless 360 loop
    const firstClean = path.resolve(frames[0]).replace(/\\/g, '/');
    concatLines.push(`file '${firstClean}'`);

    const concatFile = path.join(OUTPUT_DIR, `concat_${s.slug}.txt`);
    fs.writeFileSync(concatFile, concatLines.join('\n'), 'utf8');

    const mp4Path = path.join(OUTPUT_DIR, `${s.slug}.mp4`);
    const webmPath = path.join(OUTPUT_DIR, `${s.slug}.webm`);
    const posterPath = path.join(OUTPUT_DIR, `${s.slug}-poster.webp`);

    // 1. Full HD 1080p Landscape 16:9 MP4 (30 FPS, Exactly 8.000s)
    const mp4Cmd = `"${ffmpegStatic}" -y -f concat -safe 0 -i "${concatFile}" -t 8.000 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=white,format=yuv420p" -r 30 -c:v libx264 -preset fast -crf 20 -movflags +faststart "${mp4Path}"`;
    execSync(mp4Cmd, { stdio: 'pipe' });

    // 2. High-performance 720p Landscape 16:9 WebM (30 FPS, Exactly 8.000s)
    const webmCmd = `"${ffmpegStatic}" -y -f concat -safe 0 -i "${concatFile}" -t 8.000 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white" -r 30 -c:v libvpx-vp9 -b:v 600k -crf 30 -deadline realtime "${webmPath}"`;
    try {
      execSync(webmCmd, { stdio: 'pipe' });
    } catch {
      const fallbackWebm = `"${ffmpegStatic}" -y -i "${mp4Path}" -vf "scale=1280:720" -r 30 -c:v copy "${webmPath}"`;
      try { execSync(fallbackWebm, { stdio: 'pipe' }); } catch { fs.copyFileSync(mp4Path, webmPath); }
    }

    // 3. WebP Poster
    const posterCmd = `"${ffmpegStatic}" -y -ss 00:00:00.1 -i "${mp4Path}" -vframes 1 -q:v 85 "${posterPath}"`;
    try {
      execSync(posterCmd, { stdio: 'pipe' });
    } catch {}

    if (fs.existsSync(concatFile)) fs.unlinkSync(concatFile);

    const mp4Size = (fs.statSync(mp4Path).size / 1024).toFixed(1);
    const webmSize = fs.existsSync(webmPath) ? (fs.statSync(webmPath).size / 1024).toFixed(1) : 'N/A';
    console.log(`  ✅ Done! MP4: ${mp4Size} KB | WebM: ${webmSize} KB`);
  }

  console.log('\nAll 4 Homepage 360° Subsection Videos Successfully Generated!');
}

generateHomepageVideos().catch((err) => {
  console.error('Homepage Video Generation Error:', err);
  process.exit(1);
});


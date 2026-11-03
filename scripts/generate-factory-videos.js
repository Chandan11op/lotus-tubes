import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const OUTPUT_DIR = path.resolve('client/public/assets/videos/homepage');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const FACTORY_SERIES = [
  {
    id: 'pipes',
    name: 'Sanitary Pipes & Tubes Factory Line',
    slug: 'sanitary-pipes-factory',
    inputImage: 'client/public/assets/images/factory/factory-pipes-manufacturing.jpg',
    panDirection: 'center'
  },
  {
    id: 'butterfly-valve',
    name: 'Sanitary Butterfly Valves Machining & Assembly',
    slug: 'butterfly-valves-factory',
    inputImage: 'client/public/assets/images/factory/factory-valves-machining.jpg',
    panDirection: 'left-to-center'
  },
  {
    id: 'clamp-holder',
    name: 'Tri-Clamp Fabrication & Mirror Polishing Line',
    slug: 'tri-clamp-factory',
    inputImage: 'client/public/assets/images/factory/factory-clamp-fabrication.jpg',
    panDirection: 'center'
  },
  {
    id: 'pneumatic-valve',
    name: 'Pneumatic Ball Valves Assembly & Cycle Testing Bench',
    slug: 'pneumatic-valves-factory',
    inputImage: 'client/public/assets/images/factory/factory-pneumatic-assembly.jpg',
    panDirection: 'right-to-center'
  }
];

export async function generateFactoryVideos() {
  console.log('================================================================');
  console.log('GENERATING REAL INDUSTRIAL FACTORY BACKGROUND VIDEOS (8.0s, 16:9)');
  console.log('================================================================\n');

  for (const s of FACTORY_SERIES) {
    const imgPath = path.resolve(s.inputImage);
    if (!fs.existsSync(imgPath)) {
      console.warn(`[SKIP] Image not found yet: ${imgPath}`);
      continue;
    }

    console.log(`[${s.id}] Rendering real factory video for: ${s.name}`);

    const mp4Path = path.join(OUTPUT_DIR, `${s.slug}.mp4`);
    const webmPath = path.join(OUTPUT_DIR, `${s.slug}.webm`);
    const posterPath = path.join(OUTPUT_DIR, `${s.slug}-poster.webp`);

    // Create poster image first
    try {
      const posterCmd = `"${ffmpegStatic}" -y -i "${imgPath}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -q:v 85 "${posterPath}"`;
      execSync(posterCmd, { stdio: 'pipe' });
      console.log(`  📸 Poster generated: ${path.basename(posterPath)}`);
    } catch (e) {
      console.error(`  Failed to create poster: ${e.message}`);
    }

    // 1. Full HD 1080p MP4 (8.00s, 30fps = 240 frames, slow cinematic dolly zoom)
    try {
      const zoomFilter = "scale=1920:1080,zoompan=z='min(zoom+0.0006,1.15)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,format=yuv420p";
      const mp4Cmd = `"${ffmpegStatic}" -y -loop 1 -i "${imgPath}" -t 8.000 -vf "${zoomFilter}" -r 30 -c:v libx264 -preset fast -crf 22 -movflags +faststart "${mp4Path}"`;
      execSync(mp4Cmd, { stdio: 'pipe' });
      console.log(`  🎬 1080p MP4 ready: ${path.basename(mp4Path)}`);
    } catch (e) {
      console.error(`  Failed to render MP4: ${e.message}`);
    }

    // 2. High-performance 720p WebM (8.00s, 30fps, fast VP8 encode)
    try {
      const webmFilter = "scale=1280:720,zoompan=z='min(zoom+0.0006,1.15)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720";
      const webmCmd = `"${ffmpegStatic}" -y -loop 1 -i "${imgPath}" -t 8.000 -vf "${webmFilter}" -r 30 -c:v libvpx -b:v 800k -crf 30 -speed 8 -quality realtime "${webmPath}"`;
      execSync(webmCmd, { stdio: 'pipe' });
      console.log(`  🌐 720p WebM ready: ${path.basename(webmPath)}`);
    } catch (e) {
      console.error(`  Failed to render WebM: ${e.message}`);
    }
  }

  console.log('\nFactory background videos generation completed.');
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('generate-factory-videos.js')) {
  generateFactoryVideos();
}

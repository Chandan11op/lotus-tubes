import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const framesDir = path.resolve('client/public/assets/images/products/valves/butterfly-valves');
const outDir = path.resolve('client/public/assets/videos/products/ss-sanitary-butterfly-valve');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const frames = fs.readdirSync(framesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();

console.log('Testing with frames:', frames.length);

const concatList = [];
frames.forEach(f => {
  concatList.push(`file '${path.join(framesDir, f).replace(/\\/g, '/')}'`);
  concatList.push('duration 0.22');
});
concatList.push(`file '${path.join(framesDir, frames[0]).replace(/\\/g, '/')}'`);

const concatPath = path.join(outDir, 'test-frames.txt');
fs.writeFileSync(concatPath, concatList.join('\n'));

const mp4Out = path.join(outDir, '360.mp4');
const cmd = `"${ffmpegStatic}" -y -f concat -safe 0 -i "${concatPath}" -vf "scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2:color=white,format=yuv420p" -c:v libx264 -preset fast -crf 20 -movflags +faststart "${mp4Out}"`;

console.log('Running FFmpeg render...');
execSync(cmd, { stdio: 'inherit' });

console.log('SUCCESS! Video created at:', mp4Out, 'File size:', fs.statSync(mp4Out).size, 'bytes');


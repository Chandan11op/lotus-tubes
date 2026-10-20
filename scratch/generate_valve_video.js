import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profileDir = path.resolve('scratch/edge_profile_valve');
const videosDir = path.resolve('client/public/assets/videos');
const port = 9335;

if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const cfg = {
  name: 'valves-360-sample.webm',
  label: 'SANITARY VALVE 360°',
  drawType: 'valve'
};

function buildHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body { margin: 0; background: #000; overflow: hidden; } canvas { width: 600px; height: 450px; }</style>
</head>
<body>
<canvas id="c" width="600" height="450"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let angle = 0;
const totalFrames = 60;
let frameCount = 0;

function draw() {
  const bg = ctx.createLinearGradient(0, 0, 600, 450);
  bg.addColorStop(0, '#F8FAFC');
  bg.addColorStop(1, '#E2E8F0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 450);

  // Turntable shadow
  ctx.save();
  ctx.translate(300, 340);
  ctx.scale(1, 0.28);
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(16, 38, 61, 0.12)';
  ctx.fill();
  ctx.restore();

  // Turntable disk
  ctx.save();
  ctx.translate(300, 310);
  ctx.scale(1, 0.3);
  ctx.beginPath();
  ctx.arc(0, 0, 150, 0, Math.PI * 2);
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#94A3B8';
  ctx.stroke();
  ctx.restore();

  // Valve 3D
  ctx.save();
  ctx.translate(300, 210);

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const metalGrad = ctx.createLinearGradient(-150 * cosA, -80, 150 * cosA, 80);
  metalGrad.addColorStop(0, '#64748B');
  metalGrad.addColorStop(0.25, '#CBD5E1');
  metalGrad.addColorStop(0.5 + 0.25 * Math.sin(angle * 2), '#FFFFFF');
  metalGrad.addColorStop(0.75, '#94A3B8');
  metalGrad.addColorStop(1, '#334155');

  // Valve Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 85 * Math.abs(cosA) + 30, 85, 0, 0, Math.PI * 2);
  ctx.fillStyle = metalGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#334155';
  ctx.stroke();

  // Flange clamps
  ctx.beginPath();
  ctx.rect(-10, -110, 20, 45);
  ctx.fillStyle = '#475569';
  ctx.fill();

  // Blue sanitary valve handle
  ctx.beginPath();
  ctx.roundRect(-50 * cosA - 15, -135, 100 * Math.abs(cosA) + 30, 24, 6);
  ctx.fillStyle = '#0284C7';
  ctx.fill();

  ctx.restore();

  // Badge
  ctx.fillStyle = 'rgba(16, 38, 61, 0.88)';
  ctx.roundRect(24, 24, 220, 34, 6);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('🔄 ${cfg.label}', 38, 46);

  angle += (Math.PI * 2) / totalFrames;
  frameCount++;
}

draw();

const stream = canvas.captureStream(30);
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
const chunks = [];
recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
recorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'video/webm' });
  const reader = new FileReader();
  reader.onload = () => {
    window.recordedBase64 = reader.result.split(',')[1];
    document.title = 'DONE:' + window.recordedBase64.length;
  };
  reader.readAsDataURL(blob);
};

recorder.start();
const interval = setInterval(() => {
  draw();
  if (frameCount >= totalFrames) {
    clearInterval(interval);
    recorder.stop();
  }
}, 1000 / 30);
</script>
</body>
</html>`;
}

async function render() {
  const html = buildHtml();
  const tempHtml = path.resolve('scratch/temp_valve.html');
  fs.writeFileSync(tempHtml, html);

  const htmlUrl = 'file:///' + tempHtml.replace(/\\/g, '/');

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-background-timer-throttling',
    '--run-all-compositor-stages-before-draw',
    `--user-data-dir=${profileDir}`,
    `--remote-debugging-port=${port}`,
    htmlUrl
  ]);

  setTimeout(async () => {
    try {
      const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
      const pages = await listRes.json();
      const targetPage = pages.find(p => p.url.includes('temp_valve.html')) || pages[0];
      const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

      ws.onopen = () => {
        let checks = 0;
        const poll = setInterval(() => {
          checks++;
          ws.send(JSON.stringify({
            id: checks,
            method: 'Runtime.evaluate',
            params: { expression: 'document.title' }
          }));
          if (checks > 20) {
            clearInterval(poll);
            ws.close();
            proc.kill();
            process.exit(1);
          }
        }, 400);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const val = msg.result?.result?.value;
        if (val && val.startsWith('DONE:')) {
          ws.send(JSON.stringify({
            id: 9999,
            method: 'Runtime.evaluate',
            params: { expression: 'window.recordedBase64' }
          }));
        }
        if (msg.id === 9999) {
          const b64 = msg.result?.result?.value;
          const buf = Buffer.from(b64, 'base64');
          const targetPath = path.join(videosDir, cfg.name);
          fs.writeFileSync(targetPath, buf);
          console.log(`✅ Saved ${cfg.name} (${buf.length} bytes) to ${targetPath}`);
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    } catch (err) {
      console.error(err);
      proc.kill();
      process.exit(1);
    }
  }, 1500);
}

render();

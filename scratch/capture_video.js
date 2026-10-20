import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = 'file:///' + path.resolve('scratch/temp_recorder.html').replace(/\\/g, '/');
const profileDir = path.resolve('scratch/edge_profile');
const port = 9333;

const proc = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-background-timer-throttling',
  '--run-all-compositor-stages-before-draw',
  `--user-data-dir=${profileDir}`,
  `--remote-debugging-port=${port}`,
  htmlPath
]);

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const pages = await listRes.json();
    const targetPage = pages.find(p => p.url.includes('temp_recorder.html')) || pages[0];
    const wsUrl = targetPage.webSocketDebuggerUrl;
    console.log('Target Page:', targetPage.url);
    
    // Poll for title starting with DONE:
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      let checks = 0;
      const poll = setInterval(() => {
        checks++;
        ws.send(JSON.stringify({
          id: checks,
          method: 'Runtime.evaluate',
          params: { expression: 'document.title + " | " + (window.recordedBase64 ? window.recordedBase64.length : 0)' }
        }));
        if (checks > 15) {
          clearInterval(poll);
          ws.close();
          proc.kill();
          process.exit(1);
        }
      }, 500);
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const val = msg.result?.result?.value;
      console.log('Poll check:', val);
      if (val && val.includes('DONE:')) {
        // Fetch recordedBase64
        ws.send(JSON.stringify({
          id: 9999,
          method: 'Runtime.evaluate',
          params: { expression: 'window.recordedBase64' }
        }));
      }
      if (msg.id === 9999) {
        const b64 = msg.result?.result?.value;
        const buf = Buffer.from(b64, 'base64');
        const outPath = path.resolve('scratch/test_output.webm');
        fs.writeFileSync(outPath, buf);
        console.log('SUCCESS! Wrote WebM video:', outPath, 'Bytes:', buf.length);
        ws.close();
        proc.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}, 2000);

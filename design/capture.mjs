import { writeFile } from 'node:fs/promises';

// Usage: node design/capture.mjs <url> <width> <height> <output.png> [waitMs]
const [, , url, widthArg, heightArg, output, waitArg] = process.argv;
const width = Number(widthArg);
const height = Number(heightArg);
const waitMs = Number(waitArg ?? 2500);
const debugPort = 9222;

let idCounter = 0;

function send(ws, method, params = {}) {
  const id = ++idCounter;
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(new Error(`${method}: ${JSON.stringify(msg.error)}`));
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function waitFor(ws, method, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.removeEventListener('message', handler);
      reject(new Error(`timeout waiting for ${method}`));
    }, timeout);
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === method) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        resolve(msg.params);
      }
    };
    ws.addEventListener('message', handler);
  });
}

async function createTarget() {
  const res = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, {
    method: 'PUT',
  });
  if (!res.ok) {
    throw new Error(`createTarget failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('error', (event) => reject(event));
  });
}

const target = await createTarget();
const ws = await connect(target.webSocketDebuggerUrl);

try {
  await send(ws, 'Page.enable');
  await send(ws, 'Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true,
  });
  const loaded = waitFor(ws, 'Page.loadEventFired');
  await send(ws, 'Page.navigate', { url });
  await loaded;
  await new Promise((resolve) => setTimeout(resolve, waitMs));
  const shot = await send(ws, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });
  await writeFile(output, Buffer.from(shot.data, 'base64'));
  console.log(`saved ${output} (${width}x${height})`);
} finally {
  ws.close();
}

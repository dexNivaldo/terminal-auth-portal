import { writeFile } from 'node:fs/promises';

// Usage: node design/scroll-capture.mjs <url> <width> <height> <scrollY> <output.png> [waitMs]
const [, , url, widthArg, heightArg, scrollYArg, output, waitArg] = process.argv;
const width = Number(widthArg);
const height = Number(heightArg);
const scrollY = Number(scrollYArg);
const waitMs = Number(waitArg ?? 1200);
const debugPort = 9222;

const target = await (
  await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })
).json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', reject);
});

let id = 0;
function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: true,
});

const loaded = new Promise((resolve) => {
  const handler = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Page.loadEventFired') {
      ws.removeEventListener('message', handler);
      resolve();
    }
  };
  ws.addEventListener('message', handler);
});
await send('Page.navigate', { url });
await loaded;
await new Promise((resolve) => setTimeout(resolve, 2000));

await send('Runtime.evaluate', {
  expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' })`,
});
await new Promise((resolve) => setTimeout(resolve, waitMs));

const shot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(output, Buffer.from(shot.data, 'base64'));
console.log(`saved ${output} (${width}x${height} @ y=${scrollY})`);
ws.close();

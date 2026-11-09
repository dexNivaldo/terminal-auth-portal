import { writeFile } from 'node:fs/promises';

// Clicks the theme toggle button and verifies that the theme switches between
// light and dark and persists to localStorage.
const [, , url, outputAfterClick] = process.argv;

const target = await (
  await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })
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
  width: 1440,
  height: 900,
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
await new Promise((resolve) => setTimeout(resolve, 2500));

const before = await send('Runtime.evaluate', {
  expression: `({
    darkClass: document.documentElement.classList.contains('dark'),
    stored: localStorage.getItem('theme'),
    label: document.querySelector('button[aria-label*="mode"]')?.getAttribute('aria-label'),
  })`,
  returnByValue: true,
});

const btn = await send('Runtime.evaluate', {
  expression: `(() => {
    const r = document.querySelector('button[aria-label*="mode"]').getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  })()`,
  returnByValue: true,
});

await send('Input.dispatchMouseEvent', {
  type: 'mousePressed',
  x: btn.result.value.x,
  y: btn.result.value.y,
  button: 'left',
  clickCount: 1,
});
await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased',
  x: btn.result.value.x,
  y: btn.result.value.y,
  button: 'left',
  clickCount: 1,
});
await new Promise((resolve) => setTimeout(resolve, 400));

const after = await send('Runtime.evaluate', {
  expression: `({
    darkClass: document.documentElement.classList.contains('dark'),
    stored: localStorage.getItem('theme'),
    label: document.querySelector('button[aria-label*="mode"]')?.getAttribute('aria-label'),
  })`,
  returnByValue: true,
});

const shot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(outputAfterClick, Buffer.from(shot.data, 'base64'));
console.log(JSON.stringify({ before: before.result.value, after: after.result.value }, null, 2));
ws.close();

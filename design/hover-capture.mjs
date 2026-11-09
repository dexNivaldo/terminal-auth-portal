import { writeFile } from 'node:fs/promises';

// Captures a saved-entry row in its hover state to verify the clickable affordance.
const [, , url, output] = process.argv;

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

await send('Runtime.evaluate', {
  expression: `document.querySelector('ul li .text-sm.font-semibold').scrollIntoView({ block: 'center' })`,
});
await new Promise((resolve) => setTimeout(resolve, 600));

const point = await send('Runtime.evaluate', {
  expression: `(() => {
    const r = document.querySelector('ul li .text-sm.font-semibold').getBoundingClientRect();
    return { x: Math.round(r.x + 40), y: Math.round(r.y + r.height / 2) };
  })()`,
  returnByValue: true,
});

await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: point.result.value.x,
  y: point.result.value.y,
});
await new Promise((resolve) => setTimeout(resolve, 400));

const shot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(output, Buffer.from(shot.data, 'base64'));
console.log(`saved ${output}`);
ws.close();

import { writeFile } from 'node:fs/promises';

// Usage: node design/tab-capture.mjs <url> <output.png> [tabCount]
const [, , url, output, tabsArg] = process.argv;
const tabCount = Number(tabsArg ?? 7);
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
await new Promise((resolve) => setTimeout(resolve, 2000));

for (let i = 0; i < tabCount; i++) {
  await send('Input.dispatchKeyEvent', {
    type: 'rawKeyDown',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  });
  await new Promise((resolve) => setTimeout(resolve, 80));
}

const info = await send('Runtime.evaluate', {
  expression:
    '({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 40), focusVisible: document.activeElement?.matches(":focus-visible") })',
  returnByValue: true,
});
console.log(JSON.stringify(info.result.value));

const shot = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(output, Buffer.from(shot.data, 'base64'));
console.log('saved', output);
ws.close();

// Verifies that clicking anywhere on a saved-entry row triggers "Use" and
// that the delete button still works without triggering "Use".
const [, , url, width, height] = process.argv;

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
  width: Number(width),
  height: Number(height),
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

async function evalExpr(expression) {
  const out = await send('Runtime.evaluate', { expression, returnByValue: true });
  return out.result.value;
}

async function clickAt(x, y) {
  await send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
  await send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x,
    y,
    button: 'left',
    clickCount: 1,
  });
  await new Promise((resolve) => setTimeout(resolve, 300));
}

await evalExpr(
  `document.querySelector('ul li .text-sm.font-semibold').scrollIntoView({ block: 'center' })`
);
await new Promise((resolve) => setTimeout(resolve, 600));

const rowPoint = await evalExpr(`(() => {
  const el = document.querySelector('ul li .text-sm.font-semibold');
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
})()`);

await clickAt(rowPoint.x, rowPoint.y);
const toastAfterRow = await evalExpr(
  `document.querySelector('[role="status"]')?.textContent || null`
);

await new Promise((resolve) => setTimeout(resolve, 3500));
const toastCleared = await evalExpr(
  `document.querySelector('[role="status"]')?.textContent || null`
);

const deletePoint = await evalExpr(`(() => {
  const el = document.querySelector('ul li button[aria-label^="Delete entry"]');
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
})()`);
if (deletePoint.y < 0 || deletePoint.y > Number(height)) {
  await evalExpr(
    `document.querySelector('ul li button[aria-label^="Delete entry"]').scrollIntoView({ block: 'center' })`
  );
  await new Promise((resolve) => setTimeout(resolve, 600));
}
const deletePoint2 = await evalExpr(`(() => {
  const el = document.querySelector('ul li button[aria-label^="Delete entry"]');
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
})()`);
deletePoint.x = deletePoint2.x;
deletePoint.y = deletePoint2.y;

await clickAt(deletePoint.x, deletePoint.y);
const toastAfterDelete = await evalExpr(
  `document.querySelector('[role="status"]')?.textContent || null`
);
const confirmVisible = await evalExpr(
  `[...document.querySelectorAll('ul li button')].some((b) => b.textContent.trim() === 'Delete')`
);

console.log(
  JSON.stringify(
    { rowPoint, toastAfterRow, toastCleared, deletePoint, toastAfterDelete, confirmVisible },
    null,
    2
  )
);
ws.close();

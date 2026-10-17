// Captures one hero scene from a running page via Chrome DevTools Protocol (port 9222): forces the scene,
// reloads, hides header/text/buttons, verifies, then screencasts PNG frames (~35-45 fps) + stamps.json.
// usage: node scripts/capture-hero.mjs <tabIdPrefix> <horizon|shore> <outDir> <seconds>
// Pair with scripts/make-hero-banner.sh. The tab must be one you own (see cdp-manager).
const [,, prefix, scene, outDir, secs] = process.argv;
mkdirSync(outDir, { recursive: true });
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const tabs = list.filter((t) => t.id.startsWith(prefix));
if (tabs.length !== 1) { console.error('tabs matching prefix:', tabs.length); process.exit(1); }
const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const call = (method, params = {}) => new Promise((res) => { pending.set(++id, res); ws.send(JSON.stringify({ id, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expression) => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
const stamps = []; let n = 0;
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result ?? msg); pending.delete(msg.id); return; }
  if (msg.method === 'Page.screencastFrame') {
    const { data, sessionId, metadata } = msg.params;
    call('Page.screencastFrameAck', { sessionId });
    writeFileSync(`${outDir}/f${String(n++).padStart(4, '0')}.png`, Buffer.from(data, 'base64'));
    stamps.push(metadata.timestamp);
  }
};
ws.onopen = async () => {
  await call('Page.enable'); await call('Runtime.enable');
  await evaluate(`localStorage.setItem('hero:scene','${scene}'); localStorage.setItem('hero:sound','off'); 1`);
  await call('Page.reload'); await sleep(6000);
  const hideH1 = scene === 'horizon' ? ',#home h1' : '';
  const state = await evaluate(`(() => { const st=document.createElement('style'); st.textContent='header,#home p,#home h2${hideH1},#home a,#home button,#home [class*=rest],#home [class*=root]{visibility:hidden!important}'; document.head.appendChild(st); const h=document.querySelector('#home'); return h.dataset.scene + ' ready=' + h.dataset.ready + ' header=' + getComputedStyle(document.querySelector('header')).visibility; })()`);
  console.log('state:', state);
  if (!String(state).startsWith(scene)) { console.error('scene mismatch, abort'); ws.close(); process.exit(2); }
  await sleep(800);
  await call('Page.startScreencast', { format: 'png', maxWidth: 1280, maxHeight: 720, everyNthFrame: 1 });
  await sleep(Number(secs) * 1000);
  await call('Page.stopScreencast'); await sleep(300);
  const dur = stamps.at(-1) - stamps[0];
  console.log(`${n} frames in ${dur.toFixed(1)}s → ${(n / dur).toFixed(1)} fps`);
  ws.close();
};

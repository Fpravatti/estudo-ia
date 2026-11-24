/* Service worker: deixa o app e os áudios disponíveis offline. */
const VERSION = '0c19c548f9';
const SHELL = `shell-${VERSION}`;
const DATA = 'data-v1';
const AUDIO = 'audio-v1'; // não muda entre versões: os nomes dos mp3 já têm hash

const SHELL_FILES = [
  './', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await shell.addAll(SHELL_FILES.map((f) => new Request(f, { cache: 'reload' })));
    // dados: guarda a versão atual para funcionar offline desde o início
    const data = await caches.open(DATA);
    try {
      const cur = await fetch('data/curriculum.json', { cache: 'reload' });
      if (cur.ok) {
        const json = await cur.clone().json();
        await data.put('data/curriculum.json', cur);
        await Promise.all(json.modules.filter((m) => m.available).map(async (m) => {
          const r = await fetch(`data/${m.id}.json`, { cache: 'reload' });
          if (r.ok) await data.put(`data/${m.id}.json`, r);
        }));
      }
    } catch (e) { /* offline na instalação: tudo bem */ }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('shell-') && key !== SHELL) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const path = url.pathname;

  if (path.includes('/audio/')) {
    event.respondWith(audioResponse(req, url));
  } else if (path.includes('/data/')) {
    event.respondWith(networkFirst(req, DATA));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function cacheFirst(req) {
  const hit = await caches.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    return await fetch(req);
  } catch (e) {
    if (req.mode === 'navigate') return caches.match('index.html');
    throw e;
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const key = new URL(req.url).pathname.split('/data/')[1];
  try {
    const res = await fetch(req, { cache: 'no-cache' });
    if (res.ok) await cache.put(`data/${key}`, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(`data/${key}`);
    if (hit) return hit;
    throw e;
  }
}

/* Áudio: serve do cache com suporte a "Range" (necessário para o player
   avançar/voltar). Se ainda não estiver no cache, baixa o arquivo inteiro,
   guarda e depois responde. */
async function audioResponse(req, url) {
  const cache = await caches.open(AUDIO);
  const key = url.origin + url.pathname;
  let res = await cache.match(key);
  if (!res) {
    try {
      const net = await fetch(key);
      if (!net.ok) return net;
      await cache.put(key, net.clone());
      res = net;
    } catch (e) {
      return new Response('offline', { status: 503, statusText: 'offline' });
    }
  }
  const range = req.headers.get('range');
  if (!range) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? parseInt(m[1], 10) : 0;
  let end = m[2] ? parseInt(m[2], 10) : size - 1;
  if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
  end = Math.min(end, size - 1);
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  const chunk = buf.slice(start, end + 1);
  return new Response(chunk, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(chunk.byteLength),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
}

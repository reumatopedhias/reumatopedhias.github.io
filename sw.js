/* Modo offline do app.
   Guarda no celular só os arquivos das páginas (nunca dados de pacientes).
   Páginas: tenta a internet primeiro (até 4 s) para pegar a versão mais nova; sem internet, usa a cópia guardada.
   Fotos, ícones e fontes: usa a cópia guardada e atualiza em segundo plano.
   Só cuida da página inicial e das calculadoras listadas em PASTAS; o resto do site (ex.: /questionarios/) passa direto.
   Ao acrescentar uma calculadora: inclua a pasta em PASTAS e os arquivos em ARQUIVOS, e aumente VERSAO. */
const VERSAO = 'rp-v4';
const PASTAS = ['jdmai/', 'jadas/', 'sjadas/', 'jspada/'];
const ARQUIVOS = [
  './', 'manifest.webmanifest',
  'icones/icone-192.png', 'icones/icone-512.png', 'icones/icone-maskable-512.png', 'icones/apple-touch-icon.png', 'icones/favicon-32.png',
  'jdmai/',
  ...['biceps', 'deltoide', 'gmaximo', 'gmedio', 'pescoco', 'punho', 'quadriceps']
    .flatMap(n => [`jdmai/img/${n}.jpg`, `jdmai/img/${n}-ge.jpg`]),
  'jdmai/img/tornozelo.jpg', 'jdmai/img/tornozelo-b.jpg',
  'jadas/',
  'sjadas/',
  'jspada/',
];
const base = self.registration.scope;
const abs = p => new URL(p, base).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => Promise.all(ARQUIVOS.map(p => c.add(abs(p)).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const nossa = url => {
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') return true;
  if (!url.href.startsWith(base)) return false;
  const resto = url.href.slice(base.length).split(/[?#]/)[0];
  return resto === '' || resto === 'index.html' || resto === 'manifest.webmanifest' || resto.startsWith('icones/') ||
    PASTAS.some(p => resto === p.slice(0, -1) || resto.startsWith(p));
};

const comTempo = (prom, ms) => new Promise((ok, falha) => {
  const t = setTimeout(() => falha(new Error('lento')), ms);
  prom.then(r => { clearTimeout(t); ok(r); }, err => { clearTimeout(t); falha(err); });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!nossa(url)) return;
  const pagina = req.mode === 'navigate' || req.destination === 'document' || req.destination === 'iframe';
  e.respondWith(caches.open(VERSAO).then(async c => {
    const guardada = await c.match(req, { ignoreSearch: true });
    const daRede = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; });
    if (pagina) {
      try { return await comTempo(daRede, 4000); }
      catch { return guardada || daRede; }
    }
    if (guardada) { daRede.catch(() => {}); return guardada; }
    return daRede;
  }));
});

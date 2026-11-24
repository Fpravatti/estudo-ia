'use strict';
/* Estudo IA — app de estudos em áudio, offline. */

const AUDIO_CACHE = 'audio-v1';
const INTERVALS = [1, 3, 7, 14, 30]; // dias até cada revisão espaçada
const SPEEDS = [0.8, 1, 1.25, 1.5, 1.75, 2];
const LETTERS = 'ABCD';

// ------------------------------------------------------------ utilidades
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const daysBetween = (a, b) => Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const fmtDate = (s) => { const d = parseYmd(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const fmtTime = (sec) => { sec = Math.max(0, Math.round(sec || 0)); return `${Math.floor(sec / 60)}:${pad(sec % 60)}`; };
const fmtMin = (sec) => { const m = Math.round((sec || 0) / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${pad(m % 60)} min`; };
const fmtMB = (b) => `${(b / 1048576).toFixed(b > 104857600 ? 0 : 1).replace('.', ',')} MB`;
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

const I = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/><text x="12" y="16.3" font-size="6.5" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700">15</text></svg>',
  fwd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V1l5 5-5 5V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/><text x="12" y="16.3" font-size="6.5" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700">15</text></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"/></svg>',
  vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.4 6 8 7.4l4.6 4.6L8 16.6 9.4 18l6-6z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9z"/></svg>',
  train: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.2l2-2h3.6l2 2H18v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5-7H6V6h5zm5.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-7h-5V6h5z"/></svg>',
  loop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 6 6 5.9 5.9 0 0 1-.7 2.8l1.5 1.5A8 8 0 0 0 12 4zm0 14a6 6 0 0 1-6-6 5.9 5.9 0 0 1 .7-2.8L5.2 7.7A8 8 0 0 0 12 20v3l4-4-4-4z"/></svg>',
};

// ------------------------------------------------------------ estado salvo
const KEY = 'estudo-ia-v1';
const defaults = () => ({
  settings: { examDate: null, startDate: null, speed: 1, newPerDay: 2, autoNext: true, quizAudio: true },
  lessons: {}, quiz: {}, wrong: {}, days: {}, sims: [], lastId: null, welcomed: false,
});
let S = loadState();
function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const d = defaults();
      return { ...d, ...s, settings: { ...d.settings, ...s.settings } };
    }
  } catch (e) { /* armazenamento indisponível */ }
  return defaults();
}
let saveTimer;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
function saveNow() { clearTimeout(saveTimer); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }
addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
const lst = (id) => (S.lessons[id] ||= {});

// ------------------------------------------------------------ dados
const D = { cur: null, mods: {}, lessons: [], byId: {}, questions: [] };
async function loadData() {
  const get = async (f) => { const r = await fetch(f); if (!r.ok) throw new Error(f); return r.json(); };
  D.cur = await get('data/curriculum.json');
  const avail = D.cur.modules.filter((m) => m.available);
  await Promise.all(avail.map(async (m) => { D.mods[m.id] = await get(`data/${m.id}.json`); }));
  D.lessons = []; D.questions = [];
  for (const m of avail) {
    const md = D.mods[m.id];
    md.lessons.forEach((l, i) => {
      Object.assign(l, { mod: m.id, modNum: m.num, modTitle: m.title, index: i });
      D.lessons.push(l); D.byId[l.id] = l;
    });
    md.quiz.forEach((q) => { q.mod = m.id; q.modNum = m.num; D.questions.push(q); });
  }
  if (!S.settings.examDate) S.settings.examDate = D.cur.examDefault;
  if (!S.settings.startDate) S.settings.startDate = today();
  save();
}

// ------------------------------------------------------------ plano de estudos
function plan() {
  const t = today();
  const { startDate: start, examDate: exam } = S.settings;
  const total = Math.max(7, daysBetween(start, exam));
  const daysLeft = daysBetween(t, exam);
  const contentDays = Math.round(total * 8 / 13);
  const nMods = D.cur.modules.length;
  const goal = (i) => addDays(start, Math.round((i + 1) * contentDays / nMods));
  let phase, tip;
  if (daysLeft < 0) { phase = 'Prova realizada'; tip = 'Ajuste a data da prova nos Ajustes, se precisar.'; }
  else if (daysLeft <= 7) { phase = 'Reta final'; tip = 'Ouça as pílulas de revisão, refaça as questões que errou e faça o último simulado.'; }
  else if (daysLeft <= 21) { phase = 'Simulados'; tip = 'Um simulado por semana e reforço dos módulos com nota mais baixa.'; }
  else if (daysLeft <= 35) { phase = 'Segunda passada'; tip = 'Ouça de novo os módulos onde você foi pior nos quizzes.'; }
  else { phase = 'Conteúdo novo'; tip = 'Na ida, aulas novas. Na volta, revisão e quiz.'; }
  const week = Math.floor(daysBetween(start, t) / 7) + 1;
  const weeks = Math.ceil(total / 7);
  return { t, daysLeft, goal, phase, tip, week: Math.min(Math.max(week, 1), weeks), weeks };
}

function newToday() {
  const t = today();
  const doneToday = D.lessons.filter((l) => S.lessons[l.id]?.doneAt === t);
  const pending = D.lessons.filter((l) => !S.lessons[l.id]?.done);
  const need = Math.max(0, S.settings.newPerDay - doneToday.length);
  return { doneToday, next: pending.slice(0, need), pending };
}

function dueReviews() {
  const t = today();
  return D.lessons.filter((l) => {
    const st = S.lessons[l.id];
    if (!st?.done || !st.lastAt) return false;
    const r = st.reviews || 0;
    return r < INTERVALS.length && daysBetween(st.lastAt, t) >= INTERVALS[r];
  }).sort((a, b) => S.lessons[a.id].lastAt.localeCompare(S.lessons[b.id].lastAt));
}

function modProgress(id) {
  const md = D.mods[id];
  if (!md) return { done: 0, total: 0, pct: 0 };
  const done = md.lessons.filter((l) => S.lessons[l.id]?.done).length;
  return { done, total: md.lessons.length, pct: md.lessons.length ? done / md.lessons.length : 0 };
}

function markHeard(id) {
  const st = lst(id);
  const t = today();
  if (!st.done) { st.done = true; st.doneAt = t; st.lastAt = t; st.reviews = 0; }
  else if (st.lastAt !== t) { st.reviews = (st.reviews || 0) + 1; st.lastAt = t; }
  save();
}

// ------------------------------------------------------------ player de aulas
const audio = new Audio();
audio.preload = 'none'; // só baixa quando você der play
const qa = new Audio(); // áudio do quiz
const P = { id: null, queue: [], lastT: 0, lastSave: 0 };

function loadLesson(id, autoplay) {
  const L = D.byId[id];
  if (!L) return;
  qa.pause();
  if (P.id !== id) {
    P.id = id;
    S.lastId = id; save();
    audio.defaultPlaybackRate = S.settings.speed;
    audio.src = L.audio;
    const pos = S.lessons[id]?.pos || 0;
    audio.addEventListener('loadedmetadata', () => {
      if (pos > 3 && pos < (audio.duration || L.duration) - 5) audio.currentTime = pos;
      audio.playbackRate = S.settings.speed;
    }, { once: true });
    P.lastT = pos;
    setMediaSession(L);
  }
  audio.playbackRate = S.settings.speed;
  if (autoplay) {
    audio.play().catch(() => toast(navigator.onLine ? 'Não consegui tocar o áudio.' : 'Sem internet: baixe o módulo para ouvir offline.'));
  }
  renderMini();
}

function playLesson(id, queue) {
  if (queue) P.queue = queue;
  else if (!P.queue.includes(id)) P.queue = [id];
  if (P.id === id && !audio.paused) return;
  loadLesson(id, true);
}

function togglePlay() {
  if (!P.id) return;
  if (audio.paused) loadLesson(P.id, true); else audio.pause();
}

function skip(sec) { if (P.id) audio.currentTime = Math.max(0, Math.min((audio.duration || 0) - 0.5, audio.currentTime + sec)); }

function nextInQueue(dir = 1) {
  const i = P.queue.indexOf(P.id);
  const nid = P.queue[i + dir];
  if (nid) { loadLesson(nid, true); return true; }
  return false;
}

function setSpeed(v) {
  S.settings.speed = v; save();
  audio.defaultPlaybackRate = v; audio.playbackRate = v;
  updatePlayerUI(true);
}

audio.addEventListener('timeupdate', () => {
  if (!P.id) return;
  const t = audio.currentTime;
  const dt = t - P.lastT;
  P.lastT = t;
  if (!audio.paused && dt > 0 && dt < 3) {
    const d = today();
    S.days[d] = (S.days[d] || 0) + dt / (audio.playbackRate || 1);
  }
  const st = lst(P.id);
  st.pos = t;
  if (audio.duration && t > audio.duration * 0.95) markHeard(P.id);
  const now = Date.now();
  if (now - P.lastSave > 5000) { P.lastSave = now; save(); }
  updatePlayerUI();
});
audio.addEventListener('play', () => { renderMini(); updatePlayerUI(true); });
audio.addEventListener('pause', () => { saveNow(); updatePlayerUI(true); });
audio.addEventListener('ended', () => {
  if (!P.id) return;
  markHeard(P.id);
  lst(P.id).pos = 0;
  saveNow();
  const advanced = S.settings.autoNext && nextInQueue(1);
  if (!advanced) updatePlayerUI(true);
  if (['hoje', 'modulo', 'trilha'].includes(curRoute())) route(true);
});
audio.addEventListener('error', () => {
  if (P.id) toast(navigator.onLine ? 'Erro ao carregar o áudio.' : 'Sem internet: baixe o módulo para ouvir offline.');
});

function setMediaSession(L) {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: L.title,
      artist: `Módulo ${L.modNum} · ${L.label}`,
      album: 'Estudo IA',
      artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
  } catch (e) { /* sem suporte */ }
}
if ('mediaSession' in navigator) {
  const ms = navigator.mediaSession;
  const set = (a, f) => { try { ms.setActionHandler(a, f); } catch (e) { /* ação não suportada */ } };
  set('play', () => loadLesson(P.id, true));
  set('pause', () => audio.pause());
  set('seekbackward', () => skip(-15));
  set('seekforward', () => skip(15));
  set('previoustrack', () => { if (audio.currentTime > 5 || !nextInQueue(-1)) audio.currentTime = 0; });
  set('nexttrack', () => nextInQueue(1));
  set('seekto', (e) => { if (e.seekTime != null) audio.currentTime = e.seekTime; });
}

function renderMini() {
  const el = $('#mini');
  const L = D.byId[P.id];
  if (!L || curRoute() === 'player') { el.hidden = true; document.body.classList.remove('has-mini'); return; }
  el.hidden = false;
  document.body.classList.add('has-mini');
  el.innerHTML = `
    <div class="mini-bar"><i id="mini-prog"></i></div>
    <a class="mini-info" href="#/player">
      <span class="mini-label">Módulo ${L.modNum} · ${esc(L.label)}</span>
      <span class="mini-title">${esc(L.title)}</span>
    </a>
    <button class="icon-btn" data-act="skip" data-arg="-15" aria-label="Voltar 15 segundos">${I.back}</button>
    <button class="icon-btn primary" id="mini-play" data-act="toggle" aria-label="Tocar ou pausar">${audio.paused ? I.play : I.pause}</button>`;
  updatePlayerUI(true);
}

let lastIconPaused = null;
function updatePlayerUI(force) {
  const L = D.byId[P.id];
  if (!L) return;
  const dur = audio.duration || L.duration || 1;
  const t = audio.currentTime || S.lessons[P.id]?.pos || 0;
  const prog = $('#mini-prog');
  if (prog) prog.style.width = `${(t / dur) * 100}%`;
  const seek = $('#seek');
  if (seek && !seek.matches(':active')) { seek.max = Math.round(dur); seek.value = Math.round(t); seek.style.setProperty('--p', `${(t / dur) * 100}%`); }
  const tc = $('#t-cur'); if (tc) tc.textContent = fmtTime(t);
  const tl = $('#t-left'); if (tl) tl.textContent = `-${fmtTime(dur - t)}`;
  if (force || lastIconPaused !== audio.paused) {
    lastIconPaused = audio.paused;
    const ic = audio.paused ? I.play : I.pause;
    const mp = $('#mini-play'); if (mp) mp.innerHTML = ic;
    const bp = $('#big-play'); if (bp) bp.innerHTML = ic;
    document.querySelectorAll('[data-speed]').forEach((b) => b.classList.toggle('on', Number(b.dataset.speed) === S.settings.speed));
  }
}

// ------------------------------------------------------------ áudio do quiz
function playSeq(urls) {
  audio.pause();
  let i = 0;
  qa.onended = () => { i += 1; if (i < urls.length) { qa.src = urls[i]; qa.play().catch(() => {}); } };
  qa.src = urls[0];
  qa.playbackRate = 1;
  qa.play().catch(() => toast('Não consegui tocar o áudio da questão.'));
}
function stopQuizAudio() { qa.pause(); qa.onended = null; }

// ------------------------------------------------------------ downloads offline
async function cachedCount(files) {
  if (!('caches' in window)) return 0;
  const c = await caches.open(AUDIO_CACHE);
  let n = 0;
  for (const f of files) if (await c.match(new URL(f, location.href).href)) n += 1;
  return n;
}
const downloading = {};
async function downloadModule(id) {
  if (downloading[id] || !('caches' in window)) return;
  downloading[id] = true;
  try { await navigator.storage?.persist?.(); } catch (e) { /* ignora */ }
  const md = D.mods[id];
  const c = await caches.open(AUDIO_CACHE);
  let done = 0;
  const files = md.audioFiles;
  const upd = () => { const el = document.getElementById(`dl-${id}`); if (el) el.innerHTML = `<span class="muted">Baixando… ${Math.round((done / files.length) * 100)}%</span>`; };
  upd();
  let failed = false;
  for (const f of files) {
    const url = new URL(f, location.href).href;
    if (!(await c.match(url))) {
      try {
        const r = await fetch(url);
        if (r.ok && !(await c.match(url))) await c.put(url, r);
        else if (!r.ok) failed = true;
      } catch (e) { failed = true; break; }
    }
    done += 1; upd();
  }
  downloading[id] = false;
  toast(failed ? 'Não consegui baixar tudo. Tente de novo com internet.' : `Módulo ${md.num} pronto para ouvir offline.`);
  fillDownloadStatus(id);
}
async function fillDownloadStatus(id) {
  const el = document.getElementById(`dl-${id}`);
  if (!el || downloading[id]) return;
  const md = D.mods[id];
  const n = await cachedCount(md.audioFiles);
  if (n >= md.audioFiles.length) el.innerHTML = `<span class="ok-text">${I.check} Disponível offline</span>`;
  else el.innerHTML = `<button class="btn small ghost" data-act="download" data-arg="${id}">${I.down} Baixar para ouvir offline (${fmtMB(md.audioBytes)})</button>`;
}

// ------------------------------------------------------------ roteamento
const curRoute = () => (location.hash.slice(2) || 'hoje').split('/')[0];
function route(keepScroll) {
  const [name, arg] = (location.hash.slice(2) || 'hoje').split('/');
  if (name !== 'quiz') stopQuizAudio();
  const views = { hoje: viewHoje, trilha: viewTrilha, modulo: viewModulo, aula: viewAula, player: viewPlayer, praticar: viewPraticar, quiz: viewQuiz, glossario: viewGlossario, ajustes: viewAjustes };
  const view = views[name] || viewHoje;
  const main = $('#main');
  const y = scrollY;
  main.innerHTML = view(arg);
  const tab = { modulo: 'trilha', aula: 'trilha', glossario: 'trilha', quiz: 'praticar', player: '' }[name] ?? name;
  document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  document.querySelectorAll('[id^="dl-"]').forEach((el) => fillDownloadStatus(el.id.slice(3)));
  renderMini();
  updatePlayerUI(true);
  if (keepScroll) scrollTo(0, y); else scrollTo(0, 0);
  if (name === 'quiz') afterQuizRender();
}
addEventListener('hashchange', () => route());

// ------------------------------------------------------------ componentes
function lessonRow(L, opts = {}) {
  const st = S.lessons[L.id] || {};
  const playing = P.id === L.id && !audio.paused;
  const qattr = opts.queue ? ` data-queue="${opts.queue.join(',')}"` : '';
  const sub = opts.sub ?? `Módulo ${L.modNum} · ${L.label} · ${fmtMin(L.duration)}`;
  return `<li class="row ${st.done ? 'done' : ''}">
    <button class="icon-btn ${playing ? 'primary' : 'soft'}" data-act="play" data-arg="${L.id}"${qattr} aria-label="Ouvir ${esc(L.title)}">${playing ? I.pause : I.play}</button>
    <a class="row-main" href="#/aula/${L.id}">
      <span class="row-sub">${esc(sub)}</span>
      <span class="row-title">${esc(L.title)}</span>
    </a>
    ${st.done ? `<span class="badge-ok" title="Concluída">${I.check}</span>` : ''}
  </li>`;
}

// ------------------------------------------------------------ telas
function viewHoje() {
  const p = plan();
  const nt = newToday();
  const rev = dueReviews().slice(0, 3);
  const heard = S.days[p.t] || 0;
  const d = new Date();
  const items = [];

  if (!S.welcomed) {
    items.push(`<section class="card welcome">
      <h2>Bem-vindo! Como funciona</h2>
      <ol>
        <li><strong>Instale</strong>: no menu do Chrome, toque em “Adicionar à tela inicial” ou “Instalar app”.</li>
        <li><strong>Baixe o módulo</strong> na aba Trilha, com Wi-Fi, para ouvir sem internet no metrô.</li>
        <li><strong>Na ida</strong>, ouça as aulas novas. <strong>Na volta</strong>, a revisão e o quiz.</li>
        <li>O áudio continua com a tela bloqueada. Use os controles da tela de bloqueio.</li>
      </ol>
      <button class="btn" data-act="welcomed">Entendi</button>
    </section>`);
  }

  // Ida
  const idaList = [...nt.doneToday, ...nt.next];
  let ida;
  if (idaList.length) {
    const queue = [...nt.next, ...rev].map((l) => l.id);
    ida = `<ul class="list">${idaList.map((l) => lessonRow(l, { queue: queue.length ? queue : [l.id] })).join('')}</ul>`;
    if (nt.next.length) ida += `<button class="btn wide" data-act="playToday">${I.play} Ouvir tudo de hoje</button>`;
    else if (nt.pending.length) ida += `<p class="muted">Meta de aulas novas de hoje cumprida! Quer adiantar? ${lessonLink(nt.pending[0])}</p>`;
  } else {
    ida = `<p>Você ouviu todo o conteúdo publicado até agora. Os próximos módulos chegam em breve. Enquanto isso, use a revisão e os quizzes.</p>`;
  }
  items.push(`<section class="card">
    <h2 class="card-h">${I.train} Ida · aulas novas</h2>${ida}
  </section>`);

  // Volta
  const volta = [];
  if (rev.length) volta.push(`<ul class="list">${rev.map((l) => lessonRow(l, { queue: rev.map((r) => r.id), sub: `Ouvir de novo · Módulo ${l.modNum} · ${fmtMin(l.duration)}` })).join('')}</ul>`);
  for (const m of D.cur.modules.filter((x) => x.available)) {
    const pr = modProgress(m.id);
    const qz = S.quiz[m.id];
    if (pr.done === pr.total && !qz) volta.push(actionRow('startQuiz', m.id, `Fazer o quiz do Módulo ${m.num}`, `${D.mods[m.id].quiz.length} questões, com áudio`));
    else if (qz && qz.best < 0.7 && pr.done === pr.total) volta.push(actionRow('startQuiz', m.id, `Refazer o quiz do Módulo ${m.num}`, `Sua melhor nota: ${Math.round(qz.best * 100)}%`));
  }
  const nWrong = Object.keys(S.wrong).length;
  if (nWrong) volta.push(actionRow('startErros', '', `Revisar ${nWrong} ${nWrong === 1 ? 'questão' : 'questões'} que você errou`, 'Com explicação em áudio'));
  items.push(`<section class="card">
    <h2 class="card-h">${I.loop} Volta · revisão</h2>
    ${volta.length ? volta.join('') : '<p class="muted">Nada para revisar hoje. As aulas voltam para revisão 1, 3, 7, 14 e 30 dias depois de ouvidas.</p>'}
  </section>`);

  // Meta do módulo
  const mods = D.cur.modules;
  const curIdx = Math.max(0, mods.findIndex((m) => !m.available || modProgress(m.id).done < modProgress(m.id).total));
  const cm = mods[curIdx] || mods[mods.length - 1];
  const goal = p.goal(curIdx);
  const late = daysBetween(goal, p.t) > 0;
  items.push(`<section class="card">
    <h2 class="card-h">Meta</h2>
    <p><strong>Módulo ${cm.num} · ${esc(cm.title)}</strong> até <strong>${fmtDate(goal)}</strong>.
    ${cm.available ? (late ? '<span class="tag warn">Atrasado: dá para recuperar ouvindo 1 aula a mais por dia</span>' : '<span class="tag ok">Em dia</span>') : '<span class="tag">Ainda não publicado</span>'}</p>
    <p class="muted">${esc(p.tip)}</p>
  </section>`);

  return `<header class="page-h">
      <p class="eyebrow">${WEEKDAYS[d.getDay()]}, ${fmtDate(p.t)} · semana ${p.week} de ${p.weeks}</p>
      <h1>${p.daysLeft >= 0 ? `Faltam ${p.daysLeft} dias para a prova` : 'Prova realizada'}</h1>
      <p class="chips"><span class="chip">${esc(p.phase)}</span><span class="chip">Hoje: ${fmtMin(heard)} ouvidos</span></p>
    </header>${items.join('')}`;
}

function lessonLink(L) { return `<a href="#/aula/${L.id}">${esc(L.label)}: ${esc(L.title)}</a>`; }
function actionRow(act, arg, title, sub) {
  return `<button class="row action" data-act="${act}" data-arg="${esc(arg)}">
    <span class="row-main"><span class="row-sub">${esc(sub)}</span><span class="row-title">${esc(title)}</span></span>${I.chev}</button>`;
}

function viewTrilha() {
  const mods = D.cur.modules.map((m) => {
    if (!m.available) {
      return `<li class="mod locked"><span class="mod-num">${m.num}</span><span class="mod-main">
        <span class="row-title">${esc(m.title)}</span><span class="row-sub">${esc(m.subtitle)}</span>
        <span class="row-sub">${I.lock} Em breve</span></span></li>`;
    }
    const pr = modProgress(m.id);
    const qz = S.quiz[m.id];
    return `<li class="mod"><a href="#/modulo/${m.id}">
      <span class="mod-num">${m.num}</span>
      <span class="mod-main">
        <span class="row-title">${esc(m.title)}</span>
        <span class="row-sub">${esc(m.subtitle)}</span>
        <span class="bar"><i style="width:${pr.pct * 100}%"></i></span>
        <span class="row-sub">${pr.done}/${pr.total} aulas · ${fmtMin(m.totalDuration)}${qz ? ` · quiz ${Math.round(qz.best * 100)}%` : ''}</span>
      </span>${I.chev}</a></li>`;
  }).join('');
  return `<header class="page-h"><p class="eyebrow">${esc(D.cur.subtitle)}</p><h1>${esc(D.cur.title)}</h1>
    <p class="muted">10 módulos na ordem recomendada. Os módulos são publicados aos poucos.</p></header>
    <ul class="mods">${mods}</ul>`;
}

function viewModulo(id) {
  const md = D.mods[id];
  if (!md) return notFound();
  const pr = modProgress(id);
  const queue = md.lessons.map((l) => l.id);
  const firstPending = md.lessons.find((l) => !S.lessons[l.id]?.done) || md.lessons[0];
  const qz = S.quiz[id];
  return `<header class="page-h">
      <a class="back" href="#/trilha">‹ Trilha</a>
      <p class="eyebrow">Módulo ${md.num}</p><h1>${esc(md.title)}</h1>
      <p class="muted">${esc(md.subtitle)}</p>
      <p class="chips"><span class="chip">${pr.done}/${pr.total} aulas</span><span class="chip">${fmtMin(md.totalDuration)} de áudio</span><span class="chip">${md.quiz.length} questões</span></p>
      <div id="dl-${id}" class="dl"></div>
    </header>
    <button class="btn wide" data-act="play" data-arg="${firstPending.id}" data-queue="${queue.slice(queue.indexOf(firstPending.id)).join(',')}">${I.play} ${pr.done ? 'Continuar o módulo' : 'Ouvir o módulo'}</button>
    <ul class="list">${md.lessons.map((l) => lessonRow(l, { queue: queue.slice(queue.indexOf(l.id)), sub: `${l.label} · ${fmtMin(l.duration)}` })).join('')}</ul>
    <section class="card">
      <h2 class="card-h">Praticar</h2>
      ${actionRow('startQuiz', id, `Quiz do Módulo ${md.num}`, qz ? `Melhor nota: ${Math.round(qz.best * 100)}% · ${qz.attempts} tentativa(s)` : `${md.quiz.length} questões com áudio e explicação`)}
      ${md.glossary.length ? `<a class="row action" href="#/glossario/${id}"><span class="row-main"><span class="row-sub">${md.glossary.length} termos</span><span class="row-title">Glossário do módulo</span></span>${I.chev}</a>` : ''}
    </section>
    <p class="muted small">Cobre os cursos nº ${md.courses.join(', ')} da trilha original.</p>`;
}

function viewAula(id) {
  const L = D.byId[id];
  if (!L) return notFound();
  const md = D.mods[L.mod];
  const queue = md.lessons.map((l) => l.id);
  const st = S.lessons[id] || {};
  const next = md.lessons[L.index + 1];
  return `<header class="page-h">
      <a class="back" href="#/modulo/${L.mod}">‹ Módulo ${L.modNum}</a>
      <p class="eyebrow">${esc(L.label)} · ${fmtMin(L.duration)}</p>
      <h1>${esc(L.title)}</h1>
      ${L.summary ? `<p class="muted">${esc(L.summary)}</p>` : ''}
    </header>
    <div class="aula-actions">
      <button class="btn" data-act="play" data-arg="${id}" data-queue="${queue.slice(L.index).join(',')}">${P.id === id && !audio.paused ? I.pause + ' Pausar' : I.play + ' Ouvir aula'}</button>
      ${st.done ? `<span class="ok-text">${I.check} Concluída</span>` : `<button class="btn ghost" data-act="markDone" data-arg="${id}">Marcar como concluída</button>`}
    </div>
    <article class="prose">${L.html}</article>
    ${next ? `<a class="row action next-link" href="#/aula/${next.id}"><span class="row-main"><span class="row-sub">Próxima: ${esc(next.label)}</span><span class="row-title">${esc(next.title)}</span></span>${I.chev}</a>`
      : actionRow('startQuiz', L.mod, `Quiz do Módulo ${L.modNum}`, 'Hora de testar o que você aprendeu')}`;
}

function viewPlayer() {
  const L = D.byId[P.id];
  if (!L) return `<header class="page-h"><h1>Nada tocando</h1><p class="muted">Escolha uma aula em Hoje ou na Trilha.</p></header>`;
  const i = P.queue.indexOf(P.id);
  const upNext = P.queue.slice(i + 1).map((id) => D.byId[id]).filter(Boolean);
  return `<div class="player">
    <button class="back plain" data-act="closePlayer">‹ Voltar</button>
    <div class="art">${I.vol}</div>
    <p class="eyebrow">Módulo ${L.modNum} · ${esc(L.label)}</p>
    <h1 class="player-title">${esc(L.title)}</h1>
    <input id="seek" class="seek" type="range" min="0" max="${Math.round(L.duration)}" value="0" step="1" aria-label="Posição do áudio">
    <div class="times"><span id="t-cur">0:00</span><span id="t-left"></span></div>
    <div class="controls">
      <button class="icon-btn big" data-act="skip" data-arg="-15" aria-label="Voltar 15 segundos">${I.back}</button>
      <button class="icon-btn huge primary" id="big-play" data-act="toggle" aria-label="Tocar ou pausar">${audio.paused ? I.play : I.pause}</button>
      <button class="icon-btn big" data-act="skip" data-arg="15" aria-label="Avançar 15 segundos">${I.fwd}</button>
    </div>
    <div class="speeds" role="group" aria-label="Velocidade">${SPEEDS.map((s) => `<button data-act="speed" data-speed="${s}" class="${s === S.settings.speed ? 'on' : ''}">${String(s).replace('.', ',')}x</button>`).join('')}</div>
    <label class="toggle"><input type="checkbox" data-act="autoNext" ${S.settings.autoNext ? 'checked' : ''}> Tocar a próxima aula automaticamente</label>
    <a class="btn ghost wide" href="#/aula/${L.id}">${I.doc} Ler o texto da aula</a>
    ${upNext.length ? `<h2 class="section-h">A seguir</h2><ul class="list">${upNext.map((l) => lessonRow(l, { queue: P.queue.slice(P.queue.indexOf(l.id)) })).join('')}</ul>` : ''}
  </div>`;
}

function viewPraticar() {
  const avail = D.cur.modules.filter((m) => m.available);
  const nWrong = Object.keys(S.wrong).length;
  const nQ = D.questions.length;
  const simN = Math.min(50, nQ);
  const hist = S.sims.slice(-5).reverse();
  return `<header class="page-h"><p class="eyebrow">Praticar</p><h1>Questões e simulados</h1></header>
    <section class="card"><h2 class="card-h">Quizzes por módulo</h2>
      ${avail.map((m) => { const qz = S.quiz[m.id]; return actionRow('startQuiz', m.id, `Módulo ${m.num} · ${m.title}`, qz ? `Melhor nota ${Math.round(qz.best * 100)}% · última ${Math.round(qz.last * 100)}%` : `${D.mods[m.id].quiz.length} questões · ainda não feito`); }).join('')}
    </section>
    <section class="card"><h2 class="card-h">Revisar erros</h2>
      ${nWrong ? actionRow('startErros', '', `${nWrong} ${nWrong === 1 ? 'questão' : 'questões'} para revisar`, 'Ao acertar, a questão sai da lista') : '<p class="muted">Nenhuma questão errada pendente. Muito bem!</p>'}
    </section>
    <section class="card"><h2 class="card-h">Simulado</h2>
      <p class="muted">Questões sorteadas de todos os módulos publicados, com cronômetro, sem mostrar a resposta até o final, como na prova. ${nQ < 50 ? `Por enquanto há ${nQ} questões; o simulado completo terá 50.` : ''}</p>
      ${actionRow('startSim', '', `Fazer simulado (${simN} questões)`, `Tempo: ${Math.round(simN * 1.5)} minutos`)}
      ${hist.length ? `<h3 class="section-h">Últimos simulados</h3><ul class="plain-list">${hist.map((s) => `<li>${fmtDate(s.at)} · <strong>${Math.round(s.score * 100)}%</strong> (${s.right}/${s.total})</li>`).join('')}</ul>` : ''}
    </section>`;
}

function viewGlossario(id) {
  const md = D.mods[id];
  if (!md) return notFound();
  return `<header class="page-h"><a class="back" href="#/modulo/${id}">‹ Módulo ${md.num}</a><p class="eyebrow">Glossário</p><h1>${esc(md.title)}</h1></header>
    <dl class="gloss">${md.glossary.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>`;
}

function viewAjustes() {
  const s = S.settings;
  const avail = D.cur.modules.filter((m) => m.available);
  const totalBytes = avail.reduce((a, m) => a + (m.audioBytes || 0), 0);
  setTimeout(fillStorage, 0);
  return `<header class="page-h"><p class="eyebrow">Ajustes</p><h1>Seu plano</h1></header>
    <section class="card form">
      <label>Data da prova<input type="date" data-set="examDate" value="${s.examDate}"></label>
      <label>Comecei a estudar em<input type="date" data-set="startDate" value="${s.startDate}"></label>
      <label>Aulas novas por dia
        <select data-set="newPerDay">${[1, 2, 3, 4, 5].map((n) => `<option ${n === s.newPerDay ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label>Velocidade padrão
        <select data-set="speed">${SPEEDS.map((v) => `<option value="${v}" ${v === s.speed ? 'selected' : ''}>${String(v).replace('.', ',')}x</option>`).join('')}</select></label>
      <label class="toggle"><input type="checkbox" data-set="autoNext" ${s.autoNext ? 'checked' : ''}> Tocar a próxima aula automaticamente</label>
      <label class="toggle"><input type="checkbox" data-set="quizAudio" ${s.quizAudio ? 'checked' : ''}> Ler as questões em voz alta no quiz</label>
    </section>
    <section class="card">
      <h2 class="card-h">Offline</h2>
      ${avail.map((m) => `<div class="dl-row"><span>Módulo ${m.num}</span><span id="dl-${m.id}"></span></div>`).join('')}
      <button class="btn ghost wide" data-act="downloadAll">${I.down} Baixar todos (${fmtMB(totalBytes)})</button>
      <p class="muted small" id="storage"></p>
      <button class="btn ghost small" data-act="clearAudio">Apagar áudios baixados</button>
      <p id="install-row" ${deferredInstall ? '' : 'hidden'}><button class="btn wide" data-act="install">Instalar o app</button></p>
    </section>
    <section class="card">
      <h2 class="card-h">Sobre</h2>
      <p class="muted small">Material de estudo criado com IA a partir dos temas da trilha “Engenheiro de IA”. Não é o conteúdo oficial dos cursos nem tem vínculo com os organizadores. As questões são simulações, não questões reais da prova.</p>
      <button class="btn ghost small danger" data-act="reset">Zerar meu progresso</button>
    </section>`;
}

async function fillStorage() {
  const el = $('#storage');
  if (!el || !navigator.storage?.estimate) return;
  try {
    const { usage } = await navigator.storage.estimate();
    const persisted = await navigator.storage.persisted?.();
    el.textContent = `Usando ${fmtMB(usage || 0)} no aparelho.${persisted ? ' Armazenamento protegido contra limpeza automática.' : ''}`;
  } catch (e) { /* ignora */ }
}

function notFound() { return `<header class="page-h"><h1>Não encontrado</h1><p><a href="#/hoje">Voltar para Hoje</a></p></header>`; }

// ------------------------------------------------------------ quiz e simulado
let Q = null;
let quizTimer = null;
function startQuiz(kind, arg) {
  let items; let title;
  if (kind === 'mod') { const md = D.mods[arg]; items = md.quiz; title = `Quiz · Módulo ${md.num}`; }
  else if (kind === 'erros') { items = D.questions.filter((q) => S.wrong[q.id]); title = 'Revisar erros'; }
  else { items = shuffle(D.questions).slice(0, 50); title = 'Simulado'; }
  if (!items.length) { toast('Nenhuma questão disponível.'); return; }
  audio.pause();
  Q = { kind, arg, title, items, i: 0, answers: Array(items.length).fill(null), spoken: -1, done: false,
    limit: kind === 'sim' ? Math.round(items.length * 90) : 0, started: Date.now() };
  clearInterval(quizTimer);
  if (Q.limit) quizTimer = setInterval(tickTimer, 1000);
  go('#/quiz');
}

function tickTimer() {
  if (!Q || Q.done || !Q.limit) { clearInterval(quizTimer); return; }
  const left = Q.limit - Math.floor((Date.now() - Q.started) / 1000);
  const el = $('#timer');
  if (el) { el.textContent = fmtTime(left); el.classList.toggle('warn', left < 300); }
  if (left <= 0) { toast('Tempo esgotado!'); finishQuiz(); }
}

function viewQuiz() {
  if (!Q) return `<header class="page-h"><h1>Nenhum quiz em andamento</h1><p><a href="#/praticar">Ir para Praticar</a></p></header>`;
  if (Q.done) return viewResult();
  const q = Q.items[Q.i];
  const n = Q.items.length;
  const ans = Q.answers[Q.i];
  const sim = Q.kind === 'sim';
  const answered = ans !== null && !sim;
  const opts = q.options.map((o, k) => {
    let cls = '';
    if (answered) { if (k === q.answer) cls = 'right'; else if (k === ans) cls = 'wrong'; else cls = 'dim'; }
    else if (sim && ans === k) cls = 'picked';
    return `<button class="opt ${cls}" data-act="answer" data-arg="${k}" ${answered ? 'disabled' : ''}><b>${LETTERS[k]}</b><span>${esc(o)}</span></button>`;
  }).join('');
  const answeredCount = Q.answers.filter((a) => a !== null).length;
  return `<div class="quiz">
    <div class="quiz-top">
      <button class="back plain" data-act="quitQuiz">‹ Sair</button>
      <span class="muted">${esc(Q.title)}</span>
      ${sim ? '<span id="timer" class="timer">--:--</span>' : `<span class="muted">${Q.i + 1}/${n}</span>`}
    </div>
    <div class="bar"><i style="width:${((Q.i + (answered ? 1 : 0)) / n) * 100}%"></i></div>
    <p class="eyebrow">Pergunta ${Q.i + 1} de ${n} · Módulo ${q.modNum}</p>
    <h1 class="q">${esc(q.q)}</h1>
    <button class="btn ghost small" data-act="speakQ">${I.vol} Ouvir pergunta</button>
    <div class="opts">${opts}</div>
    ${answered ? `<div class="explain ${ans === q.answer ? 'good' : 'bad'}">
        <strong>${ans === q.answer ? 'Isso mesmo!' : `Não foi dessa vez. A certa é a ${LETTERS[q.answer]}.`}</strong>
        <p>${esc(q.explanation)}</p>
        <button class="btn ghost small" data-act="speakE">${I.vol} Ouvir explicação</button>
      </div>
      <button class="btn wide" data-act="nextQ">${Q.i + 1 < n ? 'Próxima pergunta' : 'Ver resultado'}</button>` : ''}
    ${sim ? `<div class="sim-nav">
        <button class="btn ghost" data-act="prevQ" ${Q.i === 0 ? 'disabled' : ''}>Anterior</button>
        ${Q.i + 1 < n ? `<button class="btn" data-act="nextQ">Próxima</button>` : `<button class="btn" data-act="finishQuiz">Entregar (${answeredCount}/${n})</button>`}
      </div>
      <p class="muted small center">Respondidas: ${answeredCount} de ${n}. Você pode voltar e trocar respostas.</p>` : ''}
  </div>`;
}

function afterQuizRender() {
  if (!Q || Q.done) return;
  if (Q.limit) tickTimer();
  if (Q.kind !== 'sim' && S.settings.quizAudio && Q.spoken !== Q.i && Q.answers[Q.i] === null) {
    Q.spoken = Q.i;
    playSeq([Q.items[Q.i].audioQ]);
  }
}

function answer(k) {
  if (!Q || Q.done) return;
  const q = Q.items[Q.i];
  if (Q.kind === 'sim') { Q.answers[Q.i] = k; route(true); return; }
  if (Q.answers[Q.i] !== null) return;
  Q.answers[Q.i] = k;
  const right = k === q.answer;
  if (right) { if (Q.kind === 'erros') delete S.wrong[q.id]; }
  else S.wrong[q.id] = (S.wrong[q.id] || 0) + 1;
  save();
  route(true);
  if (S.settings.quizAudio) playSeq([right ? D.cur.commonAudio.right : D.cur.commonAudio.wrong, q.audioE]);
}

function finishQuiz() {
  if (!Q || Q.done) return;
  clearInterval(quizTimer);
  stopQuizAudio();
  const right = Q.items.filter((q, i) => Q.answers[i] === q.answer).length;
  const score = right / Q.items.length;
  Q.done = true; Q.right = right; Q.score = score;
  if (Q.kind === 'mod') {
    const prev = S.quiz[Q.arg] || { best: 0, attempts: 0 };
    S.quiz[Q.arg] = { best: Math.max(prev.best, score), last: score, attempts: prev.attempts + 1, lastAt: today() };
  }
  if (Q.kind === 'sim') {
    Q.items.forEach((q, i) => { if (Q.answers[i] !== q.answer) S.wrong[q.id] = (S.wrong[q.id] || 0) + 1; });
    S.sims.push({ at: today(), score, right, total: Q.items.length });
  }
  saveNow();
  route();
}

function viewResult() {
  const pct = Math.round(Q.score * 100);
  const msg = pct >= 80 ? 'Excelente! Você domina este conteúdo.' : pct >= 60 ? 'Bom resultado! Revise os pontos que errou.' : 'Vale ouvir as aulas de novo e refazer. Faz parte do processo!';
  let byMod = '';
  if (Q.kind === 'sim') {
    const g = {};
    Q.items.forEach((q, i) => { g[q.modNum] ||= [0, 0]; g[q.modNum][1] += 1; if (Q.answers[i] === q.answer) g[q.modNum][0] += 1; });
    byMod = `<section class="card"><h2 class="card-h">Por módulo</h2><ul class="plain-list">${Object.entries(g).map(([m, [r, t]]) => `<li>Módulo ${m}: <strong>${Math.round((r / t) * 100)}%</strong> (${r}/${t})</li>`).join('')}</ul></section>`;
  }
  const wrongs = Q.items.map((q, i) => ({ q, a: Q.answers[i] })).filter(({ q, a }) => a !== q.answer);
  return `<header class="page-h center">
      <p class="eyebrow">${esc(Q.title)}</p>
      <div class="score">${pct}%</div>
      <p>${Q.right} de ${Q.items.length} certas. ${msg}</p>
    </header>
    ${byMod}
    ${wrongs.length ? `<section class="card"><h2 class="card-h">O que revisar</h2>${wrongs.map(({ q, a }) => `
      <div class="review-q"><p><strong>${esc(q.q)}</strong></p>
      <p class="small">${a === null ? 'Sem resposta.' : `Você marcou ${LETTERS[a]}.`} Certa: <strong>${LETTERS[q.answer]}) ${esc(q.options[q.answer])}</strong></p>
      <p class="muted small">${esc(q.explanation)}</p></div>`).join('')}</section>` : ''}
    <div class="stack">
      ${Q.kind === 'mod' ? `<button class="btn wide" data-act="startQuiz" data-arg="${Q.arg}">Refazer o quiz</button>` : ''}
      ${Object.keys(S.wrong).length ? `<button class="btn ghost wide" data-act="startErros">Revisar questões erradas</button>` : ''}
      <a class="btn ghost wide" href="#/hoje">Voltar para Hoje</a>
    </div>`;
}

// ------------------------------------------------------------ ações
const ACT = {
  play: (id, el) => {
    if (P.id === id && !audio.paused) { audio.pause(); route(true); return; }
    playLesson(id, el.dataset.queue ? el.dataset.queue.split(',') : null);
    route(true);
  },
  toggle: () => togglePlay(),
  skip: (s) => skip(Number(s)),
  speed: (_, el) => setSpeed(Number(el.dataset.speed)),
  closePlayer: () => history.length > 1 ? history.back() : go('#/hoje'),
  playToday: () => {
    const nt = newToday();
    const q = [...nt.next, ...dueReviews().slice(0, 3)].map((l) => l.id);
    if (q.length) { playLesson(q[0], q); route(true); }
  },
  markDone: (id) => { markHeard(id); route(true); toast('Aula marcada como concluída.'); },
  welcomed: () => { S.welcomed = true; save(); route(true); },
  download: (id) => downloadModule(id),
  downloadAll: async () => { for (const m of D.cur.modules.filter((x) => x.available)) await downloadModule(m.id); },
  clearAudio: async () => {
    if (!confirm('Apagar todos os áudios baixados? Você vai precisar de internet para ouvir de novo.')) return;
    await caches.delete(AUDIO_CACHE); toast('Áudios apagados.'); route(true);
  },
  reset: () => {
    if (!confirm('Zerar todo o seu progresso (aulas ouvidas, notas e erros)? Isso não pode ser desfeito.')) return;
    const keep = S.settings; S = defaults(); S.settings = { ...keep, startDate: today() }; S.welcomed = true; saveNow();
    toast('Progresso zerado.'); go('#/hoje');
  },
  install: async () => { if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } },
  applyUpdate: () => { waitingSW?.postMessage('skipWaiting'); },
  startQuiz: (id) => startQuiz('mod', id),
  startErros: () => startQuiz('erros'),
  startSim: () => startQuiz('sim'),
  answer: (k) => answer(Number(k)),
  nextQ: () => {
    if (!Q) return;
    if (Q.i + 1 < Q.items.length) { Q.i += 1; stopQuizAudio(); route(); } else finishQuiz();
  },
  prevQ: () => { if (Q && Q.i > 0) { Q.i -= 1; route(); } },
  finishQuiz: () => {
    const left = Q.answers.filter((a) => a === null).length;
    if (left && !confirm(`Ainda há ${left} sem resposta. Entregar mesmo assim?`)) return;
    finishQuiz();
  },
  quitQuiz: () => {
    if (Q && !Q.done && Q.answers.some((a) => a !== null) && !confirm('Sair do quiz? O progresso desta tentativa será perdido.')) return;
    clearInterval(quizTimer); Q = null; stopQuizAudio(); go('#/praticar');
  },
  speakQ: () => { if (Q) playSeq([Q.items[Q.i].audioQ]); },
  speakE: () => { if (Q) playSeq([Q.items[Q.i].audioE]); },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'INPUT') return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el.dataset.arg, el, e); }
});

document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.act === 'autoNext') { S.settings.autoNext = el.checked; save(); return; }
  const k = el.dataset.set;
  if (!k) return;
  if (el.type === 'checkbox') S.settings[k] = el.checked;
  else if (k === 'newPerDay' || k === 'speed') S.settings[k] = Number(el.value);
  else if (el.value) S.settings[k] = el.value;
  if (k === 'speed') setSpeed(S.settings.speed);
  save();
  toast('Salvo.');
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'seek') {
    const v = Number(e.target.value);
    e.target.style.setProperty('--p', `${(v / (Number(e.target.max) || 1)) * 100}%`);
    if (P.id) audio.currentTime = v;
  }
});

// ------------------------------------------------------------ instalação e atualização
let deferredInstall = null;
let waitingSW = null;
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  const r = $('#install-row'); if (r) r.hidden = false;
});

function showUpdate(sw) { waitingSW = sw; $('#update').hidden = false; }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(nw);
      });
    });
  }).catch(() => { /* sem service worker: funciona só online */ });
  let reloading = false;
  const hadController = !!navigator.serviceWorker.controller; // 1ª visita: não recarrega
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return; reloading = true; saveNow(); location.reload();
  });
}

// ------------------------------------------------------------ início
(async function start() {
  try {
    await loadData();
  } catch (e) {
    $('#main').innerHTML = `<header class="page-h"><h1>Não consegui carregar o conteúdo</h1>
      <p>Abra o app uma vez com internet para ele baixar tudo. Depois funciona offline.</p>
      <button class="btn" onclick="location.reload()">Tentar de novo</button></header>`;
    return;
  }
  if (S.lastId && D.byId[S.lastId]) {
    P.id = S.lastId;
    const L = D.byId[P.id];
    P.queue = D.mods[L.mod].lessons.slice(L.index).map((l) => l.id);
    audio.defaultPlaybackRate = S.settings.speed;
    audio.src = L.audio;
    const pos = S.lessons[P.id]?.pos || 0;
    audio.addEventListener('loadedmetadata', () => { if (pos > 3 && pos < audio.duration - 5) audio.currentTime = pos; }, { once: true });
    P.lastT = pos;
    setMediaSession(L);
  }
  route();
})();

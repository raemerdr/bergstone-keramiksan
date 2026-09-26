/* Bergstone Keramiksan — 360° showroom tour: room graph + UI on top of PanoViewer.
   Photos: Insta360 Pro originals → assets/tour/rooms/{room}-{2k|4k|6k}.jpg (see the build script notes). */
import { PanoViewer, isSupported } from './pano.js';

const BASE = new URL('../tour/', import.meta.url);
const EYE_HEIGHT = 1.6;            // metres; puts link markers on the floor
const DEG = 180 / Math.PI;

/* Room graph taken over from the original tour project.
   view  = arrival view [pan, tilt, fov]   (pan + = left, fov diagonal)
   links = [pan, target room, arrival view in target, distance to the next position in m] */
const ROOMS = {
  node1: { view: [44.08, -3.72, 100], links: [[159.6, 'node2', [121.9, 1.1, 100], 4.4], [39.61, 'node6', [42.9, 2.2, 100], 4.26]] },
  node2: { view: [121.9, 1.1, 100], links: [[-64.48, 'node1', [44.6, -0.6, 100], 4.4], [120.69, 'node5', [-128.1, 7.3, 100], 4.36]] },
  node5: { view: [-128.1, 7.3, 100], links: [[-189.21, 'node2', [-59.3, 0.5, 100], 4.36]] },
  node6: { view: [42.9, 2.2, 100], links: [[200.32, 'node1', [154.8, -0.5, 100], 4.26], [129.93, 'node7', [176.5, -0.1, 100], 4.28], [47.06, 'node8', [-115.4, 1.6, 100], 4.35]] },
  node7: { view: [176.5, -0.1, 100], links: [[90.87, 'node6', [40.2, 1.7, 100], 4.28]] },
  node8: { view: [-115.4, 1.6, 100], links: [[-276.89, 'node6', [-168.2, 0.9, 100], 4.35], [243.73, 'node4', [61.6, -2.4, 100], 4.25]] },
  node4: { view: [61.6, -2.4, 100], links: [[-279.4, 'node8', [62.5, 0.6, 100], 4.25], [-210, 'node9', [-78, 0.1, 100], 4.14]] },
  node9: { view: [-78, 0.1, 100], links: [[98.74, 'node4', [-13.6, -1.6, 100], 4.14], [-78.31, 'node10', [-31.5, 2.1, 100], 4.3]] },
  node10: { view: [-31.5, 2.1, 100], links: [[148.28, 'node9', [101.7, 0, 100], 4.3], [-29.14, 'node11', [-125.6, 2.4, 100], 4.32]] },
  node11: { view: [-125.6, 2.4, 100], links: [[2.43, 'node10', [150.9, 0, 100], 4.32], [-47.99, 'node12', [-119.1, -1.1, 100], 4.23]] },
  node12: { view: [-119.1, -1.1, 100], links: [[60.8, 'node11', [136.7, 1.1, 100], 4.23], [241.93, 'node13', [-76.6, -3.9, 100], 4.35]] },
  node13: { view: [-76.6, -3.9, 100], links: [[108.18, 'node12', [63.2, 0.1, 100], 4.35], [281.41, 'node14', [-173.9, -4.9, 100], 4.29]] },
  node14: { view: [-173.9, -4.9, 100], links: [[77.97, 'node13', [101.4, 0, 100], 4.29], [178.76, 'node15', [-101.9, -2.6, 100], 4.32]] },
  node15: { view: [-101.9, -2.6, 100], links: [[91.82, 'node14', [77.7, -0.3, 100], 4.32], [-99.83, 'node16', [156.9, -2.9, 100], 4.18]] },
  node16: { view: [156.9, -2.9, 100], links: [[-21.22, 'node15', [80.2, 0, 100], 4.18], [-204.25, 'node17', [-98.9, -9.2, 100], 4.26]] },
  node17: { view: [-98.9, -9.2, 100], links: [[95.26, 'node16', [-24.3, 0, 100], 4.26], [-179.13, 'node11', [38.7, -2, 100], 17.72]] },
};
const ORDER = ['node1', 'node2', 'node5', 'node6', 'node7', 'node8', 'node4', 'node9', 'node10', 'node11', 'node12', 'node13', 'node14', 'node15', 'node16', 'node17'];

/** Same room and view as the hero poster (assets/img/tour/hero-360*.jpg), so the hand-off is seamless. */
export const HERO_VIEW = { room: 'node16', pan: 172, tilt: -2, fov: 100 };

const toView = ([pan, tilt, fov]) => ({ pan, tilt, fov });

export function createTour({ hero, t: translate }) {
  if (!isSupported()) return null;
  const t = (key) => translate(key) ?? key;

  const stage = hero.querySelector('[data-tour-stage]');
  const ui = {
    name: hero.querySelector('[data-pano-room-name]'),
    panel: hero.querySelector('#pano-rooms'),
    list: hero.querySelector('[data-pano-roomlist]'),
    rooms: hero.querySelector('[data-pano-rooms]'),
    fullscreen: hero.querySelector('[data-pano-fullscreen]'),
    toast: hero.querySelector('[data-pano-toast]'),
  };

  const canvas = document.createElement('canvas');
  canvas.className = 'pano-canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  const spotLayer = document.createElement('div');
  spotLayer.className = 'pano-spots';

  let viewer;
  try {
    viewer = new PanoViewer(canvas, { onFrame: placeSpots, onScrollIntent: zoomHint });
  } catch (err) {
    console.warn('[tour]', err);
    return null;
  }

  // 6K for large, fine-pointer screens that can hold it; 4K elsewhere (phones, tablets, data saver)
  const coarse = matchMedia('(pointer: coarse)').matches;
  const screenPx = Math.max(screen.width, screen.height) * Math.min(devicePixelRatio || 1, 2);
  const quality = !coarse && !navigator.connection?.saveData && viewer.maxTextureSize >= 6144 && screenPx >= 1600 ? '6k' : '4k';
  const src = (id, size = quality) => new URL(`rooms/${id}-${size}.jpg`, BASE).href;

  let room = null;
  let spots = [];
  let moving = false;
  let isOpen = false;
  let toastTimer = 0;
  let lastHint = 0;

  /* ---------- Rooms ---------- */
  function enterRoom(id) {
    room = id;
    ui.name.textContent = t(`room.${id}`);
    canvas.setAttribute('aria-label', t('pano.canvas').replace('{room}', t(`room.${id}`)));
    ui.list.querySelectorAll('[data-room]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.room === id)));
    buildSpots(id);
  }

  function buildSpots(id) {
    spots = ROOMS[id].links.map(([pan, target, arrival, dist]) => {
      const tilt = -Math.atan2(EYE_HEIGHT, dist) * DEG;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'pano-spot is-off';
      const disc = document.createElement('span');
      disc.className = 'pano-spot__disc';
      disc.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'pano-spot__label';
      el.append(disc, label);
      el.addEventListener('click', () => go(target, { from: { pan, tilt }, arrival }));
      // Keyboard users: bring an off-screen marker into view when it receives focus
      el.addEventListener('focus', () => {
        if (el.classList.contains('is-off')) viewer.turnTo({ pan, tilt: tilt + 14, fov: viewer.cam.fov }, 500);
      });
      return { el, label, pan, tilt, dist, target };
    });
    labelSpots();
    spotLayer.replaceChildren(...spots.map((s) => s.el));
    placeSpots();
  }

  function labelSpots() {
    spots.forEach((s) => {
      const name = t(`room.${s.target}`);
      s.label.textContent = name;
      s.el.setAttribute('aria-label', `${t('pano.goTo')}: ${name}`);
    });
  }

  /** Runs every rendered frame: pin each marker to its spot on the floor. */
  function placeSpots() {
    const ppr = viewer.pixelsPerRadian;
    for (const s of spots) {
      const p = viewer.project(s.pan, s.tilt);
      const off = !p || p.x < -60 || p.y < -60 || p.x > viewer.cssW + 60 || p.y > viewer.cssH + 60;
      s.el.classList.toggle('is-off', off);
      if (off) continue;
      const range = Math.hypot(s.dist, EYE_HEIGHT);
      s.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      s.el.style.setProperty('--r', `${Math.min(64, Math.max(15, (ppr * 0.34) / range)).toFixed(1)}px`);
      s.el.style.setProperty('--flat', Math.max(0.3, EYE_HEIGHT / range).toFixed(3));
    }
  }

  /** Walk to another room: turn toward the doorway and lean in, then cross-fade into the arrival view. */
  async function go(target, { from, arrival } = {}) {
    if (moving || !isOpen || target === room) return;
    moving = true;
    hero.classList.add('is-moving');
    togglePanel(false);
    const view = toView(arrival || ROOMS[target].view);
    const quick = viewer.texture(src(target, '2k'));
    const lean = from ? viewer.turnTo({ pan: from.pan, tilt: -6, fov: Math.max(viewer.minFov + 6, viewer.cam.fov * 0.72) }, 560) : Promise.resolve();
    try {
      const [rec] = await Promise.all([quick, lean]);
      if (!isOpen) return;
      await viewer.crossfade(rec, view, from ? { duration: 700, inScale: 0.84, outScale: 0.78 } : { duration: 550, inScale: 0.96, outScale: 1 });
      if (!isOpen) return;
      enterRoom(target);
      // Sharpen once the full-size photo has arrived
      viewer.texture(src(target)).then((hd) => { if (isOpen && room === target) viewer.upgrade(hd); }).catch(() => {});
      prefetchNeighbours(target);
    } catch (err) {
      console.warn('[tour]', err);
      toast(t('pano.error'));
    } finally {
      moving = false;
      hero.classList.remove('is-moving');
    }
  }

  function prefetchNeighbours(id) {
    ROOMS[id].links.forEach(([, target]) => { fetch(src(target, '2k'), { priority: 'low' }).catch(() => {}); });
  }

  /* ---------- Room list ---------- */
  function buildList() {
    ui.list.replaceChildren(...ORDER.map((id) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pano-card';
      button.dataset.room = id;
      const img = document.createElement('img');
      img.src = new URL(`thumbs/${id}.jpg`, BASE).href;
      img.alt = '';
      img.width = 320;
      img.height = 200;
      img.loading = 'lazy';
      const name = document.createElement('span');
      button.append(img, name);
      button.addEventListener('click', () => go(id));
      li.append(button);
      return li;
    }));
    nameList();
  }

  function nameList() {
    ui.list.querySelectorAll('[data-room]').forEach((b) => { b.lastElementChild.textContent = t(`room.${b.dataset.room}`); });
  }

  function togglePanel(force) {
    const open = force ?? ui.panel.hidden;
    ui.panel.hidden = !open;
    ui.rooms.setAttribute('aria-expanded', String(open));
    hero.classList.toggle('is-rooms', open);
    if (open) {
      const current = ui.list.querySelector('[aria-current="true"]');
      if (current) ui.list.scrollLeft = current.offsetLeft - (ui.list.clientWidth - current.offsetWidth) / 2;
    }
  }

  /* ---------- Controls ---------- */
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const canFullscreen = !!(hero.requestFullscreen || hero.webkitRequestFullscreen);
  ui.fullscreen.hidden = !canFullscreen;

  function toggleFullscreen() {
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (hero.requestFullscreen || hero.webkitRequestFullscreen).call(hero);
  }

  function syncFullscreen() {
    const on = fsElement() === hero;
    hero.classList.toggle('is-fullscreen', on);
    ui.fullscreen.setAttribute('aria-label', t(on ? 'pano.fullscreenExit' : 'pano.fullscreen'));
    ui.fullscreen.querySelector('use').setAttribute('href', on ? '#i-shrink' : '#i-expand');
    viewer.resize();
  }

  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove('is-shown'), 2600);
  }

  function zoomHint() {
    if (Date.now() - lastHint < 6000) return;
    lastHint = Date.now();
    toast(t('pano.zoomHint'));
  }

  hero.querySelectorAll('[data-pano-zoom]').forEach((b) => b.addEventListener('click', () => viewer.zoomBy(b.dataset.panoZoom === 'in' ? 0.78 : 1.28)));
  ui.rooms.addEventListener('click', () => togglePanel());
  ui.fullscreen.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', syncFullscreen);
  document.addEventListener('webkitfullscreenchange', syncFullscreen);
  // Escape closes the room list before it ends the tour
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !ui.panel.hidden) { e.stopPropagation(); togglePanel(false); ui.rooms.focus(); }
  });

  // Only render while the hero is on screen
  new IntersectionObserver(([entry]) => {
    if (!isOpen) return;
    if (entry.isIntersecting) viewer.start(); else viewer.stop();
  }).observe(hero);

  buildList();
  syncFullscreen();

  return {
    /** Warm-up on intent: fetch and upload the hero room before the click. */
    prefetch() { viewer.texture(src(HERO_VIEW.room)).catch(() => {}); },

    /** Resolves once the hero room is on screen at the poster's exact view. */
    async open(view = HERO_VIEW) {
      stage.replaceChildren(canvas, spotLayer);
      isOpen = true;
      viewer.interactive = true;
      viewer.start();
      const rec = await viewer.texture(src(view.room));
      if (!isOpen) return false;
      viewer.show(rec, view);
      enterRoom(view.room);
      await viewer.nextFrame();
      prefetchNeighbours(view.room);
      return true;
    },

    close() {
      isOpen = false;
      togglePanel(false);
      if (fsElement() === hero) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      viewer.stop();
      viewer.release();
      spots = [];
      spotLayer.replaceChildren();
      room = null;
    },

    setLang() {
      nameList();
      if (room) {
        ui.name.textContent = t(`room.${room}`);
        canvas.setAttribute('aria-label', t('pano.canvas').replace('{room}', t(`room.${room}`)));
        labelSpots();
      }
      syncFullscreen();
    },
  };
}

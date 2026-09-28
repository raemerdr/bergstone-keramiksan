/* Bergstone Keramiksan — 360° showroom tour: hotspots and room changes on top of PanoViewer.
   Loaded on intent (hover/focus on a tour trigger). The tour chrome around it — room pill, toolbar,
   room list, toast — is React (components/home/hero-tour.tsx) and follows the hooks below. */
import type { ClientKey, Translate } from '@/lib/i18n';
import { PanoViewer, isSupported } from './pano-viewer';
import { HERO_VIEW, ROOMS, roomPhoto, type RoomId, type View, type ViewTuple } from './rooms';

const EYE_HEIGHT = 1.6;            // metres; puts link markers on the floor
const DEG = 180 / Math.PI;

const toView = ([pan, tilt, fov]: ViewTuple): View => ({ pan, tilt, fov });

export interface TourHooks {
  /** A room is on screen (also after a language change, to refresh its name). */
  onRoom(id: RoomId): void;
  /** Walking between rooms: the hotspots fade and the room list closes. */
  onMoving(moving: boolean): void;
  onError(): void;
  /** Wheel without Ctrl/⌘ over the viewer: the page scrolls, so hint at how to zoom. */
  onScrollIntent(): void;
}

interface Spot { el: HTMLButtonElement; label: HTMLSpanElement; pan: number; tilt: number; dist: number; target: RoomId }

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

export class ShowroomTour {
  /** Resolves to null where WebGL2 is unavailable (the hosted tour takes over). */
  static create(host: HTMLElement, hero: HTMLElement, t: Translate<ClientKey>, hooks: TourHooks) {
    if (!isSupported()) return null;
    try {
      return new ShowroomTour(host, hero, t, hooks);
    } catch (err) {
      console.warn('[tour]', err);
      return null;
    }
  }

  private readonly canvas = document.createElement('canvas');
  private readonly spotLayer = document.createElement('div');
  private readonly viewer: PanoViewer;
  private readonly visibility: IntersectionObserver;
  private readonly quality: '4k' | '6k';
  private room: RoomId | null = null;
  private spots: Spot[] = [];
  private moving = false;
  private isOpen = false;

  private constructor(private readonly host: HTMLElement, hero: HTMLElement, private t: Translate<ClientKey>, private readonly hooks: TourHooks) {
    this.canvas.className = 'pano-canvas';
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.spotLayer.className = 'pano-spots';
    this.viewer = new PanoViewer(this.canvas, { onFrame: () => this.placeSpots(), onScrollIntent: hooks.onScrollIntent });

    // 6K for large, fine-pointer screens that can hold it; 4K elsewhere (phones, tablets, data saver)
    const coarse = matchMedia('(pointer: coarse)').matches;
    const screenPx = Math.max(screen.width, screen.height) * Math.min(devicePixelRatio || 1, 2);
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    this.quality = !coarse && !saveData && this.viewer.maxTextureSize >= 6144 && screenPx >= 1600 ? '6k' : '4k';

    // Only render while the hero is on screen
    this.visibility = new IntersectionObserver(([entry]) => {
      if (!this.isOpen) return;
      if (entry.isIntersecting) this.viewer.start(); else this.viewer.stop();
    });
    this.visibility.observe(hero);
  }

  private src(id: RoomId, size: '2k' | '4k' | '6k' = this.quality) {
    return roomPhoto(id, size);
  }

  /* ---------- Rooms ---------- */
  private enterRoom(id: RoomId) {
    this.room = id;
    this.labelCanvas();
    this.buildSpots(id);
    this.hooks.onRoom(id);
  }

  private labelCanvas() {
    if (this.room) this.canvas.setAttribute('aria-label', this.t('pano.canvas').replace('{room}', this.t(`room.${this.room}`)));
  }

  private buildSpots(id: RoomId) {
    this.spots = ROOMS[id].links.map(([pan, target, arrival, dist]) => {
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
      el.addEventListener('click', () => this.go(target, { from: { pan, tilt }, arrival }));
      // Keyboard users: bring an off-screen marker into view when it receives focus
      el.addEventListener('focus', () => {
        if (el.classList.contains('is-off') && this.viewer.cam) this.viewer.turnTo({ pan, tilt: tilt + 14, fov: this.viewer.cam.fov }, 500);
      });
      return { el, label, pan, tilt, dist, target };
    });
    this.labelSpots();
    this.spotLayer.replaceChildren(...this.spots.map((s) => s.el));
    this.placeSpots();
  }

  private labelSpots() {
    this.spots.forEach((s) => {
      const name = this.t(`room.${s.target}`);
      s.label.textContent = name;
      s.el.setAttribute('aria-label', `${this.t('pano.goTo')}: ${name}`);
    });
  }

  /** Runs every rendered frame: pin each marker to its spot on the floor. */
  private placeSpots() {
    const viewer = this.viewer;
    const ppr = viewer.pixelsPerRadian;
    for (const s of this.spots) {
      const p = viewer.project(s.pan, s.tilt);
      const off = !p || p.x < -60 || p.y < -60 || p.x > viewer.cssW + 60 || p.y > viewer.cssH + 60;
      s.el.classList.toggle('is-off', off);
      if (!p || off) continue;
      const range = Math.hypot(s.dist, EYE_HEIGHT);
      s.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      s.el.style.setProperty('--r', `${Math.min(64, Math.max(15, (ppr * 0.34) / range)).toFixed(1)}px`);
      s.el.style.setProperty('--flat', Math.max(0.3, EYE_HEIGHT / range).toFixed(3));
    }
  }

  /** Walk to another room: turn toward the doorway and lean in, then cross-fade into the arrival view. */
  async go(target: RoomId, { from, arrival }: { from?: { pan: number; tilt: number }; arrival?: ViewTuple } = {}) {
    if (this.moving || !this.isOpen || target === this.room) return;
    const viewer = this.viewer;
    this.moving = true;
    this.hooks.onMoving(true);
    const view = toView(arrival || ROOMS[target].view);
    const quick = viewer.texture(this.src(target, '2k'));
    const lean = from && viewer.cam ? viewer.turnTo({ pan: from.pan, tilt: -6, fov: Math.max(viewer.minFov + 6, viewer.cam.fov * 0.72) }, 560) : Promise.resolve();
    try {
      const [rec] = await Promise.all([quick, lean]);
      if (!this.isOpen) return;
      await viewer.crossfade(rec, view, from ? { duration: 700, inScale: 0.84, outScale: 0.78 } : { duration: 550, inScale: 0.96, outScale: 1 });
      if (!this.isOpen) return;
      this.enterRoom(target);
      // Sharpen once the full-size photo has arrived
      viewer.texture(this.src(target)).then((hd) => { if (this.isOpen && this.room === target) viewer.upgrade(hd); }).catch(() => {});
      this.prefetchNeighbours(target);
    } catch (err) {
      console.warn('[tour]', err);
      this.hooks.onError();
    } finally {
      this.moving = false;
      this.hooks.onMoving(false);
    }
  }

  private prefetchNeighbours(id: RoomId) {
    ROOMS[id].links.forEach(([, target]) => { fetch(this.src(target, '2k'), { priority: 'low' }).catch(() => {}); });
  }

  /* ---------- Public API ---------- */
  /** Warm-up on intent: fetch and upload the hero room before the click. */
  prefetch() { this.viewer.texture(this.src(HERO_VIEW.room)).catch(() => {}); }

  /** Resolves once the hero room is on screen at the poster's exact view. */
  async open(view = HERO_VIEW) {
    this.host.replaceChildren(this.canvas, this.spotLayer);
    this.isOpen = true;
    this.viewer.interactive = true;
    this.viewer.start();
    const rec = await this.viewer.texture(this.src(view.room));
    if (!this.isOpen) return false;
    this.viewer.show(rec, view);
    this.enterRoom(view.room);
    await this.viewer.nextFrame();
    this.prefetchNeighbours(view.room);
    return true;
  }

  close() {
    this.isOpen = false;
    this.viewer.stop();
    this.viewer.release();
    this.spots = [];
    this.spotLayer.replaceChildren();
    this.room = null;
  }

  /** The homepage unmounted (client-side navigation): free the GL context for the next visit. */
  destroy() {
    this.close();
    this.visibility.disconnect();
    this.viewer.resizeObserver.disconnect();
    this.viewer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.host.replaceChildren();
  }

  zoomBy(factor: number) { this.viewer.zoomBy(factor); }

  resize() { this.viewer.resize(); }

  setTranslations(t: Translate<ClientKey>) {
    this.t = t;
    this.labelCanvas();
    this.labelSpots();
    if (this.room) this.hooks.onRoom(this.room);
  }
}

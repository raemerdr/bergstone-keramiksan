'use client';
/* Homepage hero ⇄ live 360° tour. Starting it swaps the poster for the tour at the entrance: the
   in-house WebGL viewer (lib/tour, loaded on intent) or, without WebGL2, the hosted Pano2VR tour. */
import { createContext, use, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { Icon } from '@/components/icons';
import { useT } from '@/components/i18n';
import { SplitHeading, whenReady } from '@/components/motion';
import { useTourRef } from '@/components/tour-triggers';
import { HOSTED_TOUR } from '@/lib/site';
import { ROOM_ORDER, roomThumb, type RoomId } from '@/lib/tour/rooms';
import type { ShowroomTour } from '@/lib/tour/showroom-tour';
import { cx, prefersReducedMotion } from '@/lib/ui';

const HeroContext = createContext({ inView: false, replay: 0 });

/** The hero headline: enters with the hero and replays when the tour closes. */
export function HeroTitle({ children }: { children: string }) {
  const { inView, replay } = use(HeroContext);
  return <SplitHeading as="h1" className="h1 hero__title" id="hero-title" revealed={inView} replay={replay}>{children}</SplitHeading>;
}

type WebkitDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => void };

const fullscreenElement = () => document.fullscreenElement ?? (document as WebkitDocument).webkitFullscreenElement ?? null;

function exitFullscreen() {
  const doc = document as WebkitDocument;
  if (doc.exitFullscreen) doc.exitFullscreen();
  else doc.webkitExitFullscreen?.();
}

function requestFullscreen(el: WebkitElement) {
  if (el.requestFullscreen) el.requestFullscreen();
  else el.webkitRequestFullscreen?.();
}

const noSubscribe = () => () => {};
const fullscreenSupported = () => 'requestFullscreen' in Element.prototype || 'webkitRequestFullscreen' in Element.prototype;

interface Controller {
  exit(): void;
  embedLoaded(): void;
}

export function HeroTour({ alt, children }: { alt: string; children: ReactNode }) {
  const t = useT();
  const tourRef = useTourRef();
  const hero = useRef<HTMLElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const exitButton = useRef<HTMLButtonElement>(null);
  const roomsButton = useRef<HTMLButtonElement>(null);
  const roomList = useRef<HTMLUListElement>(null);
  const controller = useRef<Controller | null>(null);
  const tour = useRef<ShowroomTour | null>(null);
  const tRef = useRef(t);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastHint = useRef(0);

  const [inView, setInView] = useState(false);
  const [replay, setReplay] = useState(0);
  const [touring, setTouring] = useState(false);
  const [pano, setPano] = useState(false);
  const [embed, setEmbed] = useState(false);
  const [live, setLive] = useState(false);
  const [moving, setMoving] = useState(false);
  const [room, setRoom] = useState<RoomId | null>(null);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [toast, setToast] = useState({ text: '', shown: false });
  const canFullscreen = useSyncExternalStore(noSubscribe, fullscreenSupported, () => false);

  const showToast = useCallback((text: string) => {
    setToast({ text, shown: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, shown: false })), 2600);
  }, []);

  /* ---------- Entrance: banner, then headline lines, then copy + actions ---------- */
  useEffect(() => {
    const img = poster.current;
    let cancelled = false;
    let started = false;
    const begin = () => {
      if (started || cancelled) return;
      started = true;
      requestAnimationFrame(() => { if (!cancelled) setInView(true); });
    };
    whenReady().then(() => {
      if (cancelled || !img) return;
      if (img.complete) { begin(); return; }
      img.addEventListener('load', begin, { once: true });
      img.addEventListener('error', begin, { once: true });
      setTimeout(begin, 2500);
    });
    return () => { cancelled = true; };
  }, []);

  /* ---------- Hero ⇄ tour ---------- */
  useEffect(() => {
    let session = 0;
    let touringNow = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let returnTo: HTMLElement | null = null;
    let embedSession = 0;
    let tourPromise: Promise<ShowroomTour | null> | null = null;
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    // The viewer module loads on intent; resolves to null where WebGL2 is unavailable
    const loadTour = () => (tourPromise ??= import('@/lib/tour/showroom-tour')
      .then(({ ShowroomTour }) => {
        if (!host.current || !hero.current) return null;
        return ShowroomTour.create(host.current, hero.current, tRef.current, {
          onRoom: setRoom,
          onMoving: (value) => { setMoving(value); if (value) setRoomsOpen(false); },
          onError: () => showToast(tRef.current('pano.error')),
          onScrollIntent: () => {
            if (Date.now() - lastHint.current < 6000) return;
            lastHint.current = Date.now();
            showToast(tRef.current('pano.zoomHint'));
          },
        });
      })
      .then((instance) => (tour.current = instance))
      .catch((err) => { console.warn('[tour]', err); return null; }));

    const reveal = () => {
      clearTimers();
      setLive(true);
    };

    async function start(trigger: HTMLElement) {
      if (touringNow) return;
      const id = ++session;
      touringNow = true;
      returnTo = trigger;
      if (!hero.current?.contains(trigger)) scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      setTouring(true);
      exitButton.current?.focus({ preventScroll: true });

      const instance = await loadTour();
      if (id !== session) return;
      if (instance) {
        setPano(true);
        try {
          // Opens at the entrance; the poster cross-fades into it
          if (await instance.open()) { if (id === session) reveal(); return; }
        } catch (err) {
          console.warn('[tour]', err);
        }
        if (id !== session) return;
        setPano(false);
      }
      embed(id);
    }

    function embed(id: number) {
      embedSession = id;
      setEmbed(true);
      timers.push(setTimeout(() => { if (id === session) reveal(); }, HOSTED_TOUR.maxWaitMs));
    }

    function embedLoaded() {
      const id = embedSession;
      timers.push(setTimeout(() => { if (id === session) reveal(); }, HOSTED_TOUR.settleMs));
    }

    function exit() {
      if (!touringNow) return;
      session++;
      touringNow = false;
      clearTimers();
      flushSync(() => { setLive(false); setTouring(false); });   // content is interactive again before focus returns

      // Release the viewer (or the embedded tour) once it has faded out
      setTimeout(() => {
        if (touringNow) return;
        setPano(false);
        setEmbed(false);
        if (fullscreenElement() === hero.current) exitFullscreen();
        tour.current?.close();
      }, prefersReducedMotion() ? 0 : 900);

      setReplay((n) => n + 1);   // replay the headline entrance on the way back
      const target = returnTo && document.contains(returnTo) && !returnTo.closest('[aria-hidden="true"]')
        ? returnTo
        : content.current?.querySelector<HTMLElement>('[data-tour-start]');
      target?.focus({ preventScroll: true });
    }

    controller.current = { exit, embedLoaded };
    const control = { start, warm: () => { loadTour().then((instance) => instance?.prefetch()); } };
    tourRef.current = control;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && touringNow && !fullscreenElement()) exit();
    };
    document.addEventListener('keydown', onKey);

    // Arriving from a "360°" link on another page
    let autoStart: ReturnType<typeof setTimeout> | undefined;
    if (location.hash === '#360') {
      autoStart = setTimeout(() => {
        history.replaceState(null, '', location.pathname + location.search);
        const trigger = content.current?.querySelector<HTMLElement>('[data-tour-start]');
        if (trigger) start(trigger);
      });
    }

    return () => {
      session++;
      clearTimers();
      clearTimeout(autoStart);
      clearTimeout(toastTimer.current);
      document.removeEventListener('keydown', onKey);
      if (tourRef.current === control) tourRef.current = null;
      controller.current = null;
      tourPromise?.then((instance) => instance?.destroy());
      tour.current = null;
    };
  }, [tourRef, showToast]);

  // Language switch (development): relabel the tour
  useEffect(() => {
    tRef.current = t;
    tour.current?.setTranslations(t);
  }, [t]);

  useEffect(() => {
    const sync = () => {
      setFullscreen(!!hero.current && fullscreenElement() === hero.current);
      tour.current?.resize();
    };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  function toggleFullscreen() {
    if (fullscreenElement()) exitFullscreen();
    else if (hero.current) requestFullscreen(hero.current);
  }

  // Escape closes the room list before it ends the tour (the tour listens on the document)
  useEffect(() => {
    const el = hero.current;
    if (!el || !roomsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setRoomsOpen(false);
      roomsButton.current?.focus();
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [roomsOpen]);

  // Centre the current room when the list opens
  useLayoutEffect(() => {
    const list = roomList.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (roomsOpen && list && current) list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
  }, [roomsOpen]);

  const classes = cx(
    'hero', inView && 'is-in', touring && 'is-touring', pano && 'is-pano', embed && 'is-embed', live && 'is-live',
    moving && 'is-moving', roomsOpen && 'is-rooms', fullscreen && 'is-fullscreen',
  );

  return (
    <HeroContext value={{ inView, replay }}>
      <section ref={hero} className={classes} data-hero aria-labelledby="hero-title">
        <div className="hero__media">
          <picture>
            <source media="(max-width: 699px)" srcSet="/assets/img/hero/home-mobile.jpg" width={1040} height={780} />
            <img ref={poster} src="/assets/img/hero/home.jpg" width={2560} height={1440} fetchPriority="high" alt={alt} />
          </picture>
        </div>
        <div className="hero__tour">
          <div ref={host} />
          {embed && (
            <iframe
              src={`${HOSTED_TOUR.url}#${HOSTED_TOUR.view}`}
              title={t('tour.frame')}
              allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
              onLoad={() => controller.current?.embedLoaded()}
            />
          )}
        </div>
        <div ref={content} className="hero__content" inert={touring}>{children}</div>
        <p className="tour-loading" role="status"><Icon name="360" /><span>{touring && !live ? t('tour.loading') : ''}</span></p>
        <div className="tour-bar">
          <button ref={exitButton} className="tour-bar__exit" type="button" onClick={() => controller.current?.exit()}>
            <Icon name="close" /><span>{t('tour.exit')}</span>
          </button>
        </div>
        <p className="tour-hint">{t('tour.hint')}</p>

        {/* Own 360° viewer UI (shown while touring) */}
        <p className="pano-room" aria-live="polite"><Icon name="360" /><span>{room ? t(`room.${room}`) : ''}</span></p>
        <div className="pano-ui" role="toolbar" aria-label={t('pano.controls')}>
          <button className="pano-btn" type="button" aria-label={t('pano.zoomOut')} onClick={() => tour.current?.zoomBy(1.28)}><Icon name="minus" /></button>
          <button className="pano-btn" type="button" aria-label={t('pano.zoomIn')} onClick={() => tour.current?.zoomBy(0.78)}><Icon name="plus" /></button>
          <button ref={roomsButton} className="pano-btn pano-btn--text" type="button" aria-expanded={roomsOpen} aria-controls="pano-rooms" onClick={() => setRoomsOpen((open) => !open)}>
            <Icon name="grid" /><span>{t('pano.rooms')}</span>
          </button>
          <button className="pano-btn" type="button" hidden={!canFullscreen} aria-label={t(fullscreen ? 'pano.fullscreenExit' : 'pano.fullscreen')} onClick={toggleFullscreen}>
            <Icon name={fullscreen ? 'shrink' : 'expand'} />
          </button>
        </div>
        <div className="pano-rooms" id="pano-rooms" hidden={!roomsOpen}>
          <ul ref={roomList} className="pano-rooms__list" data-lenis-prevent-horizontal>
            {pano && ROOM_ORDER.map((id) => (
              <li key={id}>
                <button type="button" className="pano-card" aria-current={room === id} onClick={() => tour.current?.go(id)}>
                  <img src={roomThumb(id)} alt="" width={320} height={200} loading="lazy" />
                  <span>{t(`room.${id}`)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className={cx('pano-toast', toast.shown && 'is-shown')} role="status">{toast.text}</p>
      </section>
    </HeroContext>
  );
}

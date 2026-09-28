'use client';
/* Carousels: native scroll + snap; the arrow buttons page by the number of fully visible items. */
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { Icon } from '@/components/icons';
import { useReveal } from '@/components/motion';
import { cx, prefersReducedMotion } from '@/lib/ui';

interface CarouselApi {
  scroller: RefObject<HTMLElement | null>;
  canPrev: boolean;
  canNext: boolean;
  go(dir: 1 | -1): void;
}

const CarouselContext = createContext<CarouselApi | null>(null);

function useCarousel() {
  const api = use(CarouselContext);
  if (!api) throw new Error('Carousel is missing');
  return api;
}

export function Carousel({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLElement>(null);
  const [nav, setNav] = useState({ canPrev: false, canNext: true });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const canPrev = el.scrollLeft > 2;
      const canNext = el.scrollLeft < el.scrollWidth - el.clientWidth - 2;
      setNav((prev) => (prev.canPrev === canPrev && prev.canNext === canNext ? prev : { canPrev, canNext }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    const list = el?.querySelector('ul') ?? el;
    const item = list?.firstElementChild as HTMLElement | null;
    if (!el || !list || !item) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const perPage = Math.max(1, Math.floor((el.clientWidth + gap) / (item.offsetWidth + gap)));
    el.scrollBy({ left: dir * perPage * (item.offsetWidth + gap), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const api = useMemo(() => ({ scroller, go, ...nav }), [go, nav]);
  return <CarouselContext value={api}>{children}</CarouselContext>;
}

export function CarouselButton({ dir, label, className }: { dir: 'prev' | 'next'; label: string; className: string }) {
  const { canPrev, canNext, go } = useCarousel();
  return (
    <button className={className} type="button" aria-label={label} disabled={dir === 'prev' ? !canPrev : !canNext} onClick={() => go(dir === 'prev' ? -1 : 1)}>
      <Icon name={dir} />
    </button>
  );
}

/** The scrolling element. With `reveal`, it is also a `data-reveal="items"` group. */
export function CarouselTrack({ as: Tag = 'div', reveal, className, ...props }: { as?: 'div' | 'ul'; reveal?: boolean } & HTMLAttributes<HTMLElement>) {
  const { scroller } = useCarousel();
  const inView = useReveal(scroller, !!reveal);
  return <Tag ref={scroller as never} data-reveal={reveal ? 'items' : undefined} className={cx(className, reveal && inView && 'is-in')} {...props} />;
}

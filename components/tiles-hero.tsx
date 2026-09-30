'use client';
/* /fliesen intro: a picture per tile type behind the copy. It follows the ?art= filter and cross-fades
   once the next picture has loaded, so the band never flashes empty. */
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { parseFilter, type TileFilter } from '@/lib/tiles';
import { cx } from '@/lib/ui';

const heroPhoto = (filter: TileFilter) => `/assets/img/tiles-hero/${filter}.jpg`;

/** Prerendered with "alle" (the Suspense fallback); the live version starts from the same picture. */
export function TilesHeroMedia({ filter }: { filter: TileFilter }) {
  // Pictures asked for so far stay mounted, so going back to one is instant
  const [mounted, setMounted] = useState<TileFilter[]>(['alle']);
  const [loaded, setLoaded] = useState<TileFilter[]>(['alle']);
  const [front, setFront] = useState<TileFilter>('alle');
  const [back, setBack] = useState<TileFilter | null>(null);

  if (!mounted.includes(filter)) setMounted([...mounted, filter]);
  const markLoaded = (value: TileFilter) => setLoaded((list) => (list.includes(value) ? list : [...list, value]));
  if (filter !== front && loaded.includes(filter)) {
    setBack(front);
    setFront(filter);
  }

  return (
    <div className="tiles-hero-media" aria-hidden="true">
      {mounted.map((value) => (
        <img
          key={value}
          src={heroPhoto(value)}
          alt=""
          width={2400}
          height={1350}
          fetchPriority={value === 'alle' ? 'high' : undefined}
          className={cx(value === front && 'is-front', value === back && 'is-back')}
          // A cached picture can finish before React listens for its load event
          ref={(img) => { if (img?.complete && img.naturalWidth) markLoaded(value); }}
          onLoad={() => markLoaded(value)}
          // Faded in: the one underneath can go, so it fades in again when chosen next time
          onTransitionEnd={value === front ? () => setBack(null) : undefined}
        />
      ))}
    </div>
  );
}

/** Reads the filter from the URL; must sit inside <Suspense> (the static render is the fallback). */
export function TilesHeroMediaFromUrl() {
  return <TilesHeroMedia filter={parseFilter(useSearchParams().get('art'))} />;
}

'use client';
/* /fliesen: tile grid + type filter. The filter lives in the URL (?art=…) so it can be shared.
   The types are boxes with a room icon on the edge of the intro picture; once they have scrolled
   away, a slim bar with the same filter slides in below the header. */
import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '@/components/i18n';
import { ProductCard } from '@/components/product-card';
import { TileKindIcon } from '@/components/tile-kind-icon';
import { TILE_FILTERS, TILES, matchesFilter, parseFilter, type TileFilter } from '@/lib/tiles';
import { cx, idx } from '@/lib/ui';

const COUNTS = Object.fromEntries(TILE_FILTERS.map((filter) => [filter, TILES.filter((tile) => matchesFilter(tile, filter)).length]));
/* Filters without tiles yet (the stone slabs) stay out of the boxes and the bar until some arrive */
const SHOWN = TILE_FILTERS.filter((filter) => filter === 'alle' || COUNTS[filter] > 0);

export interface TileListingProps {
  labels: Record<TileFilter, string>;
  filterLabel: string;
  /** Shown when no tile matches (the stone slabs are still to come). */
  empty: ReactNode;
}

function select(filter: TileFilter) {
  const url = new URL(location.href);
  if (filter === 'alle') url.searchParams.delete('art'); else url.searchParams.set('art', filter);
  history.replaceState(null, '', url);
}

/** Filter chips + grid for one filter. Prerendered with "alle" as the Suspense fallback; the live
    version (TileListingFromUrl) replaces it on the client once the URL is known. */
export function TileListing({ filter, labels, filterLabel, empty }: TileListingProps & { filter: TileFilter }) {
  const t = useT();
  const grid = useRef<HTMLUListElement>(null);
  const boxes = useRef<HTMLDivElement>(null);
  const shown = useRef<TileFilter | null>(null);
  const [compact, setCompact] = useState(false);

  let visible = 0;
  const cards: ReactNode[] = [];
  for (const tile of TILES) {
    const show = matchesFilter(tile, filter);
    cards.push(<ProductCard key={tile.id} tile={tile} hidden={!show} style={show ? idx(Math.min(visible, 11)) : undefined} />);
    if (show) visible++;
  }

  // Restage the entrance: newly shown tiles rise in with a stagger
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el || shown.current === filter) return;
    if (shown.current !== null) {
      el.classList.remove('is-in');
      void el.offsetWidth;
    }
    el.classList.add('is-in');
    shown.current = filter;
  }, [filter]);

  // The slim bar takes over once the boxes are up under the header
  useEffect(() => {
    const el = boxes.current;
    if (!el) return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting && entry.boundingClientRect.top < header),
      { rootMargin: `-${header}px 0px 0px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = visible === 1 ? t('tiles.countOne') : t('tiles.count').replace('{n}', String(visible));

  return (
    <>
      <div className="tile-boxes">
        <div className="container">
          <div ref={boxes} className="tile-boxes__grid" role="group" aria-label={filterLabel} data-lenis-prevent-horizontal>
            {SHOWN.map((value) => (
              <button key={value} className="tile-box" type="button" aria-pressed={value === filter} onClick={() => select(value)}>
                <TileKindIcon kind={value} className="tile-box__icon" />
                <span className="tile-box__foot">
                  <span className="tile-box__label">{labels[value]}</span>
                  <span className="chip__count">{COUNTS[value]}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="tile-boxes__count" aria-live="polite">{count}</p>
        </div>
      </div>
      <div className={cx('tile-filters', compact && 'is-shown')} inert={!compact}>
        <div className="container tile-filters__inner">
          <div className="chips" role="group" aria-label={filterLabel} data-lenis-prevent-horizontal>
            {SHOWN.map((value) => (
              <button key={value} className="chip" type="button" aria-pressed={value === filter} onClick={() => select(value)}>
                <span>{labels[value]}</span><span className="chip__count">{COUNTS[value]}</span>
              </button>
            ))}
          </div>
          <p className="tile-filters__count" aria-hidden="true">{count}</p>
        </div>
      </div>
      <div className="container">
        <ul ref={grid} className="tile-grid">{cards}</ul>
        <div className="tile-empty" hidden={visible > 0}>{empty}</div>
      </div>
    </>
  );
}

/** Reads the filter from the URL; must sit inside <Suspense> (the static render is the fallback). */
export function TileListingFromUrl(props: TileListingProps) {
  const filter = parseFilter(useSearchParams().get('art'));
  return <TileListing filter={filter} {...props} />;
}

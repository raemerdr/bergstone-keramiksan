'use client';
import type { CSSProperties } from 'react';
import { useT } from '@/components/i18n';
import { Link } from '@/components/link';
import { WaLink } from '@/components/wa-link';
import { isWorktop, tileHref, tilePhoto, tileSize, type Tile } from '@/lib/tiles';

/** Tile card: homepage carousel, the /fliesen grid and "similar tiles". The name links to the tile's
    page and stretches over the whole card; the enquiry button sits above it. */
export function ProductCard({ tile, hidden, style }: { tile: Tile; hidden?: boolean; style?: CSSProperties }) {
  const t = useT();
  return (
    <li className="product-card" hidden={hidden} style={style}>
      <div className="product-card__media">
        <img src={tilePhoto(tile.img)} alt="" loading="lazy" decoding="async" />
      </div>
      <h3 className="product-card__title"><Link className="product-card__link" href={tileHref(tile)}>{tile.name}</Link></h3>
      <p className="product-card__meta">{`${tile.size ? tileSize(tile) : t('tile.stone')} · ${t(`finish.${tile.finish}`)}`}</p>
      <WaLink topic={isWorktop(tile) ? 'stone' : 'product'} product={tile.name} className="btn btn--gold btn--block">{t('tile.cta')}</WaLink>
    </li>
  );
}

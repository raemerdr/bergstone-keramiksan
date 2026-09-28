'use client';
import type { CSSProperties } from 'react';
import { useT } from '@/components/i18n';
import { WaLink } from '@/components/wa-link';
import { HeartButton } from '@/components/wishlist';
import { tilePhoto, tileSize, type Tile } from '@/lib/tiles';

/** Tile card: homepage carousel and the /fliesen grid. */
export function ProductCard({ tile, hidden, style }: { tile: Tile; hidden?: boolean; style?: CSSProperties }) {
  const t = useT();
  return (
    <li className="product-card" hidden={hidden} style={style}>
      <div className="product-card__media">
        <img className="is-tile" src={tilePhoto(tile.img)} alt="" loading="lazy" decoding="async" width={1100} height={700} />
        <HeartButton id={tile.id} name={tile.name} />
      </div>
      <h3 className="product-card__title">{tile.name}</h3>
      <p className="product-card__meta">{`${tileSize(tile)} · ${t(`finish.${tile.finish}`)}`}</p>
      <WaLink topic="product" product={tile.name} className="btn btn--gold btn--block">{t('tile.cta')}</WaLink>
    </li>
  );
}

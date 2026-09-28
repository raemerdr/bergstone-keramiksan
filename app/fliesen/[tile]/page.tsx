import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { ProductCard } from '@/components/product-card';
import { TilesHelp } from '@/components/tiles-help';
import { WaLink } from '@/components/wa-link';
import { fill } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { FILTER_LABELS, TILES, isWorktop, similarTiles, tileById, tilePhoto, tileSize } from '@/lib/tiles';
import { idx } from '@/lib/ui';

// One page per catalogue tile; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return TILES.map(({ id }) => ({ tile: id }));
}

async function load(props: PageProps<'/fliesen/[tile]'>) {
  const tile = tileById.get((await props.params).tile);
  if (!tile) notFound();
  return tile;
}

export async function generateMetadata(props: PageProps<'/fliesen/[tile]'>): Promise<Metadata> {
  const tile = await load(props);
  const t = await getT();
  const vars = { name: tile.name, size: tileSize(tile), finish: t(`finish.${tile.finish}`) };
  const stone = isWorktop(tile);
  return {
    title: fill(t(stone ? 'tilep.meta.titleStone' : 'tilep.meta.title'), vars),
    description: fill(t(stone ? 'tilep.meta.descStone' : 'tilep.meta.desc'), vars),
  };
}

export default async function TilePage(props: PageProps<'/fliesen/[tile]'>) {
  const tile = await load(props);
  const t = await getT();
  const size = tileSize(tile);
  const stone = isWorktop(tile);
  const similar = similarTiles(tile);

  return (
    <main id="main" className="tile-page">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container page-hero__inner">
          <div className="page-hero__text">
            <nav className="crumbs" aria-label={t('crumb.label')}>
              <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span>
              <Link href="/fliesen">{t('nav.tiles')}</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{tile.name}</span>
            </nav>
            <p className="eyebrow"><span>{t(stone ? 'cat.kitchen' : 'nav.tiles')}</span></p>
            <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{tile.name}</SplitHeading>
            <dl className="tile-specs">
              {tile.size
                ? <div><dt>{t('tilep.format')}</dt><dd>{size}</dd></div>
                : <div><dt>{t('tilep.material')}</dt><dd>{t('tile.stone')}</dd></div>}
              <div><dt>{t('tilep.finish')}</dt><dd>{t(`finish.${tile.finish}`)}</dd></div>
              {tile.faces ? <div><dt>{t('tilep.faces')}</dt><dd>{tile.faces}</dd></div> : null}
              <div>
                <dt>{t('tilep.kinds')}</dt>
                <dd>
                  {tile.kinds.map((kind, i) => (
                    <Fragment key={kind}>{i > 0 && ', '}<Link href={`/fliesen?art=${kind}`}>{t(FILTER_LABELS[kind])}</Link></Fragment>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="page-hero__actions">
              <WaLink topic={stone ? 'stone' : 'product'} product={tile.name} className="btn btn--dark"><Icon name="wa" /><span>{t('tilep.ask')}</span></WaLink>
            </div>
          </div>
          <figure className="page-hero__media">
            <img src={tilePhoto(tile.img)} fetchPriority="high" alt={fill(t(stone ? 'tilep.altStone' : 'tilep.alt'), { name: tile.name, size })} />
          </figure>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section tile-similar" aria-labelledby="similar-title">
          <div className="container">
            <SplitHeading className="h2" id="similar-title">{t(stone ? 'tilep.relatedStone' : 'tilep.related')}</SplitHeading>
            <Reveal as="ul" kind="items" className="tile-grid tile-grid--similar">
              {similar.map((other, i) => <ProductCard key={other.id} tile={other} style={idx(i)} />)}
            </Reveal>
          </div>
        </section>
      )}

      <TilesHelp />
    </main>
  );
}

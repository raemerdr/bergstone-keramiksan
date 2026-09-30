import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { SplitHeading } from '@/components/motion';
import { TileListing, TileListingFromUrl, type TileListingProps } from '@/components/tile-listing';
import { TilesHeroMedia, TilesHeroMediaFromUrl } from '@/components/tiles-hero';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { FILTER_LABELS, TILE_FILTERS } from '@/lib/tiles';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('tiles.meta.title'), description: t('tiles.meta.desc') };
}

export default async function TilesPage() {
  const t = await getT();
  const listing: TileListingProps = {
    labels: Object.fromEntries(TILE_FILTERS.map((filter) => [filter, t(FILTER_LABELS[filter])])) as TileListingProps['labels'],
    filterLabel: t('tiles.filterLabel'),
    empty: (
      <>
        <p className="tile-empty__title">{t('tiles.empty.title')}</p>
        <p>{t('tiles.empty.text')}</p>
        <div className="tile-empty__actions">
          <Link className="btn btn--dark" href="/#360"><Icon name="360" /><span>{t('showroom.cta')}</span></Link>
          <Link className="btn btn--light" href="/beratung">{t('mega.showroomAdvice')}</Link>
        </div>
      </>
    ),
  };

  return (
    <main id="main" className="tiles-page">
      {/* Intro: a picture of the chosen tile type behind the copy */}
      <section className="page-hero page-hero--tiles" aria-labelledby="page-title">
        <Suspense fallback={<TilesHeroMedia filter="alle" />}>
          <TilesHeroMediaFromUrl />
        </Suspense>
        <div className="container page-hero__inner">
          <div className="page-hero__text">
            <nav className="crumbs" aria-label={t('crumb.label')}>
              <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('nav.tiles')}</span>
            </nav>
            <p className="eyebrow"><span>{t('mega.range')}</span></p>
            <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('nav.tiles')}</SplitHeading>
            <p className="page-hero__intro">{t('tiles.intro')}</p>
            <div className="page-hero__actions">
              <Link className="btn btn--dark" href="/kataloge"><Icon name="download" /><span>{t('conf.catalogs.link')}</span></Link>
              <WaLink topic="consult" className="btn btn--light"><Icon name="wa" /><span>{t('hero.cta1')}</span></WaLink>
            </div>
          </div>
        </div>
      </section>

      {/* Listing: prerendered in full; the ?art= filter applies once the URL is read on the client */}
      <section className="tiles" aria-labelledby="tiles-heading">
        <h2 className="visually-hidden" id="tiles-heading">{t('tiles.listTitle')}</h2>
        <Suspense fallback={<TileListing filter="alle" {...listing} />}>
          <TileListingFromUrl {...listing} />
        </Suspense>
      </section>
    </main>
  );
}

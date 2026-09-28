import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { WaLink } from '@/components/wa-link';
import { fill } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { CATALOGS, catalogDownload, catalogFileName } from '@/lib/site';
import { idx } from '@/lib/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('catalogs.meta.title'), description: t('catalogs.meta.desc') };
}

export default async function CatalogsPage() {
  const t = await getT();

  return (
    <main id="main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('nav.catalogs')}</span>
          </nav>
          <p className="eyebrow"><span>Downloads</span></p>
          <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('nav.catalogs')}</SplitHeading>
          <p className="page-hero__intro">{t('catalogs.lead')}</p>
        </div>
      </section>

      <section className="section catalogs" aria-label={t('nav.catalogs')}>
        <Reveal as="ul" kind="items" className="container catalog-grid">
          {CATALOGS.map((catalog, i) => (
            <li key={catalog.id} className="catalog-card" style={idx(i)}>
              <a className="catalog-card__cover" href={catalogDownload(catalog)} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
                <img src={catalog.cover} alt="" width={298} height={432} loading="lazy" />
              </a>
              <h2 className="catalog-card__title">{t(catalog.title)}</h2>
              <p className="catalog-card__meta">{fill(t('catalogs.size'), { mb: catalog.mb })}</p>
              <div className="catalog-card__actions">
                <a className="btn btn--dark" href={catalogDownload(catalog)} download={catalogFileName(catalog)}>
                  <Icon name="download" /><span>{t('catalogs.download')}</span>
                </a>
                <a className="link" href={catalogDownload(catalog)} target="_blank" rel="noopener">{t('catalogs.view')}</a>
              </div>
            </li>
          ))}
        </Reveal>
        <div className="container catalogs__help">
          <p>{t('catalogs.intro')}</p>
          <WaLink topic="catalog" className="btn btn--light"><Icon name="wa" /><span>{t('catalogs.wa')}</span></WaLink>
        </div>
      </section>
    </main>
  );
}

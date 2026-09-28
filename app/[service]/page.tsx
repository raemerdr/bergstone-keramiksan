import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { SERVICES, getService, type Service } from '@/lib/services';
import { SITE } from '@/lib/site';
import { cx, idx } from '@/lib/ui';

// Only the four service pages exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ service: slug }));
}

async function load(props: PageProps<'/[service]'>) {
  const service = getService((await props.params).service);
  if (!service) notFound();
  return service;
}

export async function generateMetadata(props: PageProps<'/[service]'>): Promise<Metadata> {
  const { key } = await load(props);
  const t = await getT();
  return { title: t(`sp.${key}.meta.title`), description: t(`sp.${key}.meta.desc`) };
}

const NUMBERS = [1, 2, 3, 4] as const;

/** The media-with-text band's link: to the tour (opens it on the homepage) or to a page. */
function BandLink({ band, className, children, hidden }: { band: Service['band']; className: string; children: ReactNode; hidden?: boolean }) {
  const a11y = hidden ? { tabIndex: -1, 'aria-hidden': true } : {};
  return band.tour
    ? <TourLink className={className} {...a11y}>{children}</TourLink>
    : <Link className={className} href={band.href} {...a11y}>{children}</Link>;
}

export default async function ServicePage(props: PageProps<'/[service]'>) {
  const service = await load(props);
  const { key, band } = service;
  const t = await getT();

  return (
    <main id="main" className="svc-page">
      {/* Hero */}
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container page-hero__inner">
          <div className="page-hero__text">
            <nav className="crumbs" aria-label={t('crumb.label')}>
              <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span>
              <span>{t('nav.services')}</span><span aria-hidden="true">/</span>
              <span aria-current="page">{t(service.label)}</span>
            </nav>
            <p className="eyebrow"><Icon name="tile" /><span>{t('mega.tileService')}</span></p>
            <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t(`sp.${key}.title`)}</SplitHeading>
            <p className="page-hero__intro">{t(`sp.${key}.intro`)}</p>
            <div className="page-hero__actions">
              <WaLink topic={service.wa} className="btn btn--dark"><Icon name="wa" /><span>{t(`sp.${key}.cta`)}</span></WaLink>
              <a className="btn btn--light" href={SITE.phoneHref}><Icon name="phone" /><span>{t('footer.call')}</span></a>
            </div>
          </div>
          <figure className="page-hero__media">
            <img src={service.image} width={1600} height={1200} fetchPriority="high" alt={t(`sp.${key}.alt`)} />
          </figure>
        </div>
      </section>

      {/* What's included */}
      <section className="section svc-features" aria-labelledby="features-title">
        <div className="container">
          <SplitHeading className="h2" id="features-title">{t(`sp.${key}.features`)}</SplitHeading>
          <Reveal as="ul" kind="items" className="svc-grid">
            {NUMBERS.map((n, i) => (
              <li key={n} className="svc-feature" style={idx(i)}>
                <span className="svc-feature__no" aria-hidden="true">{`0${n}`}</span>
                <h3 className="svc-feature__title">{t(`sp.${key}.f${n}.t`)}</h3>
                <p>{t(`sp.${key}.f${n}.x`)}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section section--soft svc-steps" aria-labelledby="steps-title">
        <div className="container">
          <SplitHeading className="h2" id="steps-title">{t(`sp.${key}.steps`)}</SplitHeading>
          <Reveal as="ol" kind="items" className="steps">
            {NUMBERS.map((n, i) => (
              <li key={n} className="step" style={idx(i)}>
                <span className="step__no" aria-hidden="true">{n}</span>
                <h3 className="step__title">{t(`sp.${key}.s${n}.t`)}</h3>
                <p>{t(`sp.${key}.s${n}.x`)}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Media with text */}
      <section className="section feature svc-band" aria-labelledby="band-title">
        <Reveal kind="media" className="container feature__inner">
          <div className="feature__content">
            <p className="eyebrow"><Icon name="tile" /><span>{t(`sp.${key}.b.eyebrow`)}</span></p>
            <SplitHeading className="h2" id="band-title">{t(`sp.${key}.b.title`)}</SplitHeading>
            <div className="feature__prose">
              <p>{t(`sp.${key}.b.text`)}</p>
              <div className="feature__actions">
                <BandLink band={band} className="btn btn--dark"><Icon name={band.icon} /><span>{t(band.cta)}</span></BandLink>
              </div>
            </div>
          </div>
          <BandLink band={band} className={cx('feature__media', band.media.variant && `feature__media--${band.media.variant}`)} hidden>
            <img
              className={band.media.variant === 'tile' ? 'is-tile' : undefined}
              src={band.media.src}
              width={band.media.width}
              height={band.media.height}
              alt=""
              loading="lazy"
            />
          </BandLink>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section svc-faq" aria-labelledby="faq-title">
        <div className="container svc-faq__inner">
          <SplitHeading className="h2" id="faq-title">{t('svcp.faq')}</SplitHeading>
          <div className="faq">
            {NUMBERS.map((n) => (
              <details key={n} className="faq__item">
                <summary><span>{t(`sp.${key}.q${n}`)}</span><Icon name="plus" aria-hidden="true" /></summary>
                <div className="faq__a"><p>{t(`sp.${key}.a${n}`)}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="section svc-related" aria-labelledby="related-title">
        <div className="container">
          <SplitHeading className="h2" id="related-title">{t('svcp.related')}</SplitHeading>
          <Reveal as="ul" kind="items" className="related-grid">
            {SERVICES.filter((other) => other !== service).map((other, i) => (
              <li key={other.slug} style={idx(i)}>
                <Link className="related-card" href={`/${other.slug}`}>
                  <span className="media media--3x2"><img src={other.image} alt="" loading="lazy" /></span>
                  <span className="related-card__title">{t(other.label)}</span>
                  <span className="related-card__text">{t(`svcp.teaser.${other.key}`)}</span>
                  <span className="link">{t('svcp.more')}</span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Call to action */}
      <section className="section section--dark svc-cta" aria-labelledby="cta-title">
        <div className="container svc-cta__inner">
          <div>
            <SplitHeading className="h2" id="cta-title">{t('svcp.cta.title')}</SplitHeading>
            <p>{t('svcp.cta.text')}</p>
          </div>
          <div className="svc-cta__actions">
            <WaLink topic={service.wa} className="btn btn--gold"><Icon name="wa" /><span>{t('footer.wa')}</span></WaLink>
            <a className="btn btn--ghost-light" href={SITE.phoneHref}><Icon name="phone" /><span>{t('footer.call')}</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}

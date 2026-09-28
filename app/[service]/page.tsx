import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Faq } from '@/components/faq';
import { FeatureIcon } from '@/components/feature-icon';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { SERVICES, getService, stepPhoto, type Service } from '@/lib/services';
import { SITE } from '@/lib/site';
import { idx } from '@/lib/ui';

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

  const contact = (
    <div className="media-text__actions">
      <WaLink topic={service.wa} className="btn btn--dark"><Icon name="wa" /><span>{t(`sp.${key}.cta`)}</span></WaLink>
      <a className="btn btn--light" href={SITE.phoneHref}><Icon name="phone" /><span>{t('footer.call')}</span></a>
    </div>
  );

  return (
    <main id="main" className="svc-page">
      {/* Hero: the copy on a white panel beside the photo */}
      <section className="svc-hero" aria-labelledby="page-title">
        <div className="container">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span>
            <span>{t('nav.services')}</span><span aria-hidden="true">/</span>
            <span aria-current="page">{t(service.label)}</span>
          </nav>
          <div className="media-text media-text--hero">
            <div className="media-text__copy">
              <SplitHeading as="h1" className="h1" id="page-title">{t(`sp.${key}.title`)}</SplitHeading>
              <p className="svc-hero__intro">{t(`sp.${key}.intro`)}</p>
              {contact}
            </div>
            <figure className="media-text__media">
              <img src={service.image} width={1600} height={1200} fetchPriority="high" alt={t(`sp.${key}.alt`)} />
            </figure>
          </div>
        </div>
      </section>

      {/* What's included: a line icon per feature */}
      <section className="section svc-features" aria-labelledby="features-title">
        <div className="container">
          <SplitHeading className="h2 section-title" id="features-title">{t(`sp.${key}.features`)}</SplitHeading>
          <Reveal as="ul" kind="items" className="icon-cols">
            {NUMBERS.map((n, i) => (
              <li key={n} className="icon-col" style={idx(i)}>
                <FeatureIcon name={service.icons[i]} className="icon-col__icon" />
                <h3 className="icon-col__title">{t(`sp.${key}.f${n}.t`)}</h3>
                <p>{t(`sp.${key}.f${n}.x`)}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process: a photo per step, numbered in the corner */}
      <section className="section section--soft svc-steps" aria-labelledby="steps-title">
        <div className="container">
          <SplitHeading className="h2 section-title" id="steps-title">{t(`sp.${key}.steps`)}</SplitHeading>
          <Reveal as="ol" kind="items" className="photo-steps">
            {NUMBERS.map((n, i) => (
              <li key={n} className="photo-step" style={idx(i)}>
                <span className="photo-step__media">
                  <img src={stepPhoto(key, n)} width={720} height={720} alt="" loading="lazy" />
                  <span className="photo-step__no" aria-hidden="true">{n}</span>
                </span>
                <div className="photo-step__body">
                  <h3 className="photo-step__title">{t(`sp.${key}.s${n}.t`)}</h3>
                  <p>{t(`sp.${key}.s${n}.x`)}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Media with text */}
      <section className="section svc-band" aria-labelledby="band-title">
        <div className="container">
          <Reveal kind="media" className="media-text media-text--media-first">
            <BandLink band={band} className="media-text__media" hidden>
              <img src={band.media.src} width={band.media.width} height={band.media.height} alt="" loading="lazy" />
            </BandLink>
            <div className="media-text__copy">
              <SplitHeading className="h2" id="band-title">{t(`sp.${key}.b.title`)}</SplitHeading>
              <p>{t(`sp.${key}.b.text`)}</p>
              <div className="media-text__actions">
                <BandLink band={band} className="btn btn--dark"><Icon name={band.icon} /><span>{t(band.cta)}</span></BandLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="container faq-section__inner">
          <SplitHeading className="h2 section-title" id="faq-title">{t('svcp.faq')}</SplitHeading>
          <Faq items={NUMBERS.map((n) => ({ q: t(`sp.${key}.q${n}`), a: t(`sp.${key}.a${n}`) }))} />
        </div>
      </section>

      {/* Other services */}
      <section className="section section--soft svc-related" aria-labelledby="related-title">
        <div className="container">
          <SplitHeading className="h2 section-title" id="related-title">{t('svcp.related')}</SplitHeading>
          <Reveal as="ul" kind="items" className="related-grid">
            {SERVICES.filter((other) => other !== service).map((other, i) => (
              <li key={other.slug} style={idx(i)}>
                <Link className="related-card" href={`/${other.slug}`}>
                  <span className="media media--4x3"><img src={other.image} alt="" loading="lazy" /></span>
                  <h3 className="related-card__title">{t(other.label)}</h3>
                  <span className="related-card__text">{t(`svcp.teaser.${other.key}`)}</span>
                  <span className="btn btn--light related-card__btn">{t('svcp.more')}</span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Call to action: the showroom reception beside the contact options */}
      <section className="section svc-cta" aria-labelledby="cta-title">
        <div className="container">
          <Reveal kind="media" className="media-text">
            <div className="media-text__copy">
              <SplitHeading className="h2" id="cta-title">{t('svcp.cta.title')}</SplitHeading>
              <p>{t('svcp.cta.text')}</p>
              {contact}
            </div>
            <div className="media-text__media">
              <img src="/assets/img/tour/hero-360.jpg" width={2100} height={1180} alt="" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

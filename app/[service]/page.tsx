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
import { REVIEW_SUMMARY } from '@/lib/reviews';
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
function BandLink({ band, className, children }: { band: Service['band']; className: string; children: ReactNode }) {
  return band.tour
    ? <TourLink className={className}>{children}</TourLink>
    : <Link className={className} href={band.href}>{children}</Link>;
}

export default async function ServicePage(props: PageProps<'/[service]'>) {
  const service = await load(props);
  const { key, band } = service;
  const t = await getT();

  // A step's label, title and text (with an optional pill above the title)
  const stepText = (n: (typeof NUMBERS)[number], badge?: string) => (
    <div className="step-card__text">
      <p className="step-card__no">{t('svcp.step').replace('{n}', `0${n}`)}</p>
      {badge && <p className="step-card__badge">{badge}</p>}
      <h3 className="step-card__title">{t(`sp.${key}.s${n}.t`)}</h3>
      <p>{t(`sp.${key}.s${n}.x`)}</p>
    </div>
  );
  const features = NUMBERS.map((n) => t(`sp.${key}.f${n}.t`));

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
        <figure className="svc-hero__media">
          <img src={service.image} width={1600} height={1200} fetchPriority="high" alt={t(`sp.${key}.alt`)} />
        </figure>
        <div className="container svc-hero__inner">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span>
            <span>{t('nav.services')}</span><span aria-hidden="true">/</span>
            <span aria-current="page">{t(service.label)}</span>
          </nav>
          <div className="svc-hero__copy">
            <SplitHeading as="h1" className="h1" id="page-title">{t(`sp.${key}.title`)}</SplitHeading>
            <p className="svc-hero__intro">{t(`sp.${key}.intro`)}</p>
            {contact}
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

      {/* Process: the four steps as cards of different sizes. A tall photo card with the page's features
          sliding along its foot, a drawing from the page's icons, a photo card, and a wide dark card with
          the call to action and the Google rating. */}
      <section className="section section--soft svc-steps" aria-labelledby="steps-title">
        <div className="container">
          <div className="steps-head">
            <div>
              <p className="eyebrow"><span>{t('svcp.process')}</span></p>
              <SplitHeading className="h2" id="steps-title">{t(`sp.${key}.steps`)}</SplitHeading>
            </div>
          </div>
          <Reveal as="ol" kind="items" className="steps-bento">
            <li className="step-card step-card--tall" style={idx(0)}>
              {stepText(1)}
              <span className="step-card__photo"><img src={stepPhoto(key, 1)} width={720} height={720} alt="" loading="lazy" /></span>
              <div className="step-card__chips" aria-hidden="true">
                <div className="chips-marquee">{[...features, ...features].map((f, i) => <span key={i}>{f}</span>)}</div>
              </div>
            </li>
            <li className="step-card step-card--graphic" style={idx(1)}>
              {stepText(2)}
              <div className="step-graphic" aria-hidden="true">
                <span className="step-graphic__node"><FeatureIcon name={service.icons[0]} /></span>
                <span className="step-graphic__node step-graphic__node--main"><FeatureIcon name={service.icons[1]} /></span>
                <span className="step-graphic__node"><FeatureIcon name={service.icons[2]} /></span>
              </div>
            </li>
            <li className="step-card step-card--photo" style={idx(2)}>
              {stepText(3)}
              <span className="step-card__photo"><img src={stepPhoto(key, 3)} width={720} height={720} alt="" loading="lazy" /></span>
            </li>
            <li className="step-card step-card--dark" style={idx(3)}>
              <div className="step-card__content">
                {stepText(4, t('showroom.eyebrow'))}
                <WaLink topic={service.wa} className="btn btn--gold"><span>{t(`sp.${key}.cta`)}</span></WaLink>
              </div>
              <span className="step-card__photo"><img src={stepPhoto(key, 4)} width={720} height={720} alt="" loading="lazy" /></span>
              <span className="step-card__rating" aria-hidden="true">
                <span className="step-card__stars"><Icon name="google" />{Array.from({ length: REVIEW_SUMMARY.stars }, (_, i) => <Icon key={i} name="star" />)}</span>
                <span>{t('reviews.basedOn').replace('{count}', String(REVIEW_SUMMARY.count))}</span>
              </span>
            </li>
          </Reveal>
        </div>
      </section>

      {/* Band: the photo fills it, the copy sits on a dark gradient on the right */}
      <section className="svc-band" aria-labelledby="band-title">
        <img className="svc-band__bg" src={band.media.src} width={band.media.width} height={band.media.height} alt="" loading="lazy" />
        <div className="container svc-band__inner">
          <Reveal kind="fade" className="svc-band__copy">
            <SplitHeading className="h2" id="band-title">{t(`sp.${key}.b.title`)}</SplitHeading>
            <p>{t(`sp.${key}.b.text`)}</p>
            <div className="media-text__actions">
              <BandLink band={band} className="btn btn--light">{band.icon && <Icon name={band.icon} />}<span>{t(band.cta)}</span></BandLink>
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
                  <span className="media"><img src={other.image} alt="" loading="lazy" /></span>
                  <div className="related-card__body">
                    <div>
                      <h3 className="related-card__title">{t(other.label)}</h3>
                      <p className="related-card__text">{t(`svcp.teaser.${other.key}`)}</p>
                    </div>
                    <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

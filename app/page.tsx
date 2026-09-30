import { Fragment } from 'react';
import { preload } from 'react-dom';
import { Carousel, CarouselButton, CarouselTrack } from '@/components/carousel';
import { Faq } from '@/components/faq';
import { FeatureIcon, type FeatureIconName } from '@/components/feature-icon';
import { HeroTitle, HeroTour } from '@/components/home/hero-tour';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { ProductCard } from '@/components/product-card';
import { ReviewText } from '@/components/review-text';
import { TileKindIcon } from '@/components/tile-kind-icon';
import { TourButton } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import type { MessageKey } from '@/lib/i18n';
import { fill, lines } from '@/lib/i18n';
import { getLang, getT } from '@/lib/i18n/server';
import { REVIEW_SUMMARY, REVIEWS } from '@/lib/reviews';
import { CATALOGS, SITE } from '@/lib/site';
import { FEATURED_TILES, tileById, type Tile, type TileFilter } from '@/lib/tiles';
import { idx, pos, stagger } from '@/lib/ui';
import type { WaTopic } from '@/lib/whatsapp';

/** A cover photo, optionally with its focal point. */
interface Photo { src: string; pos?: string }

const photo = (src: string, extra: Omit<Photo, 'src'> = {}): Photo => ({ src, ...extra });

function Img({ photo: p }: { photo: Photo }) {
  return <img src={p.src} alt="" loading="lazy" style={p.pos ? pos(p.pos) : undefined} />;
}

/* Category photos: rooms staged around a catalogue tile (Sky Onyx, Statuario Eva, Ashwin Grey,
   Anty Sky White, Emrance Grey, Esterda Latte, Orion Peach, Elite Beige), AI-generated from its photo. */
const room = (name: string) => photo(`/assets/img/categories/${name}.jpg`);

const CATEGORIES: ({ label: MessageKey; sub: MessageKey; photo: Photo } & ({ href: string } | { wa: WaTopic }))[] = [
  { label: 'cat.all', sub: 'cat.all.sub', href: '/fliesen', photo: room('fliesen') },
  { label: 'cat.wall', sub: 'cat.wall.sub', href: '/fliesen?art=wandfliesen', photo: room('wandfliesen') },
  { label: 'cat.floor', sub: 'cat.floor.sub', href: '/fliesen?art=bodenfliesen', photo: room('bodenfliesen') },
  { label: 'cat.large', sub: 'cat.large.sub', href: '/fliesen?art=grossformate', photo: room('grossformate') },
  { label: 'cat.slabs', sub: 'cat.slabs.sub', href: '/fliesen?art=steinplatten', photo: room('steinplatten') },
  { label: 'cat.kitchens', sub: 'cat.kitchens.sub', wa: 'kitchen', photo: room('kuechen') },
  { label: 'cat.worktops', sub: 'cat.worktops.sub', href: '/fliesen?art=kueche', photo: room('arbeitsplatten') },
  { label: 'cat.install', sub: 'cat.install.sub', href: '/verlegung-montage', photo: room('verlegung') },
];

/* An icon per line of the showroom list: tiles, large formats, kitchens, worktops */
const SHOWROOM_ICONS: TileFilter[] = ['alle', 'grossformate', 'kueche', 'steinplatten'];

/* Photos for the "well advised" cards under the showroom (AI-generated, public/assets/img/advice) */
const advice = (name: string) => photo(`/assets/img/advice/${name}.jpg`);

/* Professionals: a card per topic with an icon per point and a link onwards; the last one leads to the
   contact band at the end of the page. Photos AI-generated (public/assets/img/pro). */
const PRO_CARDS: { n: 1 | 2 | 3 | 4; photo: Photo; icons: readonly [FeatureIconName, FeatureIconName, FeatureIconName]; href: string; link: MessageKey }[] = [
  { n: 1, photo: photo('/assets/img/pro/auswahl.jpg'), icons: ['tiles', 'samples', 'pin'], href: '/kataloge', link: 'conf.catalogs.link' },
  { n: 2, photo: photo('/assets/img/pro/planung.jpg'), icons: ['swatches', 'measure', 'blueprint'], href: '/planung-aufmass', link: 'svcp.more' },
  { n: 3, photo: photo('/assets/img/pro/montage.jpg'), icons: ['truck', 'tools', 'europe'], href: '/verlegung-montage', link: 'svcp.more' },
  { n: 4, photo: photo('/assets/img/pro/kommunikation.jpg'), icons: ['language', 'phone', 'handshake'], href: '#anfrage', link: 'contact.form.title' },
];
const PRO_POINTS = ['b1', 'b2', 'b3'] as const;

/** Five stars, the first `n` filled; announced as "n of 5 stars". */
function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" className={i <= n ? 'is-on' : undefined} />)}
    </span>
  );
}

const FAQ = [1, 2, 3, 4, 5, 6] as const;

/** Copy with `*…*` around some words: those are set in italic (the headline accent). */
const accent = (text: string) => text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const featured = FEATURED_TILES.map((id) => tileById.get(id)).filter((item): item is Tile => !!item);

export default async function Home() {
  const t = await getT();
  const lang = await getLang();
  const month = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' });
  preload('/assets/img/hero/home.jpg', { as: 'image', media: '(min-width: 700px)', fetchPriority: 'high' });
  preload('/assets/img/hero/home-mobile.jpg', { as: 'image', media: '(max-width: 699px)', fetchPriority: 'high' });
  const conf = stagger();

  return (
    <main id="main">
      {/* 1 · Hero: the consultation area (generated from the tour), copy on the left; the button swaps it for the live 360° tour, starting at the entrance */}
      <HeroTour alt={t('hero.alt')}>
        <ul className="hero__tags">{lines(t('hero.tags')).map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <HeroTitle>{t('hero.title')}</HeroTitle>
        <p className="hero__text">{t('hero.text')}</p>
        <div className="hero__actions">
          <WaLink topic="consult" className="btn btn--gold"><span>{t('hero.cta1')}</span></WaLink>
          <TourButton className="btn btn--light"><span>{t('hero.cta360')}</span></TourButton>
        </div>
      </HeroTour>

      {/* 2 · Range: tall picture cards in a swipe row, each with its name, a line about it and an arrow */}
      <section className="categories" id="sortiment" aria-labelledby="cat-title">
        <div className="container section-head cat-head">
          <div>
            <p className="eyebrow"><span>{t('cat.title')}</span></p>
            <SplitHeading className="h2" id="cat-title">{t('cat.heading')}</SplitHeading>
          </div>
        </div>
        <Carousel>
          <div className="cat-row">
            <CarouselTrack className="scroller">
              <Reveal as="ul" kind="items" className="cat-track">
                {CATEGORIES.map((item, i) => {
                  const inner = (
                    <>
                      <span className="media"><Img photo={item.photo} /></span>
                      <span className="cat-card__caption">
                        <span className="cat-card__text"><span className="cat-card__title">{t(item.label)}</span><span className="cat-card__sub">{t(item.sub)}</span></span>
                        <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                      </span>
                    </>
                  );
                  return (
                    <li key={item.label} style={idx(i)}>
                      {'wa' in item
                        ? <WaLink topic={item.wa} className="cat-card">{inner}</WaLink>
                        : <Link className="cat-card" href={item.href}>{inner}</Link>}
                    </li>
                  );
                })}
              </Reveal>
            </CarouselTrack>
            <CarouselButton dir="prev" className="round-btn cat-nav cat-nav--prev" label={t('a11y.prev')} />
            <CarouselButton dir="next" className="round-btn cat-nav cat-nav--next" label={t('a11y.next')} />
          </div>
        </Carousel>
      </section>

      {/* 3 · Featured tiles (scroll carousel) */}
      <section className="section products" id="bestseller" aria-labelledby="best-title">
        <Carousel>
          <div className="container section-head">
            <SplitHeading className="h2" id="best-title">{t('best.title')}</SplitHeading>
            <div className="section-head__side">
              <Link className="link" href="/fliesen">{t('best.all')}</Link>
              <div className="carousel-nav">
                <CarouselButton dir="prev" className="round-btn" label={t('a11y.prev')} />
                <CarouselButton dir="next" className="round-btn" label={t('a11y.next')} />
              </div>
            </div>
          </div>
          <CarouselTrack className="scroller">
            <Reveal as="ul" kind="items" className="product-track">
              {featured.map((item, i) => <ProductCard key={item.id} tile={item} style={idx(i)} />)}
            </Reveal>
          </CarouselTrack>
          {/* Phones show the favourites as a grid; this leads on to the full range */}
          <div className="container products__more">
            <Link className="btn btn--dark" href="/fliesen"><span>{t('best.all')}</span></Link>
          </div>
        </Carousel>
      </section>

      {/* 4 · Showroom: photo with text, then "well advised" in four picture cards */}
      <section className="section section--soft feature showroom" id="showroom" aria-labelledby="showroom-title">
        <Reveal kind="media" className="feature__inner feature--bleed">
          <div className="feature__media" aria-hidden="true">
            <img src="/assets/img/showroom-beratung.jpg" width={2400} height={1350} alt="" loading="lazy" />
          </div>
          <div className="container feature__overlay">
            <div className="feature__content feature__card">
              <p className="eyebrow"><span>{t('showroom.eyebrow')}</span></p>
              <SplitHeading className="h2" id="showroom-title">{t('showroom.title')}</SplitHeading>
              <div className="feature__prose">
                <p>{t('showroom.text')}</p>
                <ul className="showroom__list">
                  {lines(t('showroom.list')).map((item, i) => (
                    <li key={item}><TileKindIcon kind={SHOWROOM_ICONS[i] ?? 'alle'} className="showroom__icon" /><span>{item}</span></li>
                  ))}
                </ul>
                <div className="feature__actions">
                  <Link className="btn btn--light btn--arrow" href="/beratung"><span>{t('showroom.more')}</span><Icon name="arrow" /></Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="container showroom__advice">
          <SplitHeading className="h2" id="conf-title">{t('conf.title')}</SplitHeading>
          <Reveal as="ul" kind="items" className="conf-grid">
            <li style={conf()}>
              <Link className="conf-card" href="/planung-aufmass">
                <span className="media media--2x3"><Img photo={advice('planung')} /></span>
                <div className="conf-card__body">
                  <h3 className="conf-card__title">{t('svc.planning')}</h3>
                  <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                </div>
              </Link>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/kontakt">
                <span className="media media--2x3"><Img photo={advice('showroom')} /></span>
                <div className="conf-card__body">
                  <h3 className="conf-card__title">{t('showroom.eyebrow')}</h3>
                  <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                </div>
              </Link>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/verlegung-montage">
                <span className="media media--2x3"><Img photo={advice('montage')} /></span>
                <div className="conf-card__body">
                  <h3 className="conf-card__title">{t('svc.delivery')}</h3>
                  <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                </div>
              </Link>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/kataloge">
                <span className="media media--2x3"><Img photo={advice('kataloge')} /></span>
                <div className="conf-card__body">
                  <h3 className="conf-card__title">{t('conf.catalogs.title')}</h3>
                  <span className="card-go" aria-hidden="true"><Icon name="arrow" /></span>
                </div>
              </Link>
            </li>
          </Reveal>
        </div>
      </section>

      {/* Catalogues: text and button on the left, a fanned stack of covers on the right */}
      <section className="section section--soft catalog-band" aria-labelledby="catalogs-title">
        <Reveal kind="media" className="container catalog-band__inner">
          <div className="catalog-band__text">
            <p className="eyebrow"><span>Downloads</span></p>
            <SplitHeading className="h2" id="catalogs-title">{t('catalogs.home.title')}</SplitHeading>
            <p>{t('catalogs.home.text')}</p>
            <Link className="btn btn--dark btn--arrow" href="/kataloge"><Icon name="download" /><span>{t('catalogs.home.cta')}</span></Link>
          </div>
          <Link className="catalog-stack" href="/kataloge" tabIndex={-1} aria-hidden="true">
            {CATALOGS.map((catalog, i) => (
              <img key={catalog.id} className="catalog-stack__cover" src={catalog.cover} alt="" width={298} height={432} loading="lazy" style={idx(i)} />
            ))}
          </Link>
        </Reveal>
      </section>

      {/* 5 · Professionals: a large card per topic, stacked; the photo alternates sides (left, right, left, right); then a banner to get in touch */}
      <section className="section section--dark pro" id="profis" aria-labelledby="pro-title">
        <div className="container">
          <SplitHeading className="h2 pro__title" id="pro-title">{t('pro.title')}</SplitHeading>
          <Reveal as="p" kind="fade" className="pro__intro">{t('pro.text')}</Reveal>
          <ul className="pro-list">
            {PRO_CARDS.map(({ n, photo: p, icons, href, link }) => {
              const cta = <><span>{t(link)}</span><Icon name="arrow" /></>;
              return (
                <li key={n}>
                  <Reveal kind="fade" className="pro-card">
                    <span className="media"><Img photo={p} /></span>
                    <div className="pro-card__body">
                      <p className="eyebrow"><span>{`0${n}`}</span></p>
                      <h3 className="pro-card__title">{t(`pro.c${n}.title`)}</h3>
                      <ul className="pro-card__points">
                        {PRO_POINTS.map((b, j) => (
                          <li key={b}><FeatureIcon name={icons[j]} className="pro-card__icon" /><span>{t(`pro.c${n}.${b}`)}</span></li>
                        ))}
                      </ul>
                      {href.startsWith('#')
                        ? <a className="btn btn--ghost-light btn--arrow pro-card__btn" href={href}>{cta}</a>
                        : <Link className="btn btn--ghost-light btn--arrow pro-card__btn" href={href}>{cta}</Link>}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          {/* Their call to action: a wide banner, the copy on the left, tile samples on the right (AI-generated) */}
          <Reveal kind="fade" className="pro-cta">
            <div className="pro-cta__copy">
              <SplitHeading as="h3" className="h2 pro-cta__title">{t('pro.ctaTitle')}</SplitHeading>
              <p>{t('pro.ctaText')}</p>
              <WaLink topic="pro" className="btn btn--light btn--arrow"><span>{t('pro.cta')}</span><Icon name="arrow" /></WaLink>
            </div>
            <img className="pro-cta__photo" src="/assets/img/pro/cta-tiles.jpg" width={2400} height={1028} alt="" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* 6 · Google reviews (lib/reviews.ts) */}
      <section className="section reviews" id="bewertungen" aria-labelledby="reviews-title">
        <div className="container">
          <div className="reviews__head">
            <SplitHeading className="h2" id="reviews-title">{t('reviews.title')}</SplitHeading>
            <Reveal kind="fade" className="reviews__summary">
              <Icon name="google" className="reviews__google" />
              <span>
                <strong>{t('reviews.rating')}</strong>
                <Stars n={REVIEW_SUMMARY.stars} label={fill(t('reviews.stars'), { n: REVIEW_SUMMARY.stars })} />
                <span className="reviews__count">{fill(t('reviews.basedOn'), { count: REVIEW_SUMMARY.count })}</span>
              </span>
            </Reveal>
          </div>
          <Reveal as="ul" kind="items" className="reviews__grid">
            {REVIEWS.map((review, i) => (
              <li key={review.name + review.date} className="review" style={idx(i)}>
                <div className="review__head">
                  <span className="review__avatar" aria-hidden="true">{initials(review.name)}</span>
                  <span className="review__who">
                    <strong>{review.name}</strong>
                    <time dateTime={review.date}>{month.format(new Date(review.date))}</time>
                  </span>
                  <Icon name="google" className="review__google" aria-label="Google" role="img" />
                </div>
                <Stars n={review.stars} label={fill(t('reviews.stars'), { n: review.stars })} />
                <ReviewText more={t('reviews.more')} less={t('reviews.less')}>{review.text}</ReviewText>
              </li>
            ))}
          </Reveal>
          <Reveal kind="fade" className="reviews__cta">
            <a className="btn btn--light" href={SITE.googleReviews} target="_blank" rel="noopener"><Icon name="google" /><span>{t('reviews.all')}</span></a>
          </Reveal>
        </div>
      </section>

      {/* 7 · FAQ: the heading on top; below, a promise and the WhatsApp button beside the questions as cards */}
      <section className="section faq-home" id="faq" aria-labelledby="faq-title">
        <div className="container">
          <div className="faq-home__head">
            <p className="eyebrow"><span>{t('faq.eyebrow')}</span></p>
            <SplitHeading className="h2" id="faq-title">{t('faq.title')}</SplitHeading>
          </div>
          <div className="faq-home__body">
            <div className="faq-home__aside">
              <p className="faq-home__lead">{accent(t('faq.lead'))}</p>
              <p className="faq-home__text">{t('faq.leadText')}</p>
              <WaLink topic="consult" className="btn btn--gold"><Icon name="wa" /><span>{t('hero.cta1')}</span></WaLink>
            </div>
            <Faq items={FAQ.map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }))} />
          </div>
        </div>
      </section>
    </main>
  );
}

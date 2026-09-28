import { Fragment } from 'react';
import { preconnect, preload } from 'react-dom';
import { Carousel, CarouselButton, CarouselTrack } from '@/components/carousel';
import { Faq } from '@/components/faq';
import { HeroTitle, HeroTour } from '@/components/home/hero-tour';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { ProductCard } from '@/components/product-card';
import { ReviewText } from '@/components/review-text';
import { TourButton } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import type { MessageKey } from '@/lib/i18n';
import { fill, lines } from '@/lib/i18n';
import { getLang, getT } from '@/lib/i18n/server';
import { REVIEW_SUMMARY, REVIEWS } from '@/lib/reviews';
import { BRAND, CATALOGS, HOSTED_TOUR, PHOTO, SITE } from '@/lib/site';
import { FEATURED_TILES, tileById, tilePhoto, type Tile } from '@/lib/tiles';
import { idx, pos, stagger } from '@/lib/ui';
import type { WaTopic } from '@/lib/whatsapp';

/** A cover photo, optionally with its focal point. */
interface Photo { src: string; pos?: string }

const photo = (src: string, extra: Omit<Photo, 'src'> = {}): Photo => ({ src, ...extra });
const tile = (img: string): Photo => ({ src: tilePhoto(img) });

function Img({ photo: p }: { photo: Photo }) {
  return <img src={p.src} alt="" loading="lazy" style={p.pos ? pos(p.pos) : undefined} />;
}

/* Category photos: rooms staged around a catalogue tile (Sky Onyx, Statuario Eva, Ashwin Grey,
   Anty Sky White, Emrance Grey, Esterda Latte, Orion Peach, Elite Beige), AI-generated from its photo. */
const room = (name: string) => photo(`/assets/img/categories/${name}.jpg`);

const CATEGORIES: ({ label: MessageKey; photo: Photo } & ({ href: string } | { wa: WaTopic }))[] = [
  { label: 'cat.all', href: '/fliesen', photo: room('fliesen') },
  { label: 'cat.wall', href: '/fliesen?art=wandfliesen', photo: room('wandfliesen') },
  { label: 'cat.floor', href: '/fliesen?art=bodenfliesen', photo: room('bodenfliesen') },
  { label: 'cat.large', href: '/fliesen?art=grossformate', photo: room('grossformate') },
  { label: 'cat.slabs', href: '/fliesen?art=steinplatten', photo: room('steinplatten') },
  { label: 'cat.kitchens', wa: 'kitchen', photo: room('kuechen') },
  { label: 'cat.worktops', href: '/fliesen?art=kueche', photo: room('arbeitsplatten') },
  { label: 'cat.install', href: '/verlegung-montage', photo: room('verlegung') },
];


/* Photos for the "well advised" cards under the showroom (AI-generated, public/assets/img/advice) */
const advice = (name: string) => photo(`/assets/img/advice/${name}.jpg`);

/* Photos for the professionals section (AI-generated, public/assets/img/pro) */
const PRO_CARDS: { n: 1 | 2 | 3 | 4; photo: Photo }[] = [
  { n: 1, photo: photo('/assets/img/pro/auswahl.jpg') },
  { n: 2, photo: photo('/assets/img/pro/planung.jpg') },
  { n: 3, photo: photo('/assets/img/pro/montage.jpg') },
  { n: 4, photo: photo('/assets/img/pro/kommunikation.jpg') },
];



/** Five stars, the first `n` filled; announced as "n of 5 stars". */
function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" className={i <= n ? 'is-on' : undefined} />)}
    </span>
  );
}

const FAQ = [1, 2, 3, 4, 5, 6] as const;

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const featured = FEATURED_TILES.map((id) => tileById.get(id)).filter((item): item is Tile => !!item);

export default async function Home() {
  const t = await getT();
  const lang = await getLang();
  const month = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' });
  preload('/assets/img/tour/hero-360.jpg', { as: 'image', media: '(min-width: 700px)', fetchPriority: 'high' });
  preload('/assets/img/tour/hero-360-mobile.jpg', { as: 'image', media: '(max-width: 699px)', fetchPriority: 'high' });
  preconnect(new URL(HOSTED_TOUR.url).origin);
  const conf = stagger();
  const story = stagger();

  return (
    <main id="main">
      {/* 1 · Hero: a picture of the reception; the button swaps it for the live 360° tour, starting at the entrance */}
      <HeroTour alt={t('hero.alt')}>
        <p className="eyebrow hero__eyebrow"><span>{t('hero.eyebrow')}</span></p>
        <HeroTitle>{t('hero.title')}</HeroTitle>
        <p className="hero__text">{t('hero.text')}</p>
        <div className="hero__actions">
          <TourButton className="btn btn--dark"><Icon name="360" /><span>{t('hero.cta360')}</span></TourButton>
          <WaLink topic="consult" className="btn btn--light"><Icon name="wa" /><span>{t('hero.cta1')}</span></WaLink>
        </div>
      </HeroTour>

      {/* 2 · Category grid (8 entry points) */}
      <section className="section categories" id="sortiment" aria-labelledby="cat-title">
        <h2 className="visually-hidden" id="cat-title">{t('cat.title')}</h2>
        <Reveal as="ul" kind="items" className="container cat-grid">
          {CATEGORIES.map((item, i) => {
            const inner = (
              <>
                <span className="media media--4x3"><Img photo={item.photo} /></span>
                <span className="cat-card__label"><span className="link">{t(item.label)}</span></span>
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
      </section>

      {/* 3 · Showroom: photo with text, then "well advised" in four picture cards */}
      <section className="section section--soft feature" id="showroom" aria-labelledby="showroom-title">
        <Reveal kind="media" className="container feature__inner feature__inner--media-first">
          <Link className="feature__media" href="/beratung" tabIndex={-1} aria-hidden="true">
            <img src="/assets/img/showroom-beratung.jpg" width={1260} height={1040} alt="" loading="lazy" />
          </Link>
          <div className="feature__content">
            <p className="eyebrow"><span>{t('showroom.eyebrow')}</span></p>
            <SplitHeading className="h2" id="showroom-title">{t('showroom.title')}</SplitHeading>
            <div className="feature__prose">
              <p>{t('showroom.text')}</p>
              <ul className="bullets showroom__list">
                {lines(t('showroom.list')).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="feature__actions">
                <Link className="btn btn--dark btn--arrow" href="/beratung"><span>{t('showroom.more')}</span><Icon name="arrow" /></Link>
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
                <h3 className="conf-card__title">{t('svc.planning')}</h3>
                <span className="link">{t('svcp.more')}</span>
              </Link>
            </li>
            <li style={conf()}>
              <a className="conf-card" href="#kontakt">
                <span className="media media--2x3"><Img photo={advice('showroom')} /></span>
                <h3 className="conf-card__title">{t('showroom.eyebrow')}</h3>
                <span className="link">{t('conf.showroom.link')}</span>
              </a>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/verlegung-montage">
                <span className="media media--2x3"><Img photo={advice('montage')} /></span>
                <h3 className="conf-card__title">{t('svc.delivery')}</h3>
                <span className="link">{t('svcp.more')}</span>
              </Link>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/kataloge">
                <span className="media media--2x3"><Img photo={advice('kataloge')} /></span>
                <h3 className="conf-card__title">{t('conf.catalogs.title')}</h3>
                <span className="link">{t('conf.catalogs.link')}</span>
              </Link>
            </li>
          </Reveal>
        </div>
      </section>

      {/* 4 · Featured tiles (scroll carousel) */}
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
        </Carousel>
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

      {/* 5 · Professionals (multi-column on dark) */}
      <section className="section section--dark pro" id="profis" aria-labelledby="pro-title">
        <div className="container">
          <SplitHeading className="h2" id="pro-title">{t('pro.title')}</SplitHeading>
          <Reveal as="p" kind="fade" className="pro__intro">{t('pro.text')}</Reveal>
          <Reveal as="ul" kind="items" className="pro-grid">
            {PRO_CARDS.map(({ n, photo: p }, i) => (
              <li key={n} className="pro-card" style={idx(i)}>
                <span className="media media--3x2"><Img photo={p} /></span>
                <h3 className="pro-card__title">{t(`pro.c${n}.title`)}</h3>
                <ul className="bullets">
                  <li>{t(`pro.c${n}.b1`)}</li>
                  <li>{t(`pro.c${n}.b2`)}</li>
                  <li>{t(`pro.c${n}.b3`)}</li>
                </ul>
              </li>
            ))}
          </Reveal>
          <Reveal kind="fade" className="pro__cta">
            <WaLink topic="pro" className="btn btn--light">{t('pro.cta')}</WaLink>
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

      {/* 7 · Two audiences */}
      <section className="section duo" aria-label={t('duo.label')}>
        <Reveal as="ul" kind="items" className="container duo-grid">
          <li style={idx(0)}>
            <WaLink topic="consult" className="duo-card">
              <span className="media media--4x3"><Img photo={photo(PHOTO.slide3, { pos: '42% 50%' })} /></span>
              <h3 className="duo-card__title">{t('duo.home.title')}</h3>
              <p>{t('duo.home.text')}</p>
              <span className="link">{t('duo.home.link')}</span>
            </WaLink>
          </li>
          <li style={idx(1)}>
            <a className="duo-card" href="#profis">
              <span className="media media--4x3"><Img photo={photo(PHOTO.stairs, { pos: '50% 55%' })} /></span>
              <h3 className="duo-card__title">{t('duo.pro.title')}</h3>
              <p>{t('duo.pro.text')}</p>
              <span className="link">{t('duo.pro.link')}</span>
            </a>
          </li>
        </Reveal>
      </section>

      {/* 8 · Story band (soft background) */}
      <section className="section section--soft story" aria-labelledby="story-title">
        <h2 className="visually-hidden" id="story-title">{t('story.title')}</h2>
        <Reveal as="ul" kind="items" className="container duo-grid">
          <li className="story-card" style={story()}>
            <span className="media media--wide story-card__media">
              <Img photo={tile('IMG_9908')} />
              <span className="story-card__overlay" aria-hidden="true">
                <img className="story-card__mark" src={BRAND.mark} alt="" loading="lazy" />
                <span className="story-card__claim">
                  {lines(t('story.claim')).map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}
                </span>
              </span>
            </span>
            <h3 className="duo-card__title">{t('story.rebrand.title')}</h3>
            <p>{t('story.rebrand.text')}</p>
            <a className="link" href="#showroom">{t('story.rebrand.link')}</a>
          </li>
          <li className="story-card" style={story()}>
            <span className="media media--wide story-card__media">
              <Img photo={tile('IMG_9910')} />
              <span className="lang-badge" aria-hidden="true">
                <svg className="lang-badge__ring" viewBox="0 0 200 200">
                  <defs><path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                  <text><textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">BERATUNG · DANIŞMANLIK · ADVICE ·</textPath></text>
                </svg>
                <span className="lang-badge__core">DE<br />TR<br />EN</span>
              </span>
            </span>
            <h3 className="duo-card__title">{t('story.lang.title')}</h3>
            <p>{t('story.lang.text')}</p>
            <WaLink topic="general" className="link">{t('story.lang.link')}</WaLink>
          </li>
        </Reveal>
      </section>

      {/* 9 · FAQ */}
      <section className="section faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-section__inner">
          <SplitHeading className="h2 section-title" id="faq-title">{t('svcp.faq')}</SplitHeading>
          <Faq items={FAQ.map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }))} />
        </div>
      </section>
    </main>
  );
}

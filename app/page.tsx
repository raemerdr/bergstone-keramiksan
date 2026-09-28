import { Fragment } from 'react';
import { preconnect, preload } from 'react-dom';
import { Carousel, CarouselButton, CarouselTrack } from '@/components/carousel';
import { DialogTrigger } from '@/components/dialogs';
import { HeroTitle, HeroTour } from '@/components/home/hero-tour';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { ProductCard } from '@/components/product-card';
import { TourButton } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import type { MessageKey } from '@/lib/i18n';
import { lines } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { BRAND, HOSTED_TOUR, PHOTO, SITE } from '@/lib/site';
import { FEATURED_TILES, tileById, tilePhoto, type Tile } from '@/lib/tiles';
import { idx, pos, stagger } from '@/lib/ui';
import type { WaTopic } from '@/lib/whatsapp';

/** A cover photo; catalogue tile photos (`tile`) get the label-strip crop. */
interface Photo { src: string; tile?: boolean; pos?: string }

const photo = (src: string, extra: Omit<Photo, 'src'> = {}): Photo => ({ src, ...extra });
const tile = (img: string): Photo => ({ src: tilePhoto(img), tile: true });

function Img({ photo: p }: { photo: Photo }) {
  return <img className={p.tile ? 'is-tile' : undefined} src={p.src} alt="" loading="lazy" style={p.pos ? pos(p.pos) : undefined} />;
}

const CATEGORIES: ({ label: MessageKey; photo: Photo } & ({ href: string } | { wa: WaTopic }))[] = [
  { label: 'cat.all', href: '/fliesen', photo: tile('IMG_9943') },
  { label: 'cat.wall', href: '/fliesen?art=wandfliesen', photo: photo(PHOTO.slide2, { pos: '72% 50%' }) },
  { label: 'cat.floor', href: '/fliesen?art=bodenfliesen', photo: photo(PHOTO.hall, { pos: '50% 70%' }) },
  { label: 'cat.large', href: '/fliesen?art=grossformate', photo: tile('IMG_9894') },
  { label: 'cat.slabs', href: '/fliesen?art=steinplatten', photo: tile('IMG_9915') },
  { label: 'cat.kitchens', wa: 'kitchen', photo: photo(PHOTO.kitchen, { pos: '50% 55%' }) },
  { label: 'cat.worktops', wa: 'worktop', photo: tile('IMG_9936') },
  { label: 'cat.install', href: '/verlegung-montage', photo: photo(PHOTO.stairs, { pos: '50% 40%' }) },
];

const PRO_CARDS: { n: 1 | 2 | 3 | 4; photo: Photo }[] = [
  { n: 1, photo: tile('IMG_9942') },
  { n: 2, photo: photo(PHOTO.shower, { pos: '70% 62%' }) },
  { n: 3, photo: tile('IMG_9938') },
  { n: 4, photo: photo(PHOTO.bath, { pos: '50% 60%' }) },
];

const REFERENCES: { caption: MessageKey; photo: Photo }[] = [
  { caption: 'refs.kitchen', photo: photo(PHOTO.kitchen) },
  { caption: 'refs.stairs', photo: photo(PHOTO.stairs) },
  { caption: 'refs.bath', photo: photo(PHOTO.bath) },
  { caption: 'refs.hall', photo: photo(PHOTO.hall) },
  { caption: 'refs.shower', photo: photo(PHOTO.shower, { pos: '72% 50%' }) },
  { caption: 'refs.tub', photo: photo(PHOTO.tub) },
];

const SOCIAL: Photo[] = [
  tile('IMG_9894'), photo(PHOTO.kitchen), tile('IMG_9908'), photo(PHOTO.slide2, { pos: '70% 50%' }),
  tile('IMG_9913'), photo(PHOTO.stairs), tile('IMG_9901'), photo(PHOTO.slide3, { pos: '45% 50%' }),
  tile('IMG_9937'), photo(PHOTO.hall), tile('IMG_9898'), photo(PHOTO.slider1, { pos: '62% 50%' }),
];

const featured = FEATURED_TILES.map((id) => tileById.get(id)).filter((item): item is Tile => !!item);

export default async function Home() {
  const t = await getT();
  preload('/assets/img/tour/hero-360.jpg', { as: 'image', media: '(min-width: 700px)', fetchPriority: 'high' });
  preload('/assets/img/tour/hero-360-mobile.jpg', { as: 'image', media: '(max-width: 699px)', fetchPriority: 'high' });
  preconnect(new URL(HOSTED_TOUR.url).origin);
  const conf = stagger();
  const story = stagger();

  return (
    <main id="main">
      {/* 1 · Hero — the poster is a frame of the 360° tour; the button swaps it for the live tour */}
      <HeroTour alt={t('hero.alt')}>
        <p className="eyebrow hero__eyebrow"><Icon name="tile" /><span>{t('hero.eyebrow')}</span></p>
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

      {/* 3 · Media with text — 360° showroom */}
      <section className="section section--soft feature" id="showroom" aria-labelledby="showroom-title">
        <Reveal kind="media" className="container feature__inner">
          <div className="feature__content">
            <p className="eyebrow"><Icon name="tile" /><span>{t('showroom.eyebrow')}</span></p>
            <SplitHeading className="h2" id="showroom-title">{t('showroom.title')}</SplitHeading>
            <div className="feature__prose">
              <p>{t('showroom.text')}</p>
              <p className="feature__hours">
                <Icon name="pin" />
                <span>{SITE.address}<br /><span className="nowrap">{t('showroom.hours')}</span></span>
              </p>
              <div className="feature__actions">
                <TourButton className="btn btn--dark"><Icon name="360" /><span>{t('showroom.cta')}</span></TourButton>
                <a className="link" href={SITE.maps} target="_blank" rel="noopener">{t('showroom.route')}</a>
              </div>
            </div>
          </div>
          <TourButton className="feature__media" aria-label={t('showroom.cta')}>
            <img src="/assets/img/tour/showroom-lounge.jpg" width={1260} height={1040} alt="" loading="lazy" />
            <span className="tour-badge" aria-hidden="true"><Icon name="360" />360°</span>
          </TourButton>
        </Reveal>
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

      {/* 6 · Rich text + tall image carousel — real projects */}
      <section className="section refs" id="referenzen" aria-labelledby="refs-title">
        <div className="container section-intro">
          <SplitHeading className="h2" id="refs-title">{t('refs.title')}</SplitHeading>
          <Reveal as="p" kind="fade">{t('refs.text')}</Reveal>
        </div>
        <Carousel>
          <div className="container gallery">
            <CarouselButton dir="prev" className="round-btn round-btn--float gallery__prev" label={t('a11y.prev')} />
            <CarouselTrack as="ul" reveal className="gallery__track">
              {REFERENCES.map(({ caption, photo: p }, i) => (
                <li key={caption} className="gallery__item" style={idx(i)}>
                  <figure>
                    <span className="media media--tall"><Img photo={p} /></span>
                    <figcaption>{t(caption)}</figcaption>
                  </figure>
                </li>
              ))}
            </CarouselTrack>
            <CarouselButton dir="next" className="round-btn round-btn--float gallery__next" label={t('a11y.next')} />
          </div>
        </Carousel>
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

      {/* 8 · Well advised (four portrait cards) */}
      <section className="section confidence" id="beratung" aria-labelledby="conf-title">
        <div className="container">
          <SplitHeading className="h2" id="conf-title">{t('conf.title')}</SplitHeading>
          <Reveal as="ul" kind="items" className="conf-grid">
            <li style={conf()}>
              <Link className="conf-card" href="/planung-aufmass">
                <span className="media media--2x3"><Img photo={photo(PHOTO.hall)} /></span>
                <h3 className="conf-card__title">{t('svc.planning')}</h3>
                <span className="link">{t('svcp.more')}</span>
              </Link>
            </li>
            <li style={conf()}>
              <a className="conf-card" href="#kontakt">
                <span className="media media--2x3"><Img photo={photo('/assets/img/tour/showroom-hall.jpg')} /></span>
                <h3 className="conf-card__title">{t('showroom.eyebrow')}</h3>
                <span className="link">{t('conf.showroom.link')}</span>
              </a>
            </li>
            <li style={conf()}>
              <Link className="conf-card" href="/verlegung-montage">
                <span className="media media--2x3"><Img photo={photo(PHOTO.shower, { pos: '74% 50%' })} /></span>
                <h3 className="conf-card__title">{t('svc.delivery')}</h3>
                <span className="link">{t('svcp.more')}</span>
              </Link>
            </li>
            <li style={conf()}>
              <DialogTrigger dialog="catalogs" className="conf-card">
                <span className="media media--2x3 catalog-visual">
                  <Img photo={tile('IMG_9913')} />
                  <span className="catalog-visual__book" aria-hidden="true">
                    <img src={BRAND.mark} alt="" loading="lazy" />
                    <span className="catalog-visual__label">{t('nav.catalogs')}</span>
                    <span className="catalog-visual__list">Fliesen · Quarz · Dexstone · Pamesa</span>
                  </span>
                </span>
                <span className="conf-card__title">{t('conf.catalogs.title')}</span>
                <span className="link">{t('conf.catalogs.link')}</span>
              </DialogTrigger>
            </li>
          </Reveal>
        </div>
      </section>

      {/* 9 · Story band (soft background) */}
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

      {/* 10 · Social grid */}
      <section className="section social" aria-labelledby="social-title">
        <h2 className="visually-hidden" id="social-title">Instagram</h2>
        <Reveal as="ul" kind="items" className="container social-grid">
          {SOCIAL.map((p, i) => (
            <li key={i} style={idx(i)}>
              <a href={SITE.instagram} target="_blank" rel="noopener" aria-label={t('social.post')}>
                <Img photo={p} /><Icon name="instagram" />
              </a>
            </li>
          ))}
        </Reveal>
        <Reveal kind="fade" className="social__cta">
          <a className="btn btn--dark" href={SITE.instagram} target="_blank" rel="noopener"><Icon name="instagram" /><span>{t('social.cta')}</span></a>
        </Reveal>
      </section>
    </main>
  );
}

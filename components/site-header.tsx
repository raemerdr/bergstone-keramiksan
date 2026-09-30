import { DialogTrigger } from '@/components/dialogs';
import { HeaderShell, MegaItem, NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { BRAND, CATALOGS, SITE, catalogDownload, catalogFileName } from '@/lib/site';
import { tilePhoto } from '@/lib/tiles';
import { SERVICES } from '@/lib/services';
import { stagger } from '@/lib/ui';

/** Inside of a service photo button: the picture with its name and an arrow on it. */
const megaCard = (img: string, label: string) => (
  <>
    <span className="media"><img src={`/assets/img/mega/${img}.jpg`} alt="" width={640} height={480} loading="lazy" /></span>
    <span className="mega-card__label"><span>{label}</span><Icon name="arrow" /></span>
  </>
);

export async function SiteHeader() {
  const t = await getT();
  // Mega menu entries fade in one after another (--i in document order, per menu)
  const tiles = stagger();
  const services = stagger();

  return (
    <HeaderShell>
      <div className="header__inner">
        <DialogTrigger dialog="menu" className="icon-btn header__burger" aria-label={t('a11y.menu')}>
          <Icon name="menu" />
        </DialogTrigger>

        <Link className="header__logo" href="/">
          <img src={BRAND.logoHeader} alt="Bergstone Keramiksan" width={838} height={180} />
        </Link>

        <nav className="header__nav" aria-label={t('a11y.nav')}>
          <ul className="nav">
            <MegaItem id="tiles" label={t('nav.tiles')} section={['/fliesen']}>
              <div className="mega__col">
                <p className="mega__title">{t('mega.range')}</p>
                <ul>
                  <li style={tiles()}><NavLink href="/fliesen">{t('cat.all')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/fliesen?art=wandfliesen">{t('cat.wall')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/fliesen?art=bodenfliesen">{t('cat.floor')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/fliesen?art=grossformate">{t('cat.large')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/fliesen?art=steinplatten">{t('cat.slabs')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/fliesen?art=kueche">{t('cat.kitchen')}</NavLink></li>
                </ul>
              </div>
              <div className="mega__col">
                <p className="mega__title">{t('mega.tileService')}</p>
                <ul>
                  <li style={tiles()}><NavLink href="/beratung">{t('mega.showroomAdvice')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/planung-aufmass">{t('svc.planning')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/verlegung-montage">{t('cat.install')}</NavLink></li>
                  <li style={tiles()}><NavLink href="/reparaturen">{t('svc.repairs')}</NavLink></li>
                </ul>
              </div>
              <div className="mega__col">
                <p className="mega__title">Downloads</p>
                <ul>
                  <li style={tiles()}><a href={catalogDownload(CATALOGS[0])} download={catalogFileName(CATALOGS[0])}>{t('cat.pdf.tiles')}</a></li>
                  <li style={tiles()}><a href={catalogDownload(CATALOGS[3])} download={catalogFileName(CATALOGS[3])}>{t('cat.pdf.pamesa')}</a></li>
                  <li style={tiles()}><Link href="/kataloge">{t('mega.allCatalogs')}</Link></li>
                </ul>
              </div>
              <NavLink className="mega__promo" href="/fliesen" style={tiles()}>
                <span className="media media--4x3"><img src={tilePhoto('IMG_9913')} alt="" loading="lazy" /></span>
                <span className="mega__promo-label">{t('best.title')}</span>
              </NavLink>
              <TourLink className="mega__promo" style={tiles()}>
                <span className="media media--4x3"><img src="/assets/img/tour/hero-360.jpg" alt="" loading="lazy" /></span>
                <span className="mega__promo-label">{t('svc.tour')}</span>
              </TourLink>
            </MegaItem>



            {/* Services: a photo button per service, its name inside the picture (small copies in /assets/img/mega) */}
            <MegaItem id="services" label={t('nav.services')} section={SERVICES.map(({ slug }) => `/${slug}`)} cards>
              <p className="mega__title">{t('nav.services')}</p>
              <ul className="mega-cards">
                <li style={services()}><NavLink className="mega-card" href="/beratung">{megaCard('beratung', t('svc.consult'))}</NavLink></li>
                <li style={services()}><NavLink className="mega-card" href="/planung-aufmass">{megaCard('planung', t('svc.planning'))}</NavLink></li>
                <li style={services()}><NavLink className="mega-card" href="/verlegung-montage">{megaCard('verlegung', t('svc.delivery'))}</NavLink></li>
                <li style={services()}><NavLink className="mega-card" href="/reparaturen">{megaCard('reparaturen', t('svc.repairs'))}</NavLink></li>
                <li style={services()}><TourLink className="mega-card">{megaCard('showroom-360', t('svc.tour'))}</TourLink></li>
              </ul>
            </MegaItem>

            <li className="nav__item"><NavLink className="nav__link" href="/kataloge">{t('nav.catalogs')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/blog">{t('nav.blog')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/kontakt">{t('footer.contact')}</NavLink></li>
          </ul>
        </nav>

        <div className="header__actions">
          <a className="header__call" href={SITE.phoneHref} aria-label={`${t('footer.call')}: ${SITE.phone}`}>
            <span className="header__call-icon"><Icon name="phone" /></span>
            <span className="header__call-text"><small>{t('footer.call')}</small>{SITE.phone}</span>
          </a>
          <WaLink topic="general" className="btn btn--dark header__cta">
            <span className="header__cta-long">{t('nav.enquire')}</span>
            <span className="header__cta-short">{t('nav.enquireShort')}</span>
          </WaLink>
        </div>
      </div>
    </HeaderShell>
  );
}

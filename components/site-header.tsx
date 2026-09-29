import { DialogTrigger } from '@/components/dialogs';
import { HeaderShell, MegaItem, NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { BRAND, CATALOGS, catalogDownload, catalogFileName } from '@/lib/site';
import { tilePhoto } from '@/lib/tiles';
import { stagger } from '@/lib/ui';

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
          <img src={BRAND.logo} alt="Bergstone Keramiksan" width={943} height={180} />
        </Link>

        <nav className="header__nav" aria-label={t('a11y.nav')}>
          <ul className="nav">
            <MegaItem id="tiles" label={t('nav.tiles')}>
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



            <MegaItem id="services" label={t('nav.services')} compact>
              <div className="mega__col">
                <p className="mega__title">{t('nav.services')}</p>
                <ul>
                  <li style={services()}><NavLink href="/beratung">{t('svc.consult')}</NavLink></li>
                  <li style={services()}><NavLink href="/planung-aufmass">{t('svc.planning')}</NavLink></li>
                  <li style={services()}><NavLink href="/verlegung-montage">{t('svc.delivery')}</NavLink></li>
                  <li style={services()}><NavLink href="/reparaturen">{t('svc.repairs')}</NavLink></li>
                  <li style={services()}><TourLink>{t('svc.tour')}</TourLink></li>
                </ul>
              </div>
            </MegaItem>

            <li className="nav__item"><NavLink className="nav__link" href="/kataloge">{t('nav.catalogs')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/blog">{t('nav.blog')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#profis">{t('nav.pro')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#bewertungen">{t('nav.refs')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#showroom">{t('nav.showroom')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/kontakt">{t('footer.contact')}</NavLink></li>
          </ul>
        </nav>

        <div className="header__actions">
          <WaLink topic="general" className="btn btn--dark header__cta">
            <span className="header__cta-long">{t('nav.enquire')}</span>
            <span className="header__cta-short">{t('nav.enquireShort')}</span>
          </WaLink>
        </div>
      </div>
    </HeaderShell>
  );
}

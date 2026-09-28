import { DialogTrigger } from '@/components/dialogs';
import { HeaderShell, MegaItem, NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { SavedCount } from '@/components/wishlist';
import { getT } from '@/lib/i18n/server';
import { BRAND, CATALOGS, PHOTO, SITE } from '@/lib/site';
import { tilePhoto } from '@/lib/tiles';
import { stagger } from '@/lib/ui';

export async function SiteHeader() {
  const t = await getT();
  // Mega menu entries fade in one after another (--i in document order, per menu)
  const tiles = stagger();
  const kitchens = stagger();
  const worktops = stagger();
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
                  <li style={tiles()}><a href={CATALOGS.tiles} target="_blank" rel="noopener">{t('cat.pdf.tiles')}</a></li>
                  <li style={tiles()}><a href={CATALOGS.pamesa} target="_blank" rel="noopener">{t('cat.pdf.pamesa')}</a></li>
                  <li style={tiles()}><DialogTrigger dialog="catalogs">{t('mega.allCatalogs')}</DialogTrigger></li>
                </ul>
              </div>
              <NavLink className="mega__promo" href="/fliesen" style={tiles()}>
                <span className="media media--4x3"><img className="is-tile" src={tilePhoto('IMG_9913')} alt="" loading="lazy" /></span>
                <span className="mega__promo-label">{t('best.title')}</span>
              </NavLink>
              <TourLink className="mega__promo" style={tiles()}>
                <span className="media media--4x3"><img src="/assets/img/tour/hero-360.jpg" alt="" loading="lazy" /></span>
                <span className="mega__promo-label">{t('svc.tour')}</span>
              </TourLink>
            </MegaItem>

            <MegaItem id="kitchens" label={t('nav.kitchens')}>
              <div className="mega__col">
                <p className="mega__title">{t('nav.kitchens')}</p>
                <ul>
                  <li style={kitchens()}><NavLink href="/#sortiment">{t('mega.customKitchens')}</NavLink></li>
                  <li style={kitchens()}><NavLink href="/#sortiment">{t('mega.modular')}</NavLink></li>
                  <li style={kitchens()}><NavLink href="/#sortiment">{t('mega.appliances')}</NavLink></li>
                  <li style={kitchens()}><NavLink href="/#sortiment">{t('cat.worktops')}</NavLink></li>
                </ul>
              </div>
              <div className="mega__col">
                <p className="mega__title">{t('mega.process')}</p>
                <ul>
                  <li style={kitchens()}><NavLink href="/planung-aufmass">{t('mega.kitchenPlanning')}</NavLink></li>
                  <li style={kitchens()}><NavLink href="/planung-aufmass">{t('mega.onsite')}</NavLink></li>
                  <li style={kitchens()}><NavLink href="/verlegung-montage">{t('svc.delivery')}</NavLink></li>
                </ul>
              </div>
              <WaLink topic="kitchen" className="mega__promo mega__promo--wide" style={kitchens()}>
                <span className="media media--16x9"><img src={PHOTO.kitchen} alt="" loading="lazy" /></span>
                <span className="mega__promo-label">{t('mega.kitchenAdvice')}</span>
              </WaLink>
            </MegaItem>

            <MegaItem id="worktops" label={t('nav.worktops')} compact>
              <div className="mega__col">
                <p className="mega__title">{t('mega.materials')}</p>
                <ul>
                  <li style={worktops()}><NavLink href="/#sortiment">{t('mega.quartz')}</NavLink></li>
                  <li style={worktops()}><NavLink href="/#sortiment">{t('mega.ceramic')}</NavLink></li>
                  <li style={worktops()}><NavLink href="/#sortiment">{t('mega.stone')}</NavLink></li>
                </ul>
              </div>
              <div className="mega__col">
                <p className="mega__title">Downloads</p>
                <ul>
                  <li style={worktops()}><a href={CATALOGS.quartz} target="_blank" rel="noopener">{t('cat.pdf.quartz')}</a></li>
                  <li style={worktops()}><a href={CATALOGS.dexstone} target="_blank" rel="noopener">{t('cat.pdf.dexstone')}</a></li>
                </ul>
              </div>
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

            <li className="nav__item"><DialogTrigger dialog="catalogs" className="nav__link">{t('nav.catalogs')}</DialogTrigger></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#profis">{t('nav.pro')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#referenzen">{t('nav.refs')}</NavLink></li>
            <li className="nav__item"><NavLink className="nav__link" href="/#showroom">{t('nav.showroom')}</NavLink></li>
          </ul>
        </nav>

        <div className="header__actions">
          <a className="icon-btn" href={SITE.phoneHref} aria-label={t('a11y.call')}>
            <Icon name="phone" />
          </a>
          <WaLink topic="general" className="icon-btn" aria-label={t('a11y.whatsapp')}>
            <Icon name="wa" />
          </WaLink>
          <DialogTrigger dialog="saved" className="icon-btn" aria-label={t('a11y.saved')}>
            <Icon name="heart" className="icon-heart" />
            <SavedCount />
          </DialogTrigger>
        </div>
      </div>
    </HeaderShell>
  );
}

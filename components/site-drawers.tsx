import { DialogTrigger, Drawer } from '@/components/dialogs';
import { NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { WaLink } from '@/components/wa-link';
import { SavedList, SavedSend } from '@/components/wishlist';
import { getT } from '@/lib/i18n/server';
import type { Translate } from '@/lib/i18n';
import { BRAND, CATALOGS, SITE } from '@/lib/site';
import { idx, stagger } from '@/lib/ui';

function CloseButton({ t }: { t: Translate }) {
  return (
    <button className="icon-btn" type="button" data-close aria-label={t('a11y.close')}>
      <Icon name="close" />
    </button>
  );
}

/** Catalogues, wishlist and the mobile menu — opened by DialogTrigger buttons across the site. */
export async function SiteDrawers() {
  const t = await getT();
  const catalogs: { href: string; title: string; cover?: string }[] = [
    { href: CATALOGS.tiles, title: t('cat.pdf.tiles'), cover: CATALOGS.tilesCover },
    { href: CATALOGS.quartz, title: t('cat.pdf.quartz'), cover: CATALOGS.quartzCover },
    { href: CATALOGS.dexstone, title: t('cat.pdf.dexstone') },
    { href: CATALOGS.pamesa, title: t('cat.pdf.pamesa') },
  ];
  const menu = stagger();

  return (
    <>
      <Drawer id="catalogs" aria-labelledby="catalogs-title">
        <div className="drawer__scrim" data-close />
        <div className="drawer__panel" data-panel>
          <div className="drawer__head">
            <h2 className="drawer__title" id="catalogs-title">{t('nav.catalogs')}</h2>
            <CloseButton t={t} />
          </div>
          <div className="drawer__body">
            <p className="drawer__intro">{t('catalogs.intro')}</p>
            <ul className="catalog-list">
              {catalogs.map(({ href, title, cover }, i) => (
                <li key={href} style={idx(i)}>
                  <a className="catalog-item" href={href} target="_blank" rel="noopener">
                    {cover
                      ? <span className="catalog-item__thumb"><img src={cover} alt="" loading="lazy" /></span>
                      : <span className="catalog-item__thumb catalog-item__thumb--mono"><img src={BRAND.mark} alt="" loading="lazy" /></span>}
                    <span className="catalog-item__text"><strong>{title}</strong><span>{t('catalogs.pdf')}</span></span>
                    <Icon name="download" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="drawer__foot">
            <WaLink topic="catalog" className="btn btn--dark btn--block"><Icon name="wa" /><span>{t('catalogs.wa')}</span></WaLink>
          </div>
        </div>
      </Drawer>

      <Drawer id="saved" aria-labelledby="saved-title">
        <div className="drawer__scrim" data-close />
        <div className="drawer__panel" data-panel>
          <div className="drawer__head">
            <h2 className="drawer__title" id="saved-title">{t('saved.title')}</h2>
            <CloseButton t={t} />
          </div>
          <div className="drawer__body">
            <SavedList />
          </div>
          <div className="drawer__foot">
            <SavedSend />
          </div>
        </div>
      </Drawer>

      <Drawer id="menu" className="drawer--left" aria-label={t('a11y.nav')}>
        <div className="drawer__scrim" data-close />
        <div className="drawer__panel" data-panel>
          <div className="drawer__head">
            <img className="drawer__logo" src={BRAND.logo} alt="Bergstone Keramiksan" width={943} height={180} />
            <CloseButton t={t} />
          </div>
          <nav className="drawer__body">
            <ul className="menu-list">
              <li style={menu()}><NavLink href="/fliesen">{t('nav.tiles')}</NavLink></li>
              <li style={menu()}><NavLink href="/#sortiment">{t('nav.kitchens')}</NavLink></li>
              <li style={menu()}><NavLink href="/#sortiment">{t('nav.worktops')}</NavLink></li>
              <li className="menu-list__group" style={menu()}>
                <span>{t('mega.tileService')}</span>
                <ul>
                  <li style={menu()}><NavLink href="/beratung">{t('mega.showroomAdvice')}</NavLink></li>
                  <li style={menu()}><NavLink href="/planung-aufmass">{t('svc.planning')}</NavLink></li>
                  <li style={menu()}><NavLink href="/verlegung-montage">{t('cat.install')}</NavLink></li>
                  <li style={menu()}><NavLink href="/reparaturen">{t('svc.repairs')}</NavLink></li>
                </ul>
              </li>
              <li style={menu()}><DialogTrigger dialog="catalogs">{t('nav.catalogs')}</DialogTrigger></li>
              <li style={menu()}><NavLink href="/#profis">{t('nav.pro')}</NavLink></li>
              <li style={menu()}><NavLink href="/#referenzen">{t('nav.refs')}</NavLink></li>
              <li style={menu()}><NavLink href="/#showroom">{t('nav.showroom')}</NavLink></li>
              <li style={menu()}><a href="#kontakt">{t('footer.contact')}</a></li>
            </ul>
          </nav>
          <div className="drawer__foot menu-contact">
            <WaLink topic="general" className="btn btn--dark btn--block"><Icon name="wa" /><span>WhatsApp</span></WaLink>
            <a className="btn btn--light btn--block" href={SITE.phoneHref}><Icon name="phone" /><span>{SITE.phone}</span></a>
          </div>
        </div>
      </Drawer>
    </>
  );
}

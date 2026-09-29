import { Drawer } from '@/components/dialogs';
import { NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import type { Translate } from '@/lib/i18n';
import { BRAND, SITE } from '@/lib/site';
import { stagger } from '@/lib/ui';

function CloseButton({ t }: { t: Translate }) {
  return (
    <button className="icon-btn" type="button" data-close aria-label={t('a11y.close')}>
      <Icon name="close" />
    </button>
  );
}

/** The mobile menu, opened by the DialogTrigger in the header. */
export async function SiteDrawers() {
  const t = await getT();
  const menu = stagger();

  return (
    <>
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
              <li className="menu-list__group" style={menu()}>
                <span>{t('mega.tileService')}</span>
                <ul>
                  <li style={menu()}><NavLink href="/beratung">{t('mega.showroomAdvice')}</NavLink></li>
                  <li style={menu()}><NavLink href="/planung-aufmass">{t('svc.planning')}</NavLink></li>
                  <li style={menu()}><NavLink href="/verlegung-montage">{t('cat.install')}</NavLink></li>
                  <li style={menu()}><NavLink href="/reparaturen">{t('svc.repairs')}</NavLink></li>
                </ul>
              </li>
              <li style={menu()}><NavLink href="/kataloge">{t('nav.catalogs')}</NavLink></li>
              <li style={menu()}><NavLink href="/blog">{t('nav.blog')}</NavLink></li>
              <li style={menu()}><NavLink href="/#profis">{t('nav.pro')}</NavLink></li>
              <li style={menu()}><NavLink href="/#bewertungen">{t('nav.refs')}</NavLink></li>
              <li style={menu()}><NavLink href="/#showroom">{t('nav.showroom')}</NavLink></li>
              <li style={menu()}><NavLink href="/kontakt">{t('footer.contact')}</NavLink></li>
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

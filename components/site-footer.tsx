import { DialogTrigger } from '@/components/dialogs';
import { NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { BRAND, SITE } from '@/lib/site';

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="footer" id="kontakt">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img className="footer__logo" src={BRAND.logo} alt="Bergstone Keramiksan" width={943} height={180} loading="lazy" />
          <p className="footer__about">{t('footer.about')}</p>
          <dl className="footer__facts">
            <div><dt>{t('footer.hours')}</dt><dd>{t('footer.hoursValue')}</dd></div>
            <div><dt>{t('footer.phone')}</dt><dd><a href={SITE.phoneHref}>{SITE.phone}</a></dd></div>
            <div><dt>{t('footer.email')}</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            <div><dt>{t('footer.address')}</dt><dd><a href={SITE.maps} target="_blank" rel="noopener">{SITE.address}</a></dd></div>
          </dl>
          <div className="footer__actions">
            <WaLink topic="general" className="btn btn--gold"><Icon name="wa" /><span>{t('footer.wa')}</span></WaLink>
            <a className="btn btn--ghost-light" href={SITE.phoneHref}><Icon name="phone" /><span>{t('footer.call')}</span></a>
          </div>
        </div>

        <nav className="footer__col" aria-labelledby="f-range">
          <p className="footer__title" id="f-range">{t('footer.range')}</p>
          <ul>
            <li><NavLink href="/fliesen">{t('nav.tiles')}</NavLink></li>
            <li><NavLink href="/#sortiment">{t('nav.kitchens')}</NavLink></li>
            <li><NavLink href="/#sortiment">{t('cat.worktops')}</NavLink></li>
            <li><NavLink href="/fliesen?art=steinplatten">{t('cat.slabs')}</NavLink></li>
            <li><DialogTrigger dialog="catalogs">{t('nav.catalogs')}</DialogTrigger></li>
          </ul>
        </nav>
        <nav className="footer__col" aria-labelledby="f-service">
          <p className="footer__title" id="f-service">{t('nav.services')}</p>
          <ul>
            <li><NavLink href="/beratung">{t('svc.consult')}</NavLink></li>
            <li><NavLink href="/planung-aufmass">{t('svc.planning')}</NavLink></li>
            <li><NavLink href="/verlegung-montage">{t('svc.delivery')}</NavLink></li>
            <li><NavLink href="/reparaturen">{t('svc.repairs')}</NavLink></li>
            <li><TourLink>{t('svc.tour')}</TourLink></li>
          </ul>
        </nav>
        <nav className="footer__col" aria-labelledby="f-company">
          <p className="footer__title" id="f-company">{t('footer.company')}</p>
          <ul>
            <li><NavLink href="/#showroom">{t('footer.aboutLink')}</NavLink></li>
            <li><NavLink href="/#referenzen">{t('nav.refs')}</NavLink></li>
            <li><NavLink href="/#profis">{t('nav.pro')}</NavLink></li>
            <li><a href="#kontakt">{t('footer.contact')}</a></li>
          </ul>
        </nav>
        <nav className="footer__col" aria-labelledby="f-social">
          <p className="footer__title" id="f-social">{t('footer.follow')}</p>
          <ul className="footer__social">
            <li><a href={SITE.instagram} target="_blank" rel="noopener"><Icon name="instagram" />Instagram</a></li>
            <li><a href={SITE.facebook} target="_blank" rel="noopener"><Icon name="facebook" />Facebook</a></li>
            <li><a href={SITE.tiktok} target="_blank" rel="noopener"><Icon name="tiktok" />TikTok</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer__bottom">
        <p>© 2026 Bergstone Keramiksan GmbH</p>
        <ul>
          <li><a href="#top">{t('footer.imprint')}</a></li>
          <li><a href="#top">{t('footer.privacy')}</a></li>
        </ul>
      </div>
    </footer>
  );
}

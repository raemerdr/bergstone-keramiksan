import { NavLink } from '@/components/header-client';
import { Icon } from '@/components/icons';
import { SplitHeading } from '@/components/motion';
import { QuickMessage } from '@/components/quick-message';
import { TourLink } from '@/components/tour-triggers';
import { getT } from '@/lib/i18n/server';
import { BRAND, CREDIT, SITE } from '@/lib/site';

/* Footer: an invitation to the showroom over a thin line, then the brand with its socials, three link
   columns and a contact column with a one-line WhatsApp message, then the legal line. */
export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="footer" id="kontakt">
      <div className="container">
        <div className="footer__cta">
          <SplitHeading className="h2 footer__cta-title" id="footer-cta-title">{t('footer.ctaTitle')}</SplitHeading>
          <a className="btn btn--gold" href={SITE.maps} target="_blank" rel="noopener"><Icon name="pin" /><span>{t('contact.route')}</span></a>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <img className="footer__logo" src={BRAND.logo} alt="Bergstone Keramiksan" width={943} height={180} loading="lazy" />
            <p className="footer__about">{t('footer.about')}</p>
            <ul className="footer__socials" aria-label={t('footer.follow')}>
              <li><a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" /></a></li>
              <li><a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a></li>
              <li><a href={SITE.tiktok} target="_blank" rel="noopener" aria-label="TikTok"><Icon name="tiktok" /></a></li>
            </ul>
          </div>

          <nav className="footer__col" aria-labelledby="f-range">
            <p className="footer__title" id="f-range">{t('footer.range')}</p>
            <ul>
              <li><NavLink href="/fliesen">{t('nav.tiles')}</NavLink></li>
              <li><NavLink href="/#sortiment">{t('nav.kitchens')}</NavLink></li>
              <li><NavLink href="/#sortiment">{t('cat.worktops')}</NavLink></li>
              <li><NavLink href="/fliesen?art=steinplatten">{t('cat.slabs')}</NavLink></li>
              <li><NavLink href="/kataloge">{t('nav.catalogs')}</NavLink></li>
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
              <li><NavLink href="/#bewertungen">{t('nav.refs')}</NavLink></li>
              <li><NavLink href="/blog">{t('nav.blog')}</NavLink></li>
              <li><NavLink href="/#profis">{t('nav.pro')}</NavLink></li>
              <li><NavLink href="/kontakt">{t('footer.contact')}</NavLink></li>
            </ul>
          </nav>

          <div className="footer__col footer__contact">
            <p className="footer__title">{t('footer.contact')}</p>
            <ul>
              <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><a href={SITE.maps} target="_blank" rel="noopener">{lines(SITE.address, ', ')}</a></li>
              <li className="footer__hours">{lines(t('footer.hoursValue'), ' · ')}</li>
            </ul>
            <p className="footer__title footer__quick-title">{t('footer.quickTitle')}</p>
            <QuickMessage label={t('contact.form.message')} send={t('contact.form.wa')} greeting={t('wa.greeting')} lang={t('wa.lang')} />
            <p className="footer__quick-note">{t('footer.quickNote')}</p>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Bergstone Keramiksan GmbH</p>
        <p className="footer__credit" lang="en">
          {CREDIT.label}{' '}
          <a href={CREDIT.url} target="_blank" rel="noopener noreferrer">{CREDIT.name}<span className="visually-hidden"> {t('a11y.newTab')}</span></a>
        </p>
        <ul>
          <li><NavLink href="/impressum">{t('footer.imprint')}</NavLink></li>
          <li><NavLink href="/datenschutz">{t('footer.privacy')}</NavLink></li>
        </ul>
      </div>
    </footer>
  );
}

/** Text split at `separator` onto lines of their own. */
const lines = (text: string, separator: string) =>
  text.split(separator).map((line, i) => <span key={i} className="footer__line">{line}</span>);

import type { Metadata } from 'next';
import { Link } from '@/components/link';
import { SplitHeading } from '@/components/motion';
import { getT } from '@/lib/i18n/server';
import { COMPANY, SITE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: `${t('footer.imprint')} | ${SITE.name}` };
}

/** Legal notice (§ 5 DDG). The text is German in every language version. */
export default async function ImprintPage() {
  const t = await getT();

  return (
    <main id="main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container container--narrow">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('footer.imprint')}</span>
          </nav>
          <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('footer.imprint')}</SplitHeading>
        </div>
      </section>

      <section className="section legal" aria-labelledby="page-title">
        <div className="container">
          <div className="prose" lang="de">
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>{COMPANY.name}<br />{COMPANY.street}<br />{COMPANY.city}</p>
            <p>Vertreten durch: {COMPANY.representative}</p>

            <h2>Kontakt</h2>
            <p>
              Telefon: <a href={SITE.phoneHref}>{SITE.phone}</a><br />
              E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>

            <h2>Registereintrag</h2>
            <p>Eintragung im Handelsregister<br />Registergericht: {COMPANY.court}<br />Registernummer: {COMPANY.register}</p>

            <h2>Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {COMPANY.vatId}</p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>{COMPANY.representative}<br />{COMPANY.street}<br />{COMPANY.city}</p>

            <h2>Verbraucherstreitbeilegung</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

            <h2>Bildnachweise</h2>
            <p>
              Icons: Uicons by <a href="https://www.flaticon.com/uicons" target="_blank" rel="noopener">Flaticon</a>.
              Ein Teil der Fotos auf dieser Website ist mit KI erstellt, viele davon auf Grundlage von Fliesen und Platten aus unserem Sortiment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

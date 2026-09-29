import type { Metadata } from 'next';
import { Link } from '@/components/link';
import { SplitHeading } from '@/components/motion';
import { getT } from '@/lib/i18n/server';
import { COMPANY, SITE } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: `${t('footer.privacy')} | ${SITE.name}` };
}

/* Privacy policy. It describes what this site actually does: no cookies, no analytics, self-hosted
   fonts, links (not embeds) to WhatsApp, Google Maps and social networks, a few images from
   keramiksan.de and the hosted 360° tour as a fallback. Update it when any of that changes.
   The text is German in every language version. */
export default async function PrivacyPage() {
  const t = await getT();

  return (
    <main id="main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container container--narrow">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('footer.privacy')}</span>
          </nav>
          <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('footer.privacy')}</SplitHeading>
        </div>
      </section>

      <section className="section legal" aria-labelledby="page-title">
        <div className="container">
          <div className="prose" lang="de">
            <h2>1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p>
              {COMPANY.name}<br />{COMPANY.street}<br />{COMPANY.city}<br />
              Vertreten durch: {COMPANY.representative}<br />
              Telefon: <a href={SITE.phoneHref}>{SITE.phone}</a><br />
              E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>

            <h2>2. Das Wichtigste in Kürze</h2>
            <p>
              Wir gehen sparsam mit Ihren Daten um. Diese Website setzt keine Cookies, verwendet keine Analyse- oder
              Tracking-Werkzeuge und bindet keine Social-Media-Plugins ein. Personenbezogene Daten verarbeiten wir vor allem,
              wenn Sie die Website aufrufen (technisch notwendige Server-Logfiles) und wenn Sie uns per Telefon, E-Mail oder
              WhatsApp kontaktieren.
            </p>

            <h2>3. Hosting und Server-Logfiles</h2>
            <p>
              Beim Aufruf dieser Website verarbeitet der Server, auf dem sie betrieben wird, automatisch Informationen, die Ihr
              Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, die zuvor besuchte Seite
              (Referrer), Browsertyp und -version sowie das Betriebssystem. Diese Daten sind nötig, um die Website auszuliefern,
              und dienen der Sicherheit und Stabilität des Betriebs. Eine Zusammenführung mit anderen Datenquellen findet nicht
              statt.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer technisch fehlerfreien
              und sicheren Bereitstellung der Website. Die Website wird bei einem Hosting-Dienstleister betrieben, der die Daten
              in unserem Auftrag verarbeitet (Art. 28 DSGVO). Die Logfiles werden gelöscht, sobald sie für diese Zwecke nicht
              mehr benötigt werden, es sei denn, sie werden zur Aufklärung eines Sicherheitsvorfalls gebraucht.
            </p>

            <h2>4. Verschlüsselung</h2>
            <p>
              Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
              erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.
            </p>

            <h2>5. Kontakt per Telefon, E-Mail oder WhatsApp</h2>
            <p>
              Wenn Sie uns anrufen, eine E-Mail schreiben oder eine Nachricht per WhatsApp senden, verarbeiten wir Ihre Angaben,
              etwa Name, Telefonnummer, E-Mail-Adresse und den Inhalt Ihrer Anfrage, um Ihr Anliegen zu bearbeiten.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Anfrage mit einem Vertrag zusammenhängt oder der
              Durchführung vorvertraglicher Maßnahmen dient, in allen übrigen Fällen unser berechtigtes Interesse an der
              Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Wir löschen die Daten, sobald sie für den Zweck nicht mehr
              erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen, etwa aus dem Handels- und
              Steuerrecht.
            </p>
            <p>
              Auf unserer Kontaktseite können Sie eine Nachricht vorbereiten. Das Formular speichert und übermittelt selbst
              keine Daten: Es öffnet die Nachricht in WhatsApp oder in Ihrem E-Mail-Programm, und erst wenn Sie sie dort
              abschicken, erreicht sie uns.
            </p>
            <h3>WhatsApp</h3>
            <p>
              Die WhatsApp-Schaltflächen auf dieser Website sind einfache Links. Erst wenn Sie einen solchen Link anklicken,
              öffnet sich WhatsApp mit einem vorbereiteten Nachrichtentext; gesendet wird die Nachricht nur, wenn Sie sie selbst
              abschicken. WhatsApp wird in der EU von der WhatsApp Ireland Limited angeboten. Dabei können Daten auch an die
              Muttergesellschaft Meta Platforms, Inc. in den USA übermittelt werden, die unter dem EU-US Data Privacy Framework
              zertifiziert ist. Näheres erfahren Sie in der{' '}
              <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener">Datenschutzrichtlinie von WhatsApp</a>.
              Wenn Sie WhatsApp nicht nutzen möchten, erreichen Sie uns ebenso per Telefon oder E-Mail.
            </p>

            <h2>6. Inhalte von anderen Servern</h2>
            <h3>Bilder von keramiksan.de</h3>
            <p>
              Einige Bilder dieser Website werden vom Server unserer bisherigen Website keramiksan.de geladen, die ebenfalls von
              uns betrieben wird. Damit das schneller geht, baut Ihr Browser beim Aufruf der Seiten vorab eine Verbindung zu
              diesem Server auf. Dabei wird Ihre IP-Adresse an ihn übermittelt, und es entstehen Server-Logfiles wie unter
              Punkt 3 beschrieben. Unsere Kataloge rufen wir dagegen über unseren eigenen Server von keramiksan.de ab, sodass
              Ihre IP-Adresse dabei nicht an keramiksan.de gelangt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <h3>360°-Rundgang</h3>
            <p>
              Unseren 360°-Rundgang laden wir von unserem eigenen Server. Nur in Browsern, die die dafür nötige Technik (WebGL 2)
              nicht unterstützen, binden wir nach einem Klick auf „360°-Rundgang starten“ eine Fassung des Rundgangs vom Server
              cdn2.3dwisemedia.com des Anbieters 3dwisemedia ein. Dabei wird Ihre IP-Adresse an diesen Server übermittelt.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt darin, den Rundgang auch in
              diesen Browsern zeigen zu können.
            </p>
            <h3>Schriftarten</h3>
            <p>
              Die Schriftarten dieser Website sind lokal eingebunden. Beim Aufruf der Seiten wird keine Verbindung zu Servern
              von Google oder anderen Schriftanbietern aufgebaut.
            </p>

            <h2>7. Links zu Google Maps und sozialen Netzwerken</h2>
            <p>
              Unsere Adresse und unsere Google-Bewertungen verlinken wir auf Google Maps, außerdem verlinken wir unsere Profile
              bei Instagram, Facebook und TikTok. Es handelt sich um einfache Links: Beim Besuch unserer Website werden keine
              Daten an diese Anbieter übertragen. Erst wenn Sie einen Link anklicken, gelangen Sie auf die Website des jeweiligen
              Anbieters, der Ihre Daten dann in eigener Verantwortung verarbeitet.
            </p>

            <h2>8. Google-Bewertungen</h2>
            <p>
              Die auf der Startseite gezeigten Bewertungen haben wir aus unserem Google-Unternehmensprofil übernommen und zeigen
              sie als Text an, mit dem Namen, den die Verfasserinnen und Verfasser dort öffentlich angegeben haben. Dafür wird
              keine Verbindung zu Google aufgebaut.
            </p>

            <h2>9. Ihre Rechte</h2>
            <p>
              Sie haben im Rahmen der gesetzlichen Vorgaben jederzeit das Recht auf Auskunft über Ihre bei uns gespeicherten
              Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) und Einschränkung der
              Verarbeitung (Art. 18 DSGVO) sowie auf Datenübertragbarkeit (Art. 20 DSGVO). Haben Sie in eine Verarbeitung
              eingewilligt, können Sie die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).
              Wenden Sie sich dafür einfach an die oben genannten Kontaktdaten.
            </p>
            <h3>Widerspruchsrecht</h3>
            <p>
              Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie der Verarbeitung aus Gründen,
              die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO). Wir verarbeiten die Daten
              dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen, Rechte und
              Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
              Rechtsansprüchen.
            </p>
            <h3>Beschwerderecht</h3>
            <p>
              Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Für uns zuständig ist der
              Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Hintere Bleiche 34,
              55116 Mainz.
            </p>

            <h2>10. Automatisierte Entscheidungen</h2>
            <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt.</p>

            <p className="legal__date">Stand: September 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}

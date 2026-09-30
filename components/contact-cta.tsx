/* Contact band at the end of every page (except /kontakt, which has the form already): copy and
   contact details on the left, the message form on the right, in front of a wall of large slabs. */
import { ContactForm } from '@/components/contact-form';
import { HideOn } from '@/components/hide-on';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { SplitHeading } from '@/components/motion';
import { contactFormLabels, contactTopics } from '@/lib/contact';
import { getT } from '@/lib/i18n/server';
import { SITE } from '@/lib/site';

export async function ContactCta() {
  const t = await getT();
  return (
    <HideOn paths={['/kontakt']}>
      <section className="cta-contact" id="anfrage" aria-labelledby="anfrage-title">
        <img className="cta-contact__bg" src="/assets/img/cta-tile-wall.jpg" width={2400} height={1290} alt="" loading="lazy" />
        <div className="container cta-contact__inner">
          <div className="cta-contact__intro">
            <p className="eyebrow"><span>{t('cta.eyebrow')}</span></p>
            <SplitHeading className="h2" id="anfrage-title">{t('cta.title')}</SplitHeading>
            <p>{t('cta.text')}</p>
            <ul className="cta-contact__facts">
              <li><Icon name="phone" /><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><Icon name="mail" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Icon name="pin" /><a href={SITE.maps} target="_blank" rel="noopener">{SITE.address}</a></li>
            </ul>
          </div>
          <ContactForm
            titleId="anfrage-title"
            topics={contactTopics(t)}
            privacyLink={<Link className="link" href="/datenschutz">{t('footer.privacy')}</Link>}
            labels={contactFormLabels(t)}
          />
        </div>
      </section>
    </HideOn>
  );
}

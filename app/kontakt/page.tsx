import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { FeatureIcon } from '@/components/feature-icon';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { TourLink } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';
import { SITE } from '@/lib/site';
import { idx } from '@/lib/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('contact.meta.title'), description: t('contact.meta.desc') };
}

export default async function ContactPage() {
  const t = await getT();
  const mail = `mailto:${SITE.email}`;
  const topics = [t('mega.showroomAdvice'), t('nav.tiles'), t('cat.worktops'), t('svc.planning'), t('cat.install'), t('svc.repairs'), t('contact.form.other')];

  return (
    <main id="main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('footer.contact')}</span>
          </nav>
          <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('footer.contact')}</SplitHeading>
          <p className="page-hero__intro">{t('contact.lead')}</p>
        </div>
      </section>

      {/* The four ways to reach us */}
      <section className="section contact-channels" aria-labelledby="page-title">
        <Reveal as="ul" kind="items" className="container contact-cards">
          <li className="contact-card" style={idx(0)}>
            <FeatureIcon name="chat" className="contact-card__icon" />
            <h2 className="contact-card__title">{t('contact.wa.title')}</h2>
            <p>{t('contact.wa.text')}</p>
            <WaLink topic="general" className="btn btn--dark"><Icon name="wa" /><span>{t('contact.wa.cta')}</span></WaLink>
          </li>
          <li className="contact-card" style={idx(1)}>
            <FeatureIcon name="phone" className="contact-card__icon" />
            <h2 className="contact-card__title">{t('contact.phone.title')}</h2>
            <p>{t('contact.phone.text')}</p>
            <p className="contact-card__value"><a href={SITE.phoneHref}>{SITE.phone}</a></p>
            <a className="btn btn--light" href={SITE.phoneHref}><Icon name="phone" /><span>{t('footer.call')}</span></a>
          </li>
          <li className="contact-card" style={idx(2)}>
            <FeatureIcon name="mail" className="contact-card__icon" />
            <h2 className="contact-card__title">{t('footer.email')}</h2>
            <p>{t('contact.mail.text')}</p>
            <p className="contact-card__value"><a href={mail}>{SITE.email}</a></p>
            <a className="btn btn--light" href={mail}><Icon name="mail" /><span>{t('contact.mail.cta')}</span></a>
          </li>
          <li className="contact-card" style={idx(3)}>
            <FeatureIcon name="pin" className="contact-card__icon" />
            <h2 className="contact-card__title">{t('contact.visit.title')}</h2>
            <p>{t('contact.visit.text')}</p>
            <p className="contact-card__value">{SITE.address}</p>
            <a className="btn btn--light" href={SITE.maps} target="_blank" rel="noopener"><Icon name="pin" /><span>{t('contact.route')}</span></a>
          </li>
        </Reveal>
      </section>

      {/* Showroom: address, hours, route and the 360° tour */}
      <section className="section contact-visit" aria-labelledby="visit-title">
        <div className="container">
          <Reveal kind="media" className="media-text media-text--media-first">
            <div className="media-text__media">
              <img src="/assets/img/tour/hero-360.jpg" width={2100} height={1180} alt="" loading="lazy" />
            </div>
            <div className="media-text__copy">
              <SplitHeading className="h2" id="visit-title">{t('contact.showroom.title')}</SplitHeading>
              <p>{t('contact.showroom.text')}</p>
              <dl className="contact-facts">
                <div><dt>{t('footer.address')}</dt><dd>{SITE.address}</dd></div>
                <div><dt>{t('footer.hours')}</dt><dd>{t('footer.hoursValue')}</dd></div>
              </dl>
              <div className="media-text__actions">
                <a className="btn btn--dark" href={SITE.maps} target="_blank" rel="noopener"><Icon name="pin" /><span>{t('contact.route')}</span></a>
                <TourLink className="btn btn--light"><Icon name="360" /><span>{t('showroom.cta')}</span></TourLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* A message, sent from the visitor's own WhatsApp or mail app */}
      <section className="section section--soft contact-write" aria-labelledby="form-title">
        <div className="container contact-write__inner">
          <div className="contact-write__intro">
            <SplitHeading className="h2" id="form-title">{t('contact.form.title')}</SplitHeading>
            <p>{t('contact.form.text')}</p>
          </div>
          <ContactForm
            topics={topics}
            privacyLink={<Link className="link" href="/datenschutz">{t('footer.privacy')}</Link>}
            labels={{
              name: t('contact.form.name'), optional: t('contact.form.optional'), topic: t('contact.form.topic'),
              topicLine: t('contact.form.topicLine'), message: t('contact.form.message'), hint: t('contact.form.hint'),
              wa: t('contact.form.wa'), mail: t('contact.form.mail'), greeting: t('wa.greeting'),
              subject: t('contact.form.subject'), note: t('contact.form.note'),
            }}
          />
        </div>
      </section>
    </main>
  );
}

/* What the contact form needs, shared by /kontakt and the contact band at the end of every page. */
import type { ContactFormLabels } from '@/components/contact-form';
import type { Translate } from './i18n';

export const contactTopics = (t: Translate) => [
  t('mega.showroomAdvice'), t('nav.tiles'), t('cat.worktops'), t('svc.planning'), t('cat.install'), t('svc.repairs'), t('contact.form.other'),
];

export const contactFormLabels = (t: Translate): ContactFormLabels => ({
  name: t('contact.form.name'), optional: t('contact.form.optional'), topic: t('contact.form.topic'),
  topicLine: t('contact.form.topicLine'), message: t('contact.form.message'), hint: t('contact.form.hint'),
  wa: t('contact.form.wa'), mail: t('contact.form.mail'), greeting: t('wa.greeting'),
  subject: t('contact.form.subject'), note: t('contact.form.note'),
});

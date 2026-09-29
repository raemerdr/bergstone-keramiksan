'use client';
import { useId, type FormEvent, type ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { SITE } from '@/lib/site';

export interface ContactFormLabels {
  name: string; optional: string; topic: string; topicLine: string; message: string; hint: string;
  wa: string; mail: string; greeting: string; subject: string; note: string;
}

/** Prepares a message and opens it in WhatsApp or the visitor's mail app. Nothing is stored or sent
    from here, so the site needs no form backend (see the privacy policy). */
export function ContactForm({ labels, topics, privacyLink }: { labels: ContactFormLabels; topics: string[]; privacyLink: ReactNode }) {
  const id = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();
    const [name, topic, message] = [field('name'), field('topic'), field('message')];
    if ((event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'mail') {
      const subject = `${labels.subject}: ${topic}`;
      const body = [message, name].filter(Boolean).join('\n\n');
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      const text = [labels.greeting, message, `${labels.topicLine}: ${topic}`, name].filter(Boolean).join('\n\n');
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-labelledby="form-title">
      <div className="field">
        <label htmlFor={`${id}-name`}>{labels.name} <span className="field__optional">{labels.optional}</span></label>
        <input id={`${id}-name`} name="name" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-topic`}>{labels.topic}</label>
        <select id={`${id}-topic`} name="topic">
          {topics.map((topic) => <option key={topic}>{topic}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-message`}>{labels.message}</label>
        <textarea id={`${id}-message`} name="message" rows={5} required placeholder={labels.hint} />
      </div>
      <div className="contact-form__actions">
        <button className="btn btn--dark" type="submit" value="wa"><Icon name="wa" /><span>{labels.wa}</span></button>
        <button className="btn btn--light" type="submit" value="mail"><Icon name="mail" /><span>{labels.mail}</span></button>
      </div>
      <p className="contact-form__note">{labels.note} {privacyLink}</p>
    </form>
  );
}

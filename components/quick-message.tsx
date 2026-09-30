'use client';
/* Footer: a one-line message that opens in the visitor's WhatsApp, ready to send. Like the contact form,
   nothing is stored or sent from here, so it needs no backend. */
import { useId, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { SITE } from '@/lib/site';

export function QuickMessage({ label, send, greeting, lang }: { label: string; send: string; greeting: string; lang: string }) {
  const id = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = String(new FormData(event.currentTarget).get('message') ?? '').trim();
    if (!message) return;
    const text = [greeting, message, lang].join('\n\n');
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  return (
    <form className="quick-message" onSubmit={submit}>
      <label className="visually-hidden" htmlFor={`${id}-message`}>{label}</label>
      <input id={`${id}-message`} name="message" placeholder={label} required autoComplete="off" />
      <button type="submit" aria-label={send}><Icon name="arrow" /></button>
    </form>
  );
}

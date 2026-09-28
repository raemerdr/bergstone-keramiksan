'use client';
import type { AnchorHTMLAttributes } from 'react';
import { useT } from '@/components/i18n';
import { whatsAppUrl, type WaTopic } from '@/lib/whatsapp';

/** WhatsApp chat with a starter message for the topic, in the visitor's language. */
export function WaLink({ topic, product, children, ...props }: { topic: WaTopic; product?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const t = useT();
  return (
    <a href={whatsAppUrl(t, topic, { product })} target="_blank" rel="noopener" data-wa={topic} {...props}>
      {children}
    </a>
  );
}

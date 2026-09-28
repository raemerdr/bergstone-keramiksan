import type { MessageKey, Translate } from './i18n';
import { SITE } from './site';

export type WaTopic =
  | 'general' | 'consult' | 'kitchen' | 'worktop' | 'product' | 'stone'
  | 'pro' | 'planning' | 'delivery' | 'install' | 'repair' | 'catalog';

type WaKey = Extract<MessageKey, `wa.${string}`>;

/** wa.me deep link with a starter message in the visitor's language. */
export function whatsAppUrl(t: Translate<WaKey>, topic: WaTopic, vars: { product?: string } = {}) {
  let body = t(`wa.${topic}`);
  if (topic === 'product' || topic === 'stone') body = body.replace('{product}', () => vars.product ?? '');
  const message = [t('wa.greeting'), body, t('wa.location'), t('wa.lang')].join('\n');
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

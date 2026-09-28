'use client';
import { createContext, use, useMemo, type ReactNode } from 'react';
import type { ClientKey, ClientMessages, Lang, Translate } from '@/lib/i18n';

const I18nContext = createContext<{ lang: Lang; t: Translate<ClientKey> } | null>(null);

/** Hands the runtime strings (lib/i18n `clientMessages`) to Client Components. */
export function I18nProvider({ lang, messages, children }: { lang: Lang; messages: ClientMessages; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: (key: ClientKey) => messages[key] }), [lang, messages]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

function useI18n() {
  const context = use(I18nContext);
  if (!context) throw new Error('I18nProvider is missing');
  return context;
}

export const useT = () => useI18n().t;
export const useLang = () => useI18n().lang;

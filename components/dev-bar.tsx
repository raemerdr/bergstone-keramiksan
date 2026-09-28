'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons';
import { useLang } from '@/components/i18n';
import { LANG_COOKIE, type Lang } from '@/lib/i18n';

const LANGS: { lang: Lang; label: string; title: string }[] = [
  { lang: 'de', label: 'DE', title: 'Deutsch' },
  { lang: 'en', label: 'EN', title: 'English' },
];

function saveLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

/** Floating DE/EN switch, rendered by `next dev` only (see lib/i18n/server.ts). */
export function DevBar({ label }: { label: string }) {
  const router = useRouter();
  const current = useLang();
  const choose = (lang: Lang) => {
    if (lang === current) return;
    saveLang(lang);
    router.refresh();
  };
  return (
    <div className="devbar" role="group" aria-label={label}>
      <span className="devbar__tag"><Icon name="tile" />DEV</span>
      {LANGS.map(({ lang, label: text, title }) => (
        <button key={lang} type="button" aria-pressed={lang === current} lang={lang} title={title} onClick={() => choose(lang)}>{text}</button>
      ))}
    </div>
  );
}

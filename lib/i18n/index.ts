/* Bergstone Keramiksan — translations.
   German is the only public language. English is a development aid: the DEV switch sets a cookie
   that only `next dev` reads (lib/i18n/server.ts), so production pages stay static and German.
   To add Turkish later: add tr.ts with the same keys and a 'tr' entry below. */
import { de } from './de';
import { en } from './en';

export type Lang = 'de' | 'en';
export type MessageKey = keyof typeof de;
export type Messages = Record<MessageKey, string>;
export type Translate<K extends string = MessageKey> = (key: K) => string;

export const LANG_COOKIE = 'bk-lang';

const dictionaries: Record<Lang, Messages> = { de, en };

export function translator(lang: Lang): Translate {
  const dict = dictionaries[lang];
  return (key) => dict[key];
}

/* Strings Client Components build at runtime (WhatsApp starters, wishlist, tile listing, 360° tour).
   Everything else is rendered on the server and never shipped as a dictionary. */
const CLIENT_PREFIXES = ['wa.', 'save.', 'saved.', 'finish.', 'tile.', 'tiles.count', 'tour.', 'pano.', 'room.'] as const;
export type ClientKey = Extract<MessageKey, `${(typeof CLIENT_PREFIXES)[number]}${string}`>;
export type ClientMessages = Record<ClientKey, string>;

export function clientMessages(lang: Lang): ClientMessages {
  const entries = Object.entries(dictionaries[lang]).filter(([key]) => CLIENT_PREFIXES.some((p) => key.startsWith(p)));
  return Object.fromEntries(entries) as ClientMessages;
}

/** Split a translation that carries line breaks ("Neuer Name.<br>Gleiche Adresse."). */
export const lines = (text: string) => text.split(/<br\s*\/?>/);

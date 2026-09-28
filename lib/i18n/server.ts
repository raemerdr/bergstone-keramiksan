import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { LANG_COOKIE, translator, type Lang } from '.';

/** German everywhere; `next dev` also honours the DEV switch cookie. The check is compiled out of
    production builds, so no page reads request data and every route is prerendered. */
export const getLang = cache(async (): Promise<Lang> => {
  if (process.env.NODE_ENV !== 'development') return 'de';
  return (await cookies()).get(LANG_COOKIE)?.value === 'en' ? 'en' : 'de';
});

export async function getT() {
  return translator(await getLang());
}

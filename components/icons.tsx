import type { SVGProps } from 'react';

export type IconName =
  | 'chevron' | 'prev' | 'next' | 'phone' | 'wa' | 'heart' | 'menu' | 'close' | 'instagram' | 'facebook' | 'tiktok'
  | 'download' | 'pin' | 'mail' | '360' | 'plus' | 'minus' | 'grid' | 'expand' | 'shrink' | 'tile';

/** `<svg><use href="#i-…"/></svg>` — sized by the surrounding CSS. */
export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return <svg {...props}><use href={`#i-${name}`} /></svg>;
}

/** Icon sprite, rendered once at the top of <body>. */
export function Sprite() {
  return (
    <svg className="sprite" aria-hidden="true" focusable="false">
      <symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      <symbol id="i-prev" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      <symbol id="i-next" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M21 16.4v2.9a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.1 4.3 1.9 1.9 0 0 1 4 2.2h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L7.8 9.7a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.6 1.9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
      <symbol id="i-wa" viewBox="0 0 24 24"><path d="M3.6 20.4l1.3-4.1a8.6 8.6 0 1 1 3.2 3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9.1 7.9c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1 1.5 1.9 2.5 2.5.2.1.4.1.5 0l.6-.5c.2-.2.4-.2.6-.1l1.7.7c.2.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.6.3-1.3.4-2 .2-1.6-.4-3.6-2.2-4.4-3.6-.5-.9-.7-2-.4-3z" fill="currentColor"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.4 4.8a5.3 5.3 0 0 0-7.5 0L12 5.7l-.9-.9a5.3 5.3 0 0 0-7.5 7.5l.9.9L12 20.7l7.5-7.5.9-.9a5.3 5.3 0 0 0 0-7.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6.5h18M3 12h18M3 17.5h18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
      <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></symbol>
      <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M14.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.8v3h2.6V21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
      <symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M14 3.5c.4 2.3 1.9 3.9 4.5 4.2v2.9a7.4 7.4 0 0 1-4.4-1.4v5.6a5.4 5.4 0 1 1-5.4-5.4v3a2.4 2.4 0 1 0 2.4 2.4V3.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
      <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M4.5 19.5h15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
      <symbol id="i-360" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9.5" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M15.2 5.6L12 3.5m3.2 2.1L12.6 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></symbol>
      <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></symbol>
      <symbol id="i-grid" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></g></symbol>
      <symbol id="i-expand" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      <symbol id="i-shrink" viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
      {/* Four-diamond glyph from the Bergstone monogram */}
      <symbol id="i-tile" viewBox="0 0 24 24"><path d="M12 1.8l3.9 3.9L12 9.6 8.1 5.7zM5.7 8.1l3.9 3.9-3.9 3.9L1.8 12zM18.3 8.1l3.9 3.9-3.9 3.9-3.9-3.9zM12 14.4l3.9 3.9-3.9 3.9-3.9-3.9z" fill="currentColor"/></symbol>
    </svg>
  );
}

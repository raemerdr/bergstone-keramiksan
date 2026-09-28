'use client';
import NextLink from 'next/link';
import { useState, type ComponentProps } from 'react';

/** next/link that prefetches on intent (hover, focus, touch) instead of whenever it scrolls into view.
    A prefetched page brings its above-the-fold images along (React preloads every eager <img> of a Server
    Component), and the header menu alone links to every page, so viewport prefetching would download
    all the hero images on every visit. */
export function Link({ onMouseEnter, onFocus, onTouchStart, ...props }: ComponentProps<typeof NextLink>) {
  const [intent, setIntent] = useState(false);
  return (
    <NextLink
      prefetch={intent ? null : false}
      onMouseEnter={(e) => { setIntent(true); onMouseEnter?.(e); }}
      onFocus={(e) => { setIntent(true); onFocus?.(e); }}
      onTouchStart={(e) => { setIntent(true); onTouchStart?.(e); }}
      {...props}
    />
  );
}

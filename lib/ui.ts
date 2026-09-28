import type { CSSProperties } from 'react';

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');

/** Stagger index for the CSS entrance transitions (`--i`). */
export const idx = (i: number) => ({ '--i': i }) as CSSProperties;

/** Counter for hand-written lists: `const i = stagger();` then `style={i()}` on each item in order. */
export function stagger() {
  let n = 0;
  return () => idx(n++);
}

/** Crop focus for cover images (`--pos`). */
export const pos = (value: string) => ({ '--pos': value }) as CSSProperties;

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Renders its children everywhere except on the given paths. */
export function HideOn({ paths, children }: { paths: string[]; children: ReactNode }) {
  return paths.includes(usePathname()) ? null : children;
}

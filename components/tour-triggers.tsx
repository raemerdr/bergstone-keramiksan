'use client';
/* Everything that opens the 360° showroom. On the homepage the hero registers itself here and the tour
   starts in place; on other pages the links simply go to /#360, where the hero picks the hash up. */
import { createContext, use, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode, type RefObject } from 'react';
import { Link } from '@/components/link';

export interface TourControl {
  start(trigger: HTMLElement): void;
  /** Warm-up on intent: load the viewer and the first room before the click. */
  warm(): void;
}

const TourContext = createContext<RefObject<TourControl | null> | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const control = useRef<TourControl | null>(null);
  return <TourContext value={control}>{children}</TourContext>;
}

export function useTourRef() {
  const ref = use(TourContext);
  if (!ref) throw new Error('TourProvider is missing');
  return ref;
}

function useTrigger() {
  const tourRef = useTourRef();
  const warmed = useRef(false);
  const warm = () => {
    if (warmed.current || !tourRef.current) return;
    warmed.current = true;
    tourRef.current.warm();
  };
  const start = (e: MouseEvent<HTMLElement>) => {
    if (!tourRef.current) return;
    e.preventDefault();
    tourRef.current.start(e.currentTarget);
  };
  return { warm, start };
}

export function TourButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { warm, start } = useTrigger();
  return (
    <button type="button" data-tour-start {...props} onClick={start} onPointerEnter={warm} onFocus={warm}>
      {children}
    </button>
  );
}

export function TourLink({ children, ...props }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { warm, start } = useTrigger();
  return (
    <Link href="/#360" data-tour-start {...props} onClick={start} onPointerEnter={warm} onFocus={warm}>
      {children}
    </Link>
  );
}

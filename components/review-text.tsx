'use client';
import { useLayoutEffect, useRef, useState } from 'react';

/** A review's text, clamped to a few lines (CSS) with a toggle when there is more. */
export function ReviewText({ children, more, less }: { children: string; more: string; less: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [long, setLong] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setLong(el.scrollHeight > el.clientHeight + 1);
  }, []);

  return (
    <>
      <p ref={ref} className="review__text" data-open={open || undefined}>{children}</p>
      {long && (
        <button className="review__more" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? less : more}
        </button>
      )}
    </>
  );
}

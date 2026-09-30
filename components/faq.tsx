'use client';
/* Questions that open to their answers: homepage and service pages. Native <details>, so they work
   without script; with script the answer slides open and shut, and the cards rise in as the list
   scrolls into view. */
import type { MouseEvent } from 'react';
import { Icon } from '@/components/icons';
import { Reveal } from '@/components/motion';
import { idx, prefersReducedMotion } from '@/lib/ui';

const EASE = 'cubic-bezier(.22, 1, .36, 1)';

function toggle(event: MouseEvent<HTMLElement>) {
  const details = event.currentTarget.parentElement;
  const answer = details?.querySelector<HTMLElement>('.faq__a');
  if (!(details instanceof HTMLDetailsElement) || !answer || prefersReducedMotion()) return;   // plain toggle
  event.preventDefault();
  // Start from where the answer is now, also when a slide is still running
  const from = details.open ? answer.getBoundingClientRect().height : 0;
  answer.getAnimations().forEach((animation) => animation.cancel());
  if (details.open && details.dataset.state !== 'closing') {
    details.dataset.state = 'closing';
    const slide = answer.animate({ height: [`${from}px`, '0px'], opacity: [1, 0] }, { duration: 320, easing: EASE });
    slide.onfinish = () => { details.open = false; delete details.dataset.state; };
  } else {
    delete details.dataset.state;
    details.open = true;
    answer.animate({ height: [`${from}px`, `${answer.scrollHeight}px`], opacity: [from ? 1 : 0, 1] }, { duration: 460, easing: EASE });
  }
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Reveal kind="items" className="faq">
      {items.map(({ q, a }, i) => (
        <details key={q} className="faq__item" style={idx(i)}>
          <summary onClick={toggle}><span>{q}</span><span className="faq__toggle" aria-hidden="true"><Icon name="chevron" /></span></summary>
          <div className="faq__a"><p>{a}</p></div>
        </details>
      ))}
    </Reveal>
  );
}

'use client';
/* Smooth, eased wheel scrolling (Lenis). The page still scrolls natively underneath, so the sticky header,
   the IntersectionObservers and anchor links keep working. Touch keeps the device's own momentum, and
   visitors who ask for reduced motion get plain scrolling (Lenis honours the setting).
   Horizontal rows (carousels, filter chips, the tour's room list) carry `data-lenis-prevent-horizontal`,
   so sideways swipes still move them. */
import Lenis from 'lenis';
import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      // A click through to another page drops any glide still running
      stopInertiaOnNavigate: true,
      // The drawers and the message field scroll on their own
      prevent: (node) => node.nodeName === 'DIALOG' || node.nodeName === 'TEXTAREA',
      // Leave wheel events that part of the page has taken (the 360° viewer zooms on ⌘/Ctrl + wheel)
      virtualScroll: ({ event }) => !event.defaultPrevented,
    });

    // An open drawer locks the page (html.is-locked): pause until it closes
    const html = document.documentElement;
    let locked = false;
    const observer = new MutationObserver(() => {
      const now = html.classList.contains('is-locked');
      if (now === locked) return;
      locked = now;
      if (now) lenis.stop();
      else lenis.start();
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}

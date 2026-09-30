'use client';
/* Scroll reveals and line-by-line headline entrances.
   The CSS only hides content while <html> has `.js` (set by the boot script in app/layout.tsx), and that
   script drops `.js` again if the app never reports `is-ready`, so content stays visible without JS.
   Everything waits for the web fonts, so headline line breaks are measured with the final typography. */
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type RefObject } from 'react';
import { cx, idx } from '@/lib/ui';

let ready: Promise<void> | undefined;

/** Resolves once the web fonts have settled (at most 1.5 s). */
export function whenReady() {
  ready ??= document.fonts
    ? Promise.race([document.fonts.ready.then(() => {}), new Promise<void>((resolve) => setTimeout(resolve, 1500))])
    : Promise.resolve();
  return ready;
}

let observer: IntersectionObserver | undefined;
const onEnter = new WeakMap<Element, () => void>();

function observeOnce(el: Element, callback: () => void) {
  observer ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer?.unobserve(entry.target);
      onEnter.get(entry.target)?.();
      onEnter.delete(entry.target);
    });
  }, { rootMargin: '0px 0px -50px 0px' });
  onEnter.set(el, callback);
  observer.observe(el);
  return () => { observer?.unobserve(el); onEnter.delete(el); };
}

/** True once the element has scrolled into view (after the fonts are ready). */
export function useReveal(ref: RefObject<Element | null>, enabled = true) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || inView || !el) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    whenReady().then(() => { if (!cancelled) stop = observeOnce(el, () => setInView(true)); });
    return () => { cancelled = true; stop?.(); };
  }, [ref, enabled, inView]);
  return inView;
}

type RevealKind = 'items' | 'fade' | 'media';

/** `data-reveal` group: `items` staggers its children (give each child `style={idx(i)}`). */
export function Reveal({ as: Tag = 'div', kind, className, ...props }: { as?: 'div' | 'ul' | 'ol' | 'p'; kind: RevealKind } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const inView = useReveal(ref);
  return <Tag ref={ref as never} data-reveal={kind} className={cx(className, inView && 'is-in')} {...props} />;
}

interface SplitHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3';
  children: string;
  /** Controls the entrance from outside (the hero) instead of on scroll. */
  revealed?: boolean;
  /** Bump to replay the entrance. */
  replay?: number;
}

type Split = { phase: 'plain' } | { phase: 'measure' } | { phase: 'split'; lines: number[][]; text: string };   // word indices per line of that text

/** A headline's words. `*…*` around some of them marks an accent, set in italic; the asterisks are not shown. */
function parseWords(text: string) {
  let accent = false;
  return text.split(/[ \t\n\r]+/).filter(Boolean).map((raw) => {   // no-break spaces keep words together
    let word = raw;
    if (word.startsWith('*')) { accent = true; word = word.slice(1); }
    const closes = word.endsWith('*');
    if (closes) word = word.slice(0, -1);
    const item = { word, accent };
    if (closes) accent = false;
    return item;
  });
}

function Words({ words, only }: { words: ReturnType<typeof parseWords>; only?: number[] }) {
  return (only ?? words.map((_, i) => i)).map((w, j) => (
    <Fragment key={w}>{j > 0 && ' '}{words[w].accent ? <em>{words[w].word}</em> : words[w].word}</Fragment>
  ));
}

/** Headline whose lines rise into place one after another (`[data-split]` in the CSS). */
export function SplitHeading({ as: Tag = 'h2', className, children: text, revealed, replay = 0, ...props }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [split, setSplit] = useState<Split>({ phase: 'plain' });
  const [armed, setArmed] = useState(false);
  const inView = useReveal(ref, revealed === undefined && split.phase === 'split');
  const shown = armed && (revealed ?? inView);

  // Split once the fonts are in, and again whenever the text or the viewport width changes
  useEffect(() => {
    let live = true;
    whenReady().then(() => { if (live) setSplit({ phase: 'measure' }); });
    return () => { live = false; };
  }, [text]);

  useEffect(() => {
    let lastWidth = innerWidth;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (innerWidth === lastWidth) return;
        lastWidth = innerWidth;
        setSplit((s) => (s.phase === 'split' ? { phase: 'measure' } : s));
      }, 180);
    };
    addEventListener('resize', onResize);
    return () => { removeEventListener('resize', onResize); clearTimeout(timer); };
  }, []);

  // Measure pass (never painted): group the rendered words by line
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || split.phase !== 'measure') return;
    const rows: number[][] = [];
    let lastTop: number | null = null;
    el.querySelectorAll<HTMLElement>('.w').forEach((w, i) => {
      if (lastTop === null || w.offsetTop - lastTop > 2) { rows.push([]); lastTop = w.offsetTop; }
      rows[rows.length - 1].push(i);
    });
    setSplit({ phase: 'split', lines: rows, text });
  }, [split, text]);

  // Lay the lines out hidden once before `is-in` can apply, so the entrance always transitions
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || armed || split.phase !== 'split') return;
    void el.offsetWidth;
    setArmed(true);
  }, [split, armed]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !replay) return;
    el.classList.remove('is-in');
    void el.offsetWidth;   // restart the transition
    el.classList.add('is-in');
  }, [replay]);

  const words = parseWords(text);
  // Lines measured for other words (the language changed) show as plain text until these are measured
  const layout: Split = split.phase === 'split' && split.text !== text ? { phase: 'plain' } : split;

  return (
    <Tag ref={ref} data-split className={cx(className, layout.phase !== 'plain' && 'is-split', shown && 'is-in')} {...props}>
      {layout.phase === 'plain' ? <Words words={words} /> : (
        <>
          <span className="visually-hidden">{text.replaceAll('*', '')}</span>
          {layout.phase === 'measure' ? (
            <span aria-hidden="true" className="split-measure">
              {words.map(({ word, accent }, i) => <Fragment key={i}>{i > 0 && ' '}<span className="w">{accent ? <em>{word}</em> : word}</span></Fragment>)}
            </span>
          ) : (
            <span aria-hidden="true">
              {layout.lines.map((line, i) => <span key={i} className="split-line" style={idx(i)}><span><Words words={words} only={line} /></span></span>)}
            </span>
          )}
        </>
      )}
    </Tag>
  );
}

/** Marks the app as booted (cancels the boot script's failsafe). */
export function Boot() {
  // In development, Strict Mode's remount resets <html> to its JSX attributes; restore the boot script's class
  useLayoutEffect(() => {
    if (process.env.NODE_ENV === 'development') document.documentElement.classList.add('js');
  }, []);
  useEffect(() => {
    whenReady().then(() => document.documentElement.classList.add('is-ready'));
  }, []);
  return null;
}

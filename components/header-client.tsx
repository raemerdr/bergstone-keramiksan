'use client';
import { usePathname } from 'next/navigation';
import { createContext, use, useEffect, useRef, useState, type ComponentProps, type Dispatch, type MouseEvent, type ReactNode, type SetStateAction } from 'react';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { cx } from '@/lib/ui';

const MegaContext = createContext<{ openId: string | null; setOpenId: Dispatch<SetStateAction<string | null>> } | null>(null);

/** Sticky header: hides on scroll down, returns on scroll up (unless a mega menu is open). */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const megaOpen = useRef(false);

  useEffect(() => { megaOpen.current = openId !== null; }, [openId]);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastY = scrollY;
    let ticking = false;
    const update = () => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 50);
      if (y > lastY + 4 && y > 420 && !megaOpen.current) header.classList.add('is-hidden');
      else if (y < lastY - 4) header.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <MegaContext value={{ openId, setOpenId }}>
      <header ref={ref} className="header" onFocus={() => ref.current?.classList.remove('is-hidden')}>
        {children}
      </header>
    </MegaContext>
  );
}

/** Top-level nav item with a mega menu: opens on hover (with intent delays), click and keyboard. */
export function MegaItem({ id, label, compact, children }: { id: string; label: string; compact?: boolean; children: ReactNode }) {
  const context = use(MegaContext);
  if (!context) throw new Error('MegaItem must be inside HeaderShell');
  const { openId, setOpenId } = context;
  const open = openId === id;
  const ref = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();
  const [current, setCurrent] = useState(false);

  const show = () => setOpenId(id);
  const hide = () => setOpenId((current) => (current === id ? null : current));
  const canHover = () => matchMedia('(hover: hover)').matches;

  // Underline the item when the current page is one of its links
  useEffect(() => {
    setCurrent(!!ref.current?.querySelector('a[aria-current="page"]'));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenId(null);
      button.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpenId]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onMega = (e: MouseEvent) => {
    if ((e.target as Element).closest('a, button')) setOpenId(null);
  };

  return (
    <li
      ref={ref}
      className={cx('nav__item', open && 'is-open', current && 'is-current')}
      onMouseEnter={() => { if (!canHover()) return; clearTimeout(timer.current); timer.current = setTimeout(show, 70); }}
      onMouseLeave={() => { if (!canHover()) return; clearTimeout(timer.current); timer.current = setTimeout(hide, 160); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) hide(); }}
    >
      <button ref={button} className="nav__link" type="button" aria-expanded={open} aria-controls={`mega-${id}`} onClick={open ? hide : show}>
        <span>{label}</span><Icon name="chevron" className="nav__chev" />
      </button>
      <div className={cx('mega', compact && 'mega--compact')} id={`mega-${id}`} onClick={onMega}>
        <div className="mega__inner">{children}</div>
      </div>
    </li>
  );
}

/** Internal link that marks itself as the current page (plain paths only, like the static site did). */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const current = href !== '/' && !/[?#]/.test(href) && href === pathname;
  return <Link href={href} aria-current={current ? 'page' : undefined} {...props} />;
}

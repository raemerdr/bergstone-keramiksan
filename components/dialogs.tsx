'use client';
/* Drawers (catalogues, wishlist, mobile menu): native <dialog> + showModal, slide-in via `.is-open`. */
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type DialogHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx, prefersReducedMotion } from '@/lib/ui';

export type DialogId = 'catalogs' | 'saved' | 'menu';

interface DrawerHandle {
  element(): HTMLDialogElement | null;
  open(returnFocus: HTMLElement | null): void;
  close(instant?: boolean): void;
}

interface DialogApi {
  register(id: DialogId, handle: DrawerHandle): () => void;
  open(id: DialogId, opener: HTMLElement): void;
}

const DialogContext = createContext<DialogApi | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const drawers = useRef(new Map<DialogId, DrawerHandle>());
  const api = useMemo<DialogApi>(() => ({
    register(id, handle) {
      drawers.current.set(id, handle);
      return () => { if (drawers.current.get(id) === handle) drawers.current.delete(id); };
    },
    open(id, opener) {
      const target = drawers.current.get(id);
      if (!target || target.element()?.open) return;
      // Opened from inside another drawer (e.g. "Kataloge" in the menu): swap instead of stacking
      const parent = [...drawers.current.values()].find((handle) => handle !== target && handle.element()?.open && handle.element()?.contains(opener));
      parent?.close(true);
      target.open(parent ? null : opener);
    },
  }), []);
  return <DialogContext value={api}>{children}</DialogContext>;
}

function useDialogs() {
  const api = use(DialogContext);
  if (!api) throw new Error('DialogProvider is missing');
  return api;
}

export function DialogTrigger({ dialog, children, ...props }: { dialog: DialogId } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useDialogs();
  return <button type="button" {...props} onClick={(e) => open(dialog, e.currentTarget)}>{children}</button>;
}

/** Children are the scrim (`data-close`) and the panel (`data-panel`) with its own close buttons. */
export function Drawer({ id, className, children, ...props }: { id: DialogId } & DialogHTMLAttributes<HTMLDialogElement>) {
  const { register } = useDialogs();
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback((instant = false) => {
    const dialog = ref.current;
    if (!dialog?.open || closing.current) return;
    const finish = () => {
      closing.current = false;
      dialog.close();
      if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('is-locked');
      const target = returnFocus.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
    setIsOpen(false);
    if (instant || prefersReducedMotion()) { finish(); return; }

    closing.current = true;
    const panel = dialog.querySelector('[data-panel]');
    let done = false;
    const onEnd = (e?: Event) => {
      if (e && e.target !== panel) return;
      if (done) return;
      done = true;
      panel?.removeEventListener('transitionend', onEnd);
      finish();
    };
    panel?.addEventListener('transitionend', onEnd);
    setTimeout(onEnd, 650);
  }, []);

  useEffect(() => register(id, {
    element: () => ref.current,
    open(target) {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      returnFocus.current = target;
      dialog.showModal();
      document.documentElement.classList.add('is-locked');
      requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
    },
    close,
  }), [id, register, close]);

  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    const target = e.target as Element;
    if (target.closest('[data-close]')) { close(); return; }
    // Links inside a drawer: close it first so the page can scroll or navigate
    if (target.closest('a[href]:not([data-wa]):not([target="_blank"])')) close(true);
  };

  return (
    <dialog
      ref={ref}
      id={id}
      className={cx('drawer', className, isOpen && 'is-open')}
      onClick={onClick}
      onCancel={(e) => { e.preventDefault(); close(); }}
      {...props}
    >
      {children}
    </dialog>
  );
}

'use client';
/* Wishlist (Merkliste) UI: hearts on the tile cards, the header counter and the drawer contents. */
import { useLayoutEffect, useRef } from 'react';
import { Icon } from '@/components/icons';
import { useT } from '@/components/i18n';
import { tileById, tilePhoto, tileSize } from '@/lib/tiles';
import { idx } from '@/lib/ui';
import { whatsAppUrl } from '@/lib/whatsapp';
import { toggleSaved, useSaved, useSavedToggles } from '@/lib/wishlist';

/** Restart a one-shot CSS animation class. */
function replay(el: Element, className: string) {
  el.classList.remove(className);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
}

export function HeartButton({ id, name }: { id: string; name: string }) {
  const t = useT();
  const on = useSaved().includes(id);
  return (
    <button
      className="heart"
      type="button"
      aria-pressed={on}
      aria-label={`${t(on ? 'save.remove' : 'save.add')}: ${name}`}
      onClick={(e) => { toggleSaved(id); replay(e.currentTarget, 'is-pop'); }}
    >
      <Icon name="heart" />
    </button>
  );
}

export function SavedCount() {
  const count = useSaved().length;
  const toggles = useSavedToggles();
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (toggles && ref.current) replay(ref.current, 'is-bump');
  }, [toggles]);
  return <span ref={ref} className="icon-btn__count" hidden={count === 0}>{count}</span>;
}

/** Drawer body: the saved tiles, or a hint while the list is empty. */
export function SavedList() {
  const t = useT();
  const saved = useSaved();
  return (
    <>
      <p className="drawer__intro" hidden={saved.length > 0}>{t('saved.empty')}</p>
      <ul className="saved-list">
        {saved.map((id, i) => {
          const tile = tileById.get(id);
          if (!tile) return null;
          return (
            <li key={id} style={idx(i)}>
              <span className="saved-list__thumb"><img src={tilePhoto(tile.img)} alt="" /></span>
              <span>
                <strong>{tile.name}</strong>
                <span>{`${tileSize(tile)} · ${t(`finish.${tile.finish}`)}`}</span>
              </span>
              <button type="button" aria-label={`${t('saved.removeItem')}: ${tile.name}`} onClick={() => toggleSaved(id)}>
                <Icon name="close" />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Sends the whole list to WhatsApp. */
export function SavedSend() {
  const t = useT();
  const saved = useSaved();
  const names = saved.map((id) => tileById.get(id)?.name ?? id);
  return (
    <a
      className="btn btn--dark btn--block"
      href={whatsAppUrl(t, 'saved', { list: names })}
      target="_blank"
      rel="noopener"
      data-wa="saved"
      data-saved-send
      aria-disabled={saved.length === 0}
    >
      <Icon name="wa" /><span>{t('saved.send')}</span>
    </a>
  );
}

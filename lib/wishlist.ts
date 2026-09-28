/* Wishlist (Merkliste): tile ids in this browser's localStorage. A per-viewer convenience —
   every read/write may fail (private mode, blocked storage), and the server always renders it empty. */
import { useSyncExternalStore } from 'react';
import { tileById } from './tiles';

const KEY = 'bk-saved';
const EMPTY: readonly string[] = [];

let saved: readonly string[] | null = null;
let toggles = 0;
const listeners = new Set<() => void>();

function read(): readonly string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && tileById.has(id)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

const snapshot = () => (saved ??= read());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useSaved() {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

/** Counts user toggles (not the initial load) — drives the header counter's bump. */
export function useSavedToggles() {
  return useSyncExternalStore(subscribe, () => toggles, () => 0);
}

export function toggleSaved(id: string) {
  const current = snapshot();
  saved = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  toggles++;
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
  listeners.forEach((fn) => fn());
}

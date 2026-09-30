/* Line icons for the /fliesen type boxes, one per room the tiles are made for. Drawn by hand on a
   48 × 48 grid; the parts carry classes the CSS animates while a box is hovered or selected. */
import type { ReactNode } from 'react';
import type { TileFilter } from '@/lib/tiles';

const DRAWINGS: Record<TileFilter, ReactNode> = {
  // All tiles: four tiles, laid one after the other
  alle: (
    <>
      <rect className="ki-pop" x="8" y="8" width="14" height="14" rx="1.5" />
      <rect className="ki-pop" x="26" y="8" width="14" height="14" rx="1.5" />
      <rect className="ki-pop" x="8" y="26" width="14" height="14" rx="1.5" />
      <rect className="ki-pop" x="26" y="26" width="14" height="14" rx="1.5" />
    </>
  ),
  // Wall tiles: a shower on a tiled bathroom wall, water falling
  wandfliesen: (
    <>
      <path d="M34 8h8v34h-8zM34 19h8M34 30h8" />
      <path d="M8 42V13a5 5 0 0 1 5-5h9v4" />
      <path d="M15 18a7 6 0 0 1 14 0z" />
      <path className="ki-drop" d="M17.5 22.5v3" />
      <path className="ki-drop" d="M22 22.5v3" />
      <path className="ki-drop" d="M26.5 22.5v3" />
    </>
  ),
  // Floor tiles: a sofa on a tiled floor, the joints laid in turn
  bodenfliesen: (
    <>
      <path d="M13 21v-4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v4" />
      <path d="M9 28v-5a2.5 2.5 0 0 1 5 0v1.5h20V23a2.5 2.5 0 0 1 5 0v5z" />
      <path d="M12 28v2M36 28v2" />
      <path className="ki-lay" pathLength="1" d="M6 34h36" />
      <path className="ki-lay" pathLength="1" d="M4 38.5h40" />
      <path className="ki-lay" pathLength="1" d="M2 43h44" />
      <path className="ki-lay" pathLength="1" d="M15 34l-5 9" />
      <path className="ki-lay" pathLength="1" d="M24 34v9" />
      <path className="ki-lay" pathLength="1" d="M33 34l5 9" />
    </>
  ),
  // Large formats: one big slab, the corners pushing outwards
  grossformate: (
    <>
      <rect className="ki-grow" x="14" y="14" width="20" height="20" rx="1.5" />
      <path className="ki-corner ki-corner--tl" d="M6 13V6h7" />
      <path className="ki-corner ki-corner--tr" d="M35 6h7v7" />
      <path className="ki-corner ki-corner--br" d="M42 35v7h-7" />
      <path className="ki-corner ki-corner--bl" d="M13 42H6v-7" />
    </>
  ),
  // Stone slabs: a tall slab on its rail, the vein running through it
  steinplatten: (
    <>
      <path d="M31 9h5v31" />
      <rect x="12" y="5" width="19" height="35" rx="1" />
      <path className="ki-vein" pathLength="1" d="M15 11c5 2 3 7 8 9s2 6 5 8 0 6 2 9" />
      <path d="M6 43h36" />
    </>
  ),
  // Kitchen: a tap over the worktop, a drop falling
  kueche: (
    <>
      <path d="M17 26V14a6 6 0 0 1 12 0v3" />
      <path d="M14 26h6" />
      <path className="ki-drip" d="M29 20.5c-1 1.3-1.5 2.2-1.5 2.9a1.5 1.5 0 0 0 3 0c0-.7-.5-1.6-1.5-2.9z" />
      <path d="M5 30h38" />
      <path d="M8 30v12h32V30M24 30v12M20 36h1M27 36h1" />
    </>
  ),
};

export function TileKindIcon({ kind, className }: { kind: TileFilter; className?: string }) {
  return (
    <svg className={className} data-kind={kind} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {DRAWINGS[kind]}
    </svg>
  );
}

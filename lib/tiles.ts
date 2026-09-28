/* Bergstone Keramiksan: tile catalogue.
   Names, formats, finishes and face counts were read from the product labels on the client's
   tile photos (current site, /fliesen/). Two duplicate photos were dropped (Sivas Silver, Cristela Crema).
   `kinds` drives the filters on /fliesen and is PROVISIONAL until the product list arrives:
     wandfliesen  = glossy, high-gloss or carving finish
     bodenfliesen = matt or carving finish, or a square format
     grossformate = longest side ≥ 100 cm
     steinplatten = none yet (the 8 slabs are still to come)
     kueche       = natural stone slabs for kitchen worktops (WORKTOPS below; not part of "alle")
   finish: matt | glossy | highgloss | carving | polished   ·   size: [width, height] in cm, null when cut to size */
import type { MessageKey } from './i18n';

export type Finish = 'matt' | 'glossy' | 'highgloss' | 'carving' | 'polished';
export type TileKind = 'wandfliesen' | 'bodenfliesen' | 'grossformate' | 'steinplatten' | 'kueche';
export type TileFilter = 'alle' | TileKind;

export interface Tile {
  id: string;
  name: string;
  size: [number, number] | null;
  finish: Finish;
  faces: number | null;
  kinds: TileKind[];
  img: string;
}

const CERAMIC_TILES: Tile[] = [
  { id: 'anty-sky-white', name: 'Anty Sky White', size: [120, 120], finish: 'glossy', faces: 3, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9894' },
  { id: 'ashwin-black', name: 'Ashwin Black', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9898' },
  { id: 'ashwin-anthrazit', name: 'Ashwin Anthrazit', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9897' },
  { id: 'ashwin-ivory', name: 'Ashwin Ivory', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9900' },
  { id: 'ashwin-latte', name: 'Ashwin Latte', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9901' },
  { id: 'ashwin-misty', name: 'Ashwin Misty', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9902' },
  { id: 'ashwin-grey', name: 'Ashwin Grey', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9899-1' },
  { id: 'ashwin-silver', name: 'Ashwin Silver', size: [60, 120], finish: 'matt', faces: 6, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9905' },
  { id: 'boun-ferragosto', name: 'Boun Ferragosto', size: [60, 120], finish: 'highgloss', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9908' },
  { id: 'cerribean-beige', name: 'Cerribean Beige', size: [100, 100], finish: 'glossy', faces: 3, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9909' },
  { id: 'concrete-grey', name: 'Concrete Grey', size: [60, 120], finish: 'matt', faces: 4, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9910' },
  { id: 'concrete-white', name: 'Concrete White', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9911' },
  { id: 'esterda-latte', name: 'Esterda Latte', size: [60, 120], finish: 'carving', faces: 4, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9913' },
  { id: 'craft-white', name: 'Craft White', size: [60, 120], finish: 'carving', faces: 5, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9914' },
  { id: 'emrance-grey', name: 'Emrance Grey', size: [60, 120], finish: 'glossy', faces: 3, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9915' },
  { id: 'emrance-white', name: 'Emrance White', size: [60, 120], finish: 'glossy', faces: 3, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9916' },
  { id: 'heaven-bone', name: 'Heaven Bone', size: [100, 100], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9917' },
  { id: 'ice-onyx-grey', name: 'Ice Onyx Grey', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9930' },
  { id: 'onyx-cafe-peach', name: 'Onyx Cafe Peach', size: [60, 120], finish: 'glossy', faces: 8, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9933' },
  { id: 'onyx-cafe-white', name: 'Onyx Cafe White', size: [60, 120], finish: 'matt', faces: 8, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9934' },
  { id: 'orion-peach', name: 'Orion Peach', size: [60, 120], finish: 'carving', faces: 3, kinds: ['wandfliesen', 'bodenfliesen', 'grossformate'], img: 'IMG_9936' },
  { id: 'segate-white', name: 'Segate White', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9937' },
  { id: 'sivas-black', name: 'Sivas Black', size: [60, 60], finish: 'matt', faces: 8, kinds: ['bodenfliesen'], img: 'IMG_9938' },
  { id: 'sivas-silver', name: 'Sivas Silver', size: [60, 60], finish: 'glossy', faces: 8, kinds: ['wandfliesen', 'bodenfliesen'], img: 'IMG_9942' },
  { id: 'sky-onyx', name: 'Sky Onyx', size: [60, 120], finish: 'glossy', faces: 3, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9943' },
  { id: 'statuario-eva', name: 'Statuario Eva', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9944' },
  { id: 'super-white-89-plus', name: 'Super White 89+', size: [60, 120], finish: 'glossy', faces: null, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9945' },
  { id: 'vz-1021', name: 'VZ 1021', size: [60, 60], finish: 'glossy', faces: 5, kinds: ['wandfliesen', 'bodenfliesen'], img: 'IMG_9946' },
  { id: 'vz-13070', name: 'VZ 13070', size: [60, 120], finish: 'matt', faces: 5, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9948' },
  { id: 'vz-13071', name: 'VZ 13071', size: [60, 120], finish: 'matt', faces: 8, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9951' },
  { id: 'vz-13072', name: 'VZ 13072', size: [60, 120], finish: 'matt', faces: 3, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9952' },
  { id: 'vz-13073', name: 'VZ 13073', size: [60, 120], finish: 'matt', faces: 4, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9953' },
  { id: 'willium-dark', name: 'Willium Dark', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9954' },
  { id: 'beton-ivory', name: 'Beton Ivory', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9955' },
  { id: 'avion-onyx', name: 'Avion Onyx', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9956' },
  { id: 'armani-light', name: 'Armani Light', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9957' },
  { id: 'benito-brown', name: 'Benito Brown', size: [60, 120], finish: 'glossy', faces: 2, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9959' },
  { id: 'benito-fog', name: 'Benito Fog', size: [60, 120], finish: 'glossy', faces: 2, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9960' },
  { id: 'exotica-bianco', name: 'Exotica Bianco', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9961' },
  { id: 'beton-white', name: 'Beton White', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9962' },
  { id: 'nordik-grey', name: 'Nordik Grey', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9963' },
  { id: 'elite-beige', name: 'Elite Beige', size: [60, 120], finish: 'matt', faces: 4, kinds: ['bodenfliesen', 'grossformate'], img: 'IMG_9965' },
  { id: 'fury-white', name: 'Fury White', size: [60, 120], finish: 'highgloss', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9966' },
  { id: 'novella-nero', name: 'Novella Nero', size: [60, 120], finish: 'highgloss', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9967' },
  { id: 'fury-black', name: 'Fury Black', size: [60, 120], finish: 'highgloss', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9968' },
  { id: 'latin-beige', name: 'Latin Beige', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9969' },
  { id: 'latin-verde', name: 'Latin Verde', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9970' },
  { id: 'mahavir-satuario', name: 'Mahavir Satuario', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9971' },
  { id: 'cristela-crema', name: 'Cristela Crema', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9972' },
  { id: 'pacific-crema', name: 'Pacific Crema', size: [60, 120], finish: 'glossy', faces: 4, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9973' },
  { id: 'onix-grey', name: 'Onix Grey', size: [60, 120], finish: 'glossy', faces: 6, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9974' },
  { id: 'statuario-river', name: 'Statuario River', size: [60, 120], finish: 'glossy', faces: 6, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9975' },
  { id: 'bianco-doumiti', name: 'Bianco Doumiti', size: [60, 120], finish: 'glossy', faces: 6, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9976' },
  { id: 'onix-white', name: 'Onix White', size: [60, 120], finish: 'glossy', faces: 8, kinds: ['wandfliesen', 'grossformate'], img: 'IMG_9977' },
];

/** Natural stone slabs for kitchen worktops, photographed on the rack; no names or sizes yet, so they are
    numbered. Photos: assets/kitchen-tops → tools/build-worktops.mjs → public/assets/img/tiles/arbeitsplatte-NN.jpg */
const WORKTOP_COUNT = 96;
const WORKTOPS: Tile[] = Array.from({ length: WORKTOP_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { id: `arbeitsplatte-${n}`, name: `Arbeitsplatte ${n}`, size: null, finish: 'polished', faces: null, kinds: ['kueche'], img: `arbeitsplatte-${n}` };
});

export const TILES: Tile[] = [...CERAMIC_TILES, ...WORKTOPS];

export const TILE_FILTERS: TileFilter[] = ['alle', 'wandfliesen', 'bodenfliesen', 'grossformate', 'steinplatten', 'kueche'];

export const FILTER_LABELS: Record<TileFilter, MessageKey> = {
  alle: 'cat.all',
  wandfliesen: 'cat.wall',
  bodenfliesen: 'cat.floor',
  grossformate: 'cat.large',
  steinplatten: 'cat.slabs',
  kueche: 'cat.kitchen',
};

/** The homepage carousel ("Beliebte Fliesen"). */
export const FEATURED_TILES = ['ashwin-black', 'ashwin-anthrazit', 'ashwin-latte', 'concrete-grey', 'concrete-white', 'esterda-latte', 'segate-white', 'anty-sky-white'];

export const tileById = new Map(TILES.map((tile) => [tile.id, tile]));

/** Tile surface only, cropped from the catalogue photos by tools/build-tiles.mjs (about 500 × 500 px, single faces 236 × 492). */
export const tilePhoto = (img: string) => `/assets/img/tiles/${img}.jpg`;
export const tileSize = (tile: Tile) => (tile.size ? `${tile.size[0]} × ${tile.size[1]} cm` : '');
export const isWorktop = (tile: Tile) => tile.kinds.includes('kueche');
export const tileHref = (tile: Tile) => `/fliesen/${tile.id}`;
export const matchesFilter = (tile: Tile, filter: TileFilter) => (filter === 'alle' ? !isWorktop(tile) : tile.kinds.includes(filter));
export const parseFilter = (value: string | null): TileFilter => TILE_FILTERS.find((f) => f === value) ?? 'alle';

/** Tiles to suggest next to one: the same series first (shared first word, e.g. "Ashwin"), then same finish and format. */
export function similarTiles(tile: Tile, limit = 4) {
  const series = (t: Tile) => t.name.split(' ')[0];
  const score = (other: Tile) =>
    (series(other) === series(tile) ? 4 : 0) +
    (other.finish === tile.finish ? 2 : 0) +
    (tile.size && other.size?.join() === tile.size.join() ? 1 : 0);
  return TILES.filter((other) => other !== tile && score(other) > 0)
    .sort((a, b) => score(b) - score(a))   // stable: catalogue order within the same score
    .slice(0, limit);
}

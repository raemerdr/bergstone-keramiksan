/* Crop the catalogue tile photos down to the tile surface for the website.

    node tools/build-tiles.mjs             # fetch missing originals, crop every tile in lib/tiles.ts
    node tools/build-tiles.mjs --sheet     # also write tools/.cache/contact-sheet.jpg to check them
    node tools/build-tiles.mjs --offline   # only crop originals already in tools/.cache/tile-photos

Needs Node 22.18+ (it imports lib/tiles.ts directly) and sharp (installed with Next.js).
The originals (keramiksan.de/wp-content/uploads/2024/07/IMG_*.jpg) are catalogue sheets: a label on
top, then panels side by side, each outlined by a thin line (white tiles are as white as the paper).
Most sheets open with a wide panel (the pattern across two faces), followed by single faces.
The script splits the panels at the white gaps between them, takes the widest (the first, if equal)
and crops inside its outline. Output: public/assets/img/tiles/IMG_*.jpg (tilePhoto() in lib/tiles.ts).
After adding tiles, look at the contact sheet and fix any odd one in OVERRIDES. */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { TILES } from '../lib/tiles.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, 'tools/.cache/tile-photos');
const OUT = path.join(ROOT, 'public/assets/img/tiles');
const SOURCE = 'https://keramiksan.de/wp-content/uploads/2024/07/';

const INSET = 10;  // keeps outlines, edge shading and JPEG ringing out of the crop (px)

/** Hand-measured crops ({ left, top, width, height } in px) for sheets the detection gets wrong. */
const OVERRIDES = {};

const OFFLINE = process.argv.includes('--offline');

async function original(img) {
  const file = path.join(CACHE, `${img}.jpg`);
  try {
    await fs.access(file);
    return file;
  } catch { /* not cached yet */ }
  if (OFFLINE) return null;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${SOURCE}${img}.jpg`, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
      return file;
    } catch (err) {
      if (attempt === 4) throw new Error(`${img}: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
    }
  }
}

/** The widest panel on a catalogue sheet, inset so that only tile surface remains. */
async function panelCrop(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const dark = (x, y) => 255 - data[y * W + x];   // 0 = white paper
  const rowShare = (y, x0, x1, min) => {          // share of pixels darker than `min` along a row
    let n = 0;
    for (let x = x0; x < x1; x++) n += dark(x, y) > min;
    return n / (x1 - x0);
  };

  // Top: the first row below the label that is mostly panel (tile, or the outlines' top edge)
  let top = Math.round(H * 0.15);
  while (top < H - 40 && rowShare(top, Math.round(W * 0.05), Math.round(W * 0.95), 3) <= 0.6) top++;
  if (top >= H - 40) throw new Error('no panels found');

  // The columns across the panels: share of inked pixels, mean darkness, flat (the same all the way down)
  const y0 = top + 15, y1 = Math.min(H - 2, top + 215), n = y1 - y0;
  const cols = Array.from({ length: W }, (_, x) => {
    let inked = 0, sum = 0, squares = 0;
    for (let y = y0; y < y1; y++) {
      const d = dark(x, y);
      inked += d > 3;
      sum += d;
      squares += d * d;
    }
    const mean = sum / n;
    return { ink: inked / n, mean, flat: squares / n - mean * mean <= 4 };
  });
  const edge = (x, darker) => x >= 0 && x < W && cols[x].ink >= 0.5 && cols[x].mean >= darker;

  // Outer edges, past the dark rim some photos have at their sides and the paper margin
  let left = 0;
  while (left < 30 && cols[left].ink >= 0.02) left++;
  while (left < W - 1 && cols[left].ink < 0.3) left++;
  let right = W - 1;
  while (right > W - 31 && cols[right].ink >= 0.02) right--;
  while (right > left && cols[right].ink < 0.3) right--;

  // Gaps between panels, 5–25 px: paper (give or take a few faint columns), or on tinted sheets a flat
  // light band with a panel edge on both sides. The inside of a white tile is as white, but wider.
  const gaps = [];
  const findGaps = (inGap, isGap) => {
    for (let x = left; x <= right; x++) {
      if (!inGap(x)) continue;
      let end = x;
      while (end <= right && inGap(end)) end++;
      if (end - x >= 5 && end - x <= 25 && isGap(x, end)) gaps.push([x, end]);
      x = end;
    }
  };
  findGaps((x) => cols[x].ink < 0.5, (s, e) => cols.slice(s, e).filter((c) => c.ink < 0.02).length >= 5);
  findGaps((x) => cols[x].flat && cols[x].mean <= 20, (s, e) => {
    const darker = Math.max(...cols.slice(s, e).map((c) => c.mean)) + 10;
    return [1, 2, 3, 4].some((d) => edge(s - d, darker)) && [0, 1, 2, 3].some((d) => edge(e + d, darker));
  });
  gaps.sort(([a], [b]) => a - b);

  const panels = [];
  let start = left;
  for (const [s, e] of gaps) {
    if (s > start) panels.push([start, s - 1]);   // else it overlaps the gap before
    start = Math.max(start, e);
  }
  panels.push([start, right]);
  const width = ([a, b]) => b - a + 1;
  const widest = Math.max(...panels.map(width));
  const [a, b] = panels.find((panel) => width(panel) >= widest * 0.9);

  // Its own top (panels are not always level), then its bottom: the last inked row (tile or outline)
  // before paper (or the off-white strip some sheets end in); otherwise the panel runs off the photo
  let panelTop = Math.max(0, top - 20);
  while (panelTop < top + 40 && rowShare(panelTop, a + 3, b - 3, 3) < 0.5) panelTop++;
  const x0 = a + INSET, x1 = b - INSET;
  const paper = (y) => rowShare(y, x0, x1, 12) < 0.05;
  let bottom = H - 1;
  for (let y = panelTop + 20; y < H - 5; y++) {
    if (rowShare(y, x0, x1, 12) >= 0.5 && paper(y + 1) && paper(y + 2) && paper(y + 3) && paper(y + 4)) {
      bottom = y;
      break;
    }
  }

  return { left: x0, top: panelTop + INSET, width: x1 - x0, height: bottom - panelTop - 2 * INSET };
}

async function contactSheet(crops) {
  const cell = 150, label = 22, cols = 9;
  const rows = Math.ceil(crops.length / cols);
  const layers = await Promise.all(crops.map(async ({ img, file }, i) => {
    const thumb = await sharp(file).resize(cell - 10, cell - 10, { fit: 'inside' }).toBuffer();
    const text = Buffer.from(`<svg width="${cell}" height="${label}"><text x="5" y="15" font-family="Helvetica" font-size="12">${img}</text></svg>`);
    const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + label);
    return [{ input: thumb, left: x + 5, top: y + 5 }, { input: text, left: x, top: y + cell }];
  }));
  const file = path.join(ROOT, 'tools/.cache/contact-sheet.jpg');
  await sharp({ create: { width: cols * cell, height: rows * (cell + label), channels: 3, background: '#fff' } })
    .composite(layers.flat()).jpeg({ quality: 85 }).toFile(file);
  return file;
}

await fs.mkdir(CACHE, { recursive: true });
await fs.mkdir(OUT, { recursive: true });
const crops = [];
for (const tile of TILES) {
  const src = await original(tile.img);
  if (!src) { console.log(`${tile.img}  skipped (not cached)`); continue; }
  const box = OVERRIDES[tile.img] ?? await panelCrop(src);
  const file = path.join(OUT, `${tile.img}.jpg`);
  await sharp(src).extract(box).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  crops.push({ img: tile.img, file });
  // Panels are square (the wide ones and square formats), 1:2 (single faces) or in between
  const odd = box.width > box.height * 1.5 || box.height > box.width * 2.2;
  console.log(`${tile.img.padEnd(10)}  ${tile.size.join('×').padEnd(7)}  ${box.width}×${box.height} at ${box.left},${box.top}${OVERRIDES[tile.img] ? '  (override)' : ''}${odd ? '  ← check this one' : ''}`);
}
if (process.argv.includes('--sheet')) console.log('contact sheet:', await contactSheet(crops));

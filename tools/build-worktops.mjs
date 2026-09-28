/* Crop the worktop slab photos down to the stone for the "Küche" category on /fliesen.

    node tools/build-worktops.mjs           # crop every photo in assets/kitchen-tops
    node tools/build-worktops.mjs --sheet   # also write tools/.cache/worktops-sheet.jpg to check them

The originals (assets/kitchen-tops/*.jpg, not in git) are WhatsApp photos of whole slabs on the rack:
a label clipped to the top edge, warehouse around the slab. The script takes a 4:3 window from the
middle of the slab, below the label, and writes public/assets/img/tiles/arbeitsplatte-NN.jpg in
file-name order (NN = 01, 02, …). lib/tiles.ts lists the same number of worktops (WORKTOP_COUNT). */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets/kitchen-tops');
const OUT = path.join(ROOT, 'public/assets/img/tiles');

// Where the stone is, as shares of the photo: below the label, inside the slab edges
const AREA = { left: 0.14, right: 0.86, top: 0.26, bottom: 0.9 };
// Photos where that window catches the label: a narrow strip whose label hangs low (use the stone left of it)
const OVERRIDES = { 'PHOTO-2026-09-23-13-08-24 5.jpg': { left: 0.03, right: 0.45, top: 0.06, bottom: 0.94 } };

const files = (await fs.readdir(SRC))
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

const crops = [];
for (const [i, name] of files.entries()) {
  const src = path.join(SRC, name);
  const { width: W, height: H } = await sharp(src).metadata();
  const area = OVERRIDES[name] ?? AREA;
  const x0 = W * area.left, x1 = W * area.right, y0 = H * area.top, y1 = H * area.bottom;
  const height = Math.round(Math.min(y1 - y0, ((x1 - x0) * 3) / 4));
  const width = Math.round((height * 4) / 3);
  const box = { left: Math.round((x0 + x1 - width) / 2), top: Math.round((y0 + y1 - height) / 2), width, height };
  const file = path.join(OUT, `arbeitsplatte-${String(i + 1).padStart(2, '0')}.jpg`);
  await sharp(src).extract(box).resize(960, 720).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
  crops.push(file);
}
console.log(`${crops.length} worktops → public/assets/img/tiles/arbeitsplatte-01…${String(crops.length).padStart(2, '0')}.jpg`);

if (process.argv.includes('--sheet')) {
  const cell = 160, cols = 12, rows = Math.ceil(crops.length / cols);
  const layers = await Promise.all(crops.map(async (file, i) => ({
    input: await sharp(file).resize(cell - 8, ((cell - 8) * 3) / 4).toBuffer(),
    left: (i % cols) * cell + 4, top: Math.floor(i / cols) * ((cell * 3) / 4 + 4) + 4,
  })));
  const sheet = path.join(ROOT, 'tools/.cache/worktops-sheet.jpg');
  await fs.mkdir(path.dirname(sheet), { recursive: true });
  await sharp({ create: { width: cols * cell, height: rows * ((cell * 3) / 4 + 4) + 4, channels: 3, background: '#fff' } })
    .composite(layers).jpeg({ quality: 82 }).toFile(sheet);
  console.log('contact sheet:', sheet);
}

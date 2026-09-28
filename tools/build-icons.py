"""Build the icons from Flaticon Uicons: the sprite's <symbol>s (components/icons.tsx) and the
service pages' feature icons (components/feature-icon.tsx).

    npm pack @flaticon/flaticon-uicons@3.3.1 && tar -xzf flaticon-flaticon-uicons-3.3.1.tgz
    python3 -m pip install fonttools
    python3 tools/build-icons.py package > symbols.txt
    python3 tools/build-icons.py package --features > paths.txt

Only the glyphs listed below are converted, so the site ships a few kilobytes of inline SVG instead
of the icon fonts (~730 KB).
- ICONS (regular rounded; logos from Uicons Brands): paste the output over the Uicons <symbol> lines
  in components/icons.tsx (keep the hand-made i-google and i-tile) and add new names to IconName.
- FEATURE_ICONS (thin rounded, drawn large on the service pages): paste the output into PATHS in
  components/feature-icon.tsx. They are inlined only where they are used, not added to the sprite
  that every page carries.
Browse the names at https://www.flaticon.com/uicons.
Licence: free with the credit "Uicons by Flaticon" (site footer), or without it on a Premium plan.
"""
import pathlib
import re
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

STYLES = {  # prefix -> (font file stem, stylesheet with the codepoints)
    'rr': ('uicons-regular-rounded', 'regular/rounded.css'),
    'sr': ('uicons-solid-rounded', 'solid/rounded.css'),
    'tr': ('uicons-thin-rounded', 'thin/rounded.css'),
    'brands': ('uicons-brands', 'brands/all.css'),
}

# sprite id -> Uicons glyph as (style, name)
ICONS = {
    'chevron': ('rr', 'angle-small-down'),
    'prev': ('rr', 'angle-small-left'),
    'next': ('rr', 'angle-small-right'),
    'phone': ('rr', 'phone-call'),
    'wa': ('brands', 'whatsapp'),
    'menu': ('rr', 'menu-burger'),
    'close': ('rr', 'cross-small'),
    'instagram': ('brands', 'instagram'),
    'facebook': ('brands', 'facebook'),
    'tiktok': ('brands', 'tik-tok'),
    'download': ('rr', 'download'),
    'mail': ('rr', 'envelope'),
    '360': ('rr', '360-degrees'),
    'plus': ('rr', 'plus-small'),
    'minus': ('rr', 'minus-small'),
    'grid': ('rr', 'apps'),
    'expand': ('rr', 'expand'),
    'shrink': ('rr', 'compress'),
    'arrow': ('rr', 'arrow-right'),
    'star': ('sr', 'star'),
}

# feature icon id -> Uicons glyph as (style, name)
FEATURE_ICONS = {
    'samples': ('tr', 'floor-alt'),
    'language': ('tr', 'language'),
    'swatches': ('tr', 'swatchbook'),
    'handshake': ('tr', 'handshake'),
    'blueprint': ('tr', 'blueprint'),
    'oven': ('tr', 'oven'),
    'measure': ('tr', 'measuring-tape'),
    'calculator': ('tr', 'calculator'),
    'floor': ('tr', 'floor'),
    'sink': ('tr', 'sink'),
    'truck': ('tr', 'truck-moving'),
    'europe': ('tr', 'earth-europa'),
    'tiles': ('tr', 'border-all'),
    'bucket': ('tr', 'bucket'),
    'tools': ('tr', 'tools'),
    'camera': ('tr', 'camera'),
}
EM = 300  # Uicons: 300 units per em, ascent 300, descent 0


def number(v):
    return ('%.1f' % v).rstrip('0').rstrip('.') if isinstance(v, float) else str(v)


def main(package, features):
    css_dir = pathlib.Path(package) / 'css'
    fonts = {}

    def font(style):
        if style not in fonts:
            stem, css = STYLES[style]
            tt = TTFont(next(css_dir.glob(f'{stem}-*.woff')))
            fonts[style] = (tt.getBestCmap(), tt.getGlyphSet(), (css_dir / css).read_text())
        return fonts[style]

    def path(style, name):
        cmap, glyph_set, css = font(style)
        match = re.search(r'\.fi-%s-%s:before\{content:"\\([0-9a-f]+)"\}' % (style, re.escape(name)), css)
        if not match:
            sys.exit(f'unknown icon fi-{style}-{name}')
        pen = SVGPathPen(glyph_set, ntos=number)
        glyph_set[cmap[int(match.group(1), 16)]].draw(TransformPen(pen, (1, 0, 0, -1, 0, EM)))  # font units are y-up
        return pen.getCommands()

    if features:
        for fid, (style, name) in FEATURE_ICONS.items():
            print(f"  {fid}: '{path(style, name)}',")
    else:
        for sid, (style, name) in ICONS.items():
            print(f'      <symbol id="i-{sid}" viewBox="0 0 {EM} {EM}"><path d="{path(style, name)}" fill="currentColor" /></symbol>')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    main(args[0] if args else 'package', '--features' in sys.argv)

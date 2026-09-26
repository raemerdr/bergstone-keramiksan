"""Copy the shared page chrome (sprite, header, footer, floating buttons, drawers) from index.html
into every other page, so the header and footer only have to be edited in one place.

    python3 tools/sync-chrome.py

index.html marks the blocks with
    <!-- chrome:top … -->     …  <!-- /chrome:top -->
    <!-- chrome:bottom … -->  …  <!-- /chrome:bottom -->
Every other *.html page needs the same two marker pairs (their content is replaced).
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOCK = re.compile(r'<!-- chrome:(top|bottom)\b.*?<!-- /chrome:\1 -->', re.S)


def main():
    source = (ROOT / 'index.html').read_text(encoding='utf-8')
    blocks = {m.group(1): m.group(0) for m in BLOCK.finditer(source)}
    if set(blocks) != {'top', 'bottom'}:
        raise SystemExit('index.html: chrome markers missing')

    for page in sorted(ROOT.glob('*.html')):
        if page.name == 'index.html':
            continue
        html = page.read_text(encoding='utf-8')
        updated, count = BLOCK.subn(lambda m: blocks[m.group(1)], html)
        if count != 2:
            print(f'skipped   {page.name} (markers missing)')
        elif updated != html:
            page.write_text(updated, encoding='utf-8')
            print(f'updated   {page.name}')
        else:
            print(f'unchanged {page.name}')


if __name__ == '__main__':
    main()

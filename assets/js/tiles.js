/* Bergstone Keramiksan — tile listing (fliesen.html): grid + type filter.
   Data: assets/js/tiles-data.js · shared helpers (translations, wishlist, WhatsApp links): window.BK from main.js */
(() => {
  'use strict';

  const grid = document.querySelector('[data-tile-grid]');
  const catalogue = window.BK_TILES;
  if (!grid || !catalogue || !window.BK) return;

  const { t, onLang, refresh } = window.BK;
  const chips = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('[data-tile-count]');
  const empty = document.querySelector('[data-tile-empty]');
  const KINDS = chips.map((chip) => chip.dataset.filter);
  const matches = (item, kind) => kind === 'alle' || item.kinds.includes(kind);

  const requested = new URLSearchParams(location.search).get('art');
  let kind = KINDS.includes(requested) ? requested : 'alle';

  chips.forEach((chip) => {
    chip.querySelector('[data-count]').textContent = String(catalogue.items.filter((item) => matches(item, chip.dataset.filter)).length);
    chip.addEventListener('click', () => apply(chip.dataset.filter));
  });

  function card(item) {
    const li = document.createElement('li');
    li.className = 'product-card';
    li.dataset.product = item.id;
    li.dataset.name = item.name;
    li.dataset.kinds = item.kinds.join(' ');
    li.innerHTML = '<div class="product-card__media"><img class="is-tile" alt="" loading="lazy" decoding="async" width="1100" height="700">'
      + '<button class="heart" type="button" aria-pressed="false"><svg><use href="#i-heart"/></svg></button></div>'
      + '<h3 class="product-card__title"></h3><p class="product-card__meta"></p>'
      + '<a class="btn btn--gold btn--block" href="#kontakt" data-wa="product"></a>';
    li.querySelector('img').src = catalogue.src(item);
    li.querySelector('.product-card__title').textContent = item.name;
    li.querySelector('.product-card__meta').textContent = `${catalogue.size(item)} · ${t(`finish.${item.finish}`)}`;
    li.querySelector('.btn').textContent = t('tile.cta');
    return li;
  }

  /** Show the matching tiles, restage the entrance and keep the URL shareable (?art=…). */
  function apply(next, { animate = true, updateUrl = true } = {}) {
    kind = next;
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === kind)));

    let visible = 0;
    for (const li of grid.children) {
      const show = matches(catalogue.byId.get(li.dataset.product), kind);
      li.hidden = !show;
      if (show) li.style.setProperty('--i', Math.min(visible++, 11));
    }
    count.textContent = visible === 1 ? t('tiles.countOne') : t('tiles.count').replace('{n}', visible);
    empty.hidden = visible > 0;

    if (animate) {
      grid.classList.remove('is-in');
      void grid.offsetWidth;   // restart the stagger
    }
    grid.classList.add('is-in');

    if (updateUrl) {
      const url = new URL(location.href);
      if (kind === 'alle') url.searchParams.delete('art'); else url.searchParams.set('art', kind);
      history.replaceState(null, '', url);
    }
  }

  function render() {
    grid.replaceChildren(...catalogue.items.map(card));
    refresh();                                   // hearts + WhatsApp links for the new cards
    apply(kind, { animate: false, updateUrl: false });
  }

  onLang(render);
  render();
})();

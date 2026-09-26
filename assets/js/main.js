/* Bergstone Keramiksan — homepage behaviour (no dependencies) */
(() => {
  'use strict';

  const CONFIG = {
    whatsapp: '491773960199',
  };

  // Fallback only (browsers without WebGL2): the hosted Pano2VR tour. Deep link format: #node,pan,tilt,fov
  const TOUR = {
    url: 'https://cdn2.3dwisemedia.com/2026/BERGSTONEKERAMIKSAN/',
    // Same node/pan/tilt as the hero poster (rendered at FOV 100). The poster pushes in to scale 1.08
    // while loading, which equals FOV 2·atan(tan(50°)/1.08) ≈ 95.6 — so the live tour lands on the same frame.
    view: 'node16,172,-2,95.6',
    settleMs: 5000,   // measured: the tour's fly-in intro lands ~4.9 s after its load event
    maxWaitMs: 12000, // reveal anyway on slow connections
  };

  const SCRIPT_URL = document.currentScript?.src || location.href;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I18N = window.BK_I18N;

  // Per-viewer conveniences only (language, wishlist); every read/write may fail.
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };

  /* ------------------------------------------------------------------
     Language (German source in HTML, English from i18n.js)
     ------------------------------------------------------------------ */
  const deText = new Map();
  const deAttr = new Map();
  let lang = 'de';
  const langListeners = [];
  const t = (key) => I18N.dyn[lang][key] ?? I18N.dyn.de[key];

  function snapshotGerman() {
    $$('[data-i18n]').forEach((el) => {
      // Collapse source whitespace but keep no-break spaces (they glue words for the line splitter)
      deText.set(el, el.hasAttribute('data-i18n-html') ? el.innerHTML.trim() : el.textContent.trim().replace(/[ \t\n\r]+/g, ' '));
      if (el.hasAttribute('data-split')) el.dataset.text = deText.get(el);
    });
    $$('[data-i18n-attr]').forEach((el) => {
      const attrs = {};
      parseAttrMap(el).forEach(([attr]) => { attrs[attr] = el.getAttribute(attr); });
      deAttr.set(el, attrs);
    });
  }

  const parseAttrMap = (el) => el.dataset.i18nAttr.split(';').map((pair) => pair.split(':').map((s) => s.trim()));

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    const dict = next === 'de' ? null : I18N[next];

    $$('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const value = dict ? (dict[key] ?? I18N.dyn[next]?.[key]) : deText.get(el);
      if (value == null) { console.warn(`[i18n] missing "${key}" (${next})`); return; }
      if (el.hasAttribute('data-split')) {
        el.dataset.text = value;
        if (el.classList.contains('is-split')) splitHeading(el);
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    $$('[data-i18n-attr]').forEach((el) => {
      parseAttrMap(el).forEach(([attr, key]) => {
        const value = dict ? (dict[key] ?? I18N.dyn[next]?.[key]) : deAttr.get(el)[attr];
        if (value == null) { console.warn(`[i18n] missing "${key}" (${next})`); return; }
        el.setAttribute(attr, value);
      });
    });

    $$('.devbar [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
    updateWhatsAppLinks();
    renderSaved();
    langListeners.forEach((fn) => fn(next));
  }

  function setLang(next) {
    if (next === lang) return;
    applyLang(next);
    store.set('bk-lang', next);
    const url = new URL(location.href);
    if (next === 'de') url.searchParams.delete('lang'); else url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
  }

  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    const wanted = fromUrl || store.get('bk-lang', 'de');
    return wanted === 'en' ? 'en' : 'de';
  }

  /* ------------------------------------------------------------------
     Split headings into lines (line-by-line reveal)
     ------------------------------------------------------------------ */
  function splitHeading(el) {
    const text = el.dataset.text;
    const words = text.split(/[ \t\n\r]+/).filter(Boolean);

    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.className = 'split-measure';
    words.forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.textContent = word;
      visual.append(w);
      if (i < words.length - 1) visual.append(' ');
    });

    const spoken = document.createElement('span');
    spoken.className = 'visually-hidden';
    spoken.textContent = text;
    el.replaceChildren(spoken, visual);

    // Group words by their rendered line
    const lines = [];
    let lastTop = null;
    $$('.w', visual).forEach((w) => {
      if (lastTop === null || w.offsetTop - lastTop > 2) { lines.push([]); lastTop = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });

    visual.className = '';
    visual.replaceChildren(...lines.map((lineWords, i) => {
      const line = document.createElement('span');
      line.className = 'split-line';
      line.style.setProperty('--i', i);
      const inner = document.createElement('span');
      inner.textContent = lineWords.join(' ');
      line.append(inner);
      return line;
    }));
    el.classList.add('is-split');
  }

  let lastWidth = innerWidth;
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (innerWidth === lastWidth) return;
      lastWidth = innerWidth;
      $$('[data-split].is-split').forEach(splitHeading);
    }, 180);
  });

  /* ------------------------------------------------------------------
     Scroll reveals
     ------------------------------------------------------------------ */
  function initReveals() {
    $$('[data-reveal="items"]').forEach((group) => {
      [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
    });

    const targets = $$('[data-reveal], [data-split]').filter((el) => !el.closest('[data-hero]'));
    if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -50px 0px' });
    targets.forEach((el) => io.observe(el));
  }

  function initHero() {
    const hero = $('[data-hero]');
    if (!hero) return;
    const img = $('.hero__media img', hero);
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      requestAnimationFrame(() => {
        hero.classList.add('is-in');
        $$('[data-split]', hero).forEach((h) => h.classList.add('is-in'));
      });
    };
    if (img.complete) start();
    else {
      img.addEventListener('load', start, { once: true });
      img.addEventListener('error', start, { once: true });
      setTimeout(start, 2500);
    }
  }

  /* ------------------------------------------------------------------
     Hero ⇄ live 360° tour (own WebGL viewer, hosted tour as fallback)
     ------------------------------------------------------------------ */
  function initHeroTour() {
    const hero = $('[data-tour]');
    if (!hero) return;
    const stage = $('[data-tour-stage]', hero);
    const content = $('.hero__content', hero);
    const status = $('.tour-loading span', hero);
    const exitButton = $('[data-tour-exit]', hero);
    let returnTo = null;
    let session = 0;
    let timers = [];
    let tourPromise = null;
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    // The viewer module loads on intent; resolves to null where WebGL2 is unavailable
    const loadTour = () => (tourPromise ||= import(new URL('tour.js', SCRIPT_URL).href)
      .then((mod) => mod.createTour({ hero, t }))
      .catch((err) => { console.warn('[tour]', err); return null; }));
    langListeners.push(() => { tourPromise?.then((tour) => tour?.setLang()); });

    const warm = () => loadTour().then((tour) => tour?.prefetch());
    $$('[data-tour-start]').forEach((el) => {
      el.addEventListener('pointerenter', warm, { once: true });
      el.addEventListener('focus', warm, { once: true });
    });

    const reveal = () => {
      clearTimers();
      hero.classList.add('is-live');
      status.textContent = '';
    };

    async function start(trigger) {
      if (hero.classList.contains('is-touring')) return;
      const id = ++session;
      returnTo = trigger;
      if (!hero.contains(trigger)) scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

      hero.classList.add('is-touring');
      content.inert = true;
      status.textContent = t('tour.loading');
      exitButton.focus({ preventScroll: true });

      const tour = await loadTour();
      if (id !== session) return;
      if (tour) {
        hero.classList.add('is-pano');
        try {
          // Opens on the poster's exact view, so the cross-fade is seamless
          if (await tour.open()) { if (id === session) reveal(); return; }
        } catch (err) {
          console.warn('[tour]', err);
        }
        if (id !== session) return;
        hero.classList.remove('is-pano');
      }
      embed(id);
    }

    function embed(id) {
      hero.classList.add('is-embed');
      const frame = document.createElement('iframe');
      frame.src = `${TOUR.url}#${TOUR.view}`;
      frame.title = t('tour.frame');
      frame.allow = 'fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking';
      frame.addEventListener('load', () => { timers.push(setTimeout(() => { if (id === session) reveal(); }, TOUR.settleMs)); }, { once: true });
      timers.push(setTimeout(() => { if (id === session) reveal(); }, TOUR.maxWaitMs));
      stage.replaceChildren(frame);
    }

    function exit() {
      if (!hero.classList.contains('is-touring')) return;
      session++;
      clearTimers();
      hero.classList.remove('is-live', 'is-touring');
      content.inert = false;
      status.textContent = '';

      // Release the viewer (or the embedded tour) once it has faded out
      setTimeout(() => {
        if (hero.classList.contains('is-touring')) return;
        hero.classList.remove('is-pano', 'is-embed');
        tourPromise?.then((tour) => tour?.close());
        $('iframe', stage)?.remove();
      }, reduceMotion ? 0 : 900);

      // Replay the headline entrance on the way back
      const title = $('[data-split]', hero);
      title.classList.remove('is-in');
      void title.offsetWidth;
      title.classList.add('is-in');

      const target = returnTo && document.contains(returnTo) && !returnTo.closest('[aria-hidden="true"]') ? returnTo : $('[data-tour-start]', content);
      target.focus({ preventScroll: true });
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-tour-start]');
      if (trigger) { e.preventDefault(); start(trigger); return; }
      if (e.target.closest('[data-tour-exit]')) exit();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hero.classList.contains('is-touring') && !document.fullscreenElement) exit();
    });

    if (location.hash === '#360') {
      history.replaceState(null, '', location.pathname + location.search);
      start($('[data-tour-start]', content));
    }
  }

  /* ------------------------------------------------------------------
     Header: hide on scroll down, reveal on scroll up
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = $('[data-header]');
    let lastY = scrollY;
    let ticking = false;
    const update = () => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 50);
      if (y > lastY + 4 && y > 420 && !$('.nav__item.is-open')) header.classList.add('is-hidden');
      else if (y < lastY - 4) header.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  }

  /* ------------------------------------------------------------------
     Mega menus
     ------------------------------------------------------------------ */
  function initMegaMenus() {
    const items = $$('[data-mega]');
    const canHover = matchMedia('(hover: hover)').matches;

    const close = (item) => {
      item.classList.remove('is-open');
      $('.nav__link', item).setAttribute('aria-expanded', 'false');
    };
    const open = (item) => {
      items.forEach((other) => other !== item && close(other));
      item.classList.add('is-open');
      $('.nav__link', item).setAttribute('aria-expanded', 'true');
    };

    items.forEach((item) => {
      $$('.mega__col li, .mega__promo', item).forEach((el, i) => el.style.setProperty('--i', i));
      const button = $('.nav__link', item);
      let timer;

      button.addEventListener('click', () => (item.classList.contains('is-open') ? close(item) : open(item)));
      if (canHover) {
        item.addEventListener('mouseenter', () => { clearTimeout(timer); timer = setTimeout(() => open(item), 70); });
        item.addEventListener('mouseleave', () => { clearTimeout(timer); timer = setTimeout(() => close(item), 160); });
      }
      item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) close(item); });
      $('.mega', item).addEventListener('click', (e) => { if (e.target.closest('a, button')) close(item); });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const openItem = items.find((item) => item.classList.contains('is-open'));
      if (openItem) { close(openItem); $('.nav__link', openItem).focus(); }
    });
  }

  /* ------------------------------------------------------------------
     Carousels (native scroll + snap, arrow buttons page by visible items)
     ------------------------------------------------------------------ */
  function initCarousels() {
    $$('[data-carousel]').forEach((root) => {
      const scroller = root.hasAttribute('data-track') ? root : $('[data-track]', root);
      const controls = $(`[data-carousel-nav="${root.dataset.carousel}"]`) || root;
      const prev = $('[data-prev]', controls);
      const next = $('[data-next]', controls);
      const list = $('ul', scroller) || scroller;

      const pageSize = () => {
        const item = list.firstElementChild;
        const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
        const perPage = Math.max(1, Math.floor((scroller.clientWidth + gap) / (item.offsetWidth + gap)));
        return perPage * (item.offsetWidth + gap);
      };
      const go = (dir) => scroller.scrollBy({ left: dir * pageSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
      const update = () => {
        prev.disabled = scroller.scrollLeft <= 2;
        next.disabled = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 2;
      };

      prev.addEventListener('click', () => go(-1));
      next.addEventListener('click', () => go(1));
      scroller.addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      update();
    });
  }

  /* ------------------------------------------------------------------
     Dialogs: drawers (catalogues, wishlist, menu) and the 360° modal
     ------------------------------------------------------------------ */
  const returnFocus = new WeakMap();

  function openDialog(id, opener) {
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    const parent = opener && opener.closest('dialog[open]');
    if (parent) closeDialog(parent, true);
    returnFocus.set(dialog, parent ? null : opener);

    $$('.drawer__body > ul > li, .menu-list li', dialog).forEach((li, i) => li.style.setProperty('--i', i));

    dialog.showModal();
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
  }

  function closeDialog(dialog, instant = false) {
    if (!dialog.open || dialog.dataset.closing) return;
    const finish = () => {
      delete dialog.dataset.closing;
      dialog.close();
      if (!$('dialog[open]')) document.documentElement.classList.remove('is-locked');
      const target = returnFocus.get(dialog);
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
    dialog.classList.remove('is-open');
    if (instant || reduceMotion) { finish(); return; }

    dialog.dataset.closing = '1';
    const panel = $('[data-panel]', dialog);
    let done = false;
    const onEnd = (e) => {
      if (e && e.target !== panel) return;
      if (done) return;
      done = true;
      panel.removeEventListener('transitionend', onEnd);
      finish();
    };
    panel.addEventListener('transitionend', onEnd);
    setTimeout(onEnd, 650);
  }

  function initDialogs() {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open]');
      if (opener) { e.preventDefault(); openDialog(opener.dataset.open, opener); return; }

      const closer = e.target.closest('[data-close]');
      if (closer) { closeDialog(closer.closest('dialog')); return; }

      // Links inside a drawer: close it first so the page can scroll or navigate
      const link = e.target.closest('dialog a[href]:not([data-wa]):not([target="_blank"])');
      if (link) closeDialog(link.closest('dialog'), true);
    });
    $$('dialog').forEach((dialog) => dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dialog); }));
  }

  /* ------------------------------------------------------------------
     WhatsApp deep links with language-aware starter messages
     ------------------------------------------------------------------ */
  function whatsAppUrl(topic, el) {
    let body = t(`wa.${topic}`) || t('wa.general');
    if (topic === 'product') body = body.replace('{product}', el.closest('[data-name]')?.dataset.name ?? '');
    if (topic === 'saved') body = body.replace('{list}', [...saved].map((id) => `• ${productInfo(id)?.name ?? id}`).join('\n'));
    const message = [t('wa.greeting'), body, t('wa.location'), t('wa.lang')].join('\n');
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function updateWhatsAppLinks() {
    $$('[data-wa]').forEach((link) => {
      link.href = whatsAppUrl(link.dataset.wa, link);
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  /* ------------------------------------------------------------------
     Wishlist (Merkliste) — send favourites straight to WhatsApp
     ------------------------------------------------------------------ */
  const catalogue = window.BK_TILES;

  function productInfo(id) {
    const item = catalogue?.byId.get(id);
    if (item) return { name: item.name, img: catalogue.src(item), meta: `${catalogue.size(item)} · ${t(`finish.${item.finish}`)}` };
    const card = $(`[data-product="${CSS.escape(id)}"]`);
    return card ? { name: card.dataset.name, img: $('img', card).getAttribute('src'), meta: $('.product-card__meta', card).textContent.trim() } : null;
  }
  const saved = new Set(store.get('bk-saved', []).filter((id) => productInfo(id)));

  function toggleSaved(id) {
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    store.set('bk-saved', [...saved]);
    renderSaved();
    const count = $('[data-saved-count]');
    count.classList.remove('is-bump');
    void count.offsetWidth; // restart the bump animation
    count.classList.add('is-bump');
  }

  function renderSaved() {
    $$('[data-product]').forEach((card) => {
      const button = $('.heart', card);
      const on = saved.has(card.dataset.product);
      button.setAttribute('aria-pressed', String(on));
      button.setAttribute('aria-label', `${t(on ? 'save.remove' : 'save.add')}: ${card.dataset.name}`);
    });

    const count = $('[data-saved-count]');
    count.textContent = String(saved.size);
    count.hidden = saved.size === 0;

    $('[data-saved-list]').replaceChildren(...[...saved].map((id, i) => {
      const product = productInfo(id);
      const li = document.createElement('li');
      li.style.setProperty('--i', i);

      const thumb = document.createElement('span');
      thumb.className = 'saved-list__thumb';
      const img = document.createElement('img');
      img.src = product.img;
      img.alt = '';
      thumb.append(img);

      const text = document.createElement('span');
      const name = document.createElement('strong');
      name.textContent = product.name;
      const meta = document.createElement('span');
      meta.textContent = product.meta;
      text.append(name, meta);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.setAttribute('aria-label', `${t('saved.removeItem')}: ${product.name}`);
      remove.innerHTML = '<svg><use href="#i-close"/></svg>';
      remove.addEventListener('click', () => toggleSaved(id));

      li.append(thumb, text, remove);
      return li;
    }));

    $('[data-saved-empty]').hidden = saved.size > 0;
    const send = $('[data-saved-send]');
    send.setAttribute('aria-disabled', String(saved.size === 0));
    send.href = whatsAppUrl('saved', send);
  }

  function initWishlist() {
    // Delegated, so cards rendered later (tile listing) work too
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-product] .heart');
      if (!button) return;
      toggleSaved(button.closest('[data-product]').dataset.product);
      button.classList.remove('is-pop');
      void button.offsetWidth;
      button.classList.add('is-pop');
    });
  }

  /* ------------------------------------------------------------------
     Current page in the navigation
     ------------------------------------------------------------------ */
  function markCurrentPage() {
    const normalise = (path) => path.replace(/\/index\.html$/, '/');
    const here = normalise(location.pathname);
    $$('.header a[href], .footer a[href], .menu-list a[href]').forEach((link) => {
      const url = new URL(link.getAttribute('href'), location.href);
      if (url.origin !== location.origin || url.hash || url.search || normalise(url.pathname) !== here || here === '/') return;
      link.setAttribute('aria-current', 'page');
      link.closest('.nav__item')?.classList.add('is-current');
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  // Shared helpers for page scripts (e.g. the tile listing)
  window.BK = {
    t,
    onLang: (fn) => langListeners.push(fn),
    refresh: () => { updateWhatsAppLinks(); renderSaved(); },
  };

  function boot() {
    snapshotGerman();
    initWishlist();
    applyLang(initialLang());
    $$('.devbar [data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

    initHeader();
    initMegaMenus();
    initCarousels();
    initDialogs();
    initHeroTour();
    markCurrentPage();

    // Split after web fonts settle so line breaks match the final typography
    const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
    fontsReady.then(() => {
      $$('[data-split]').forEach(splitHeading);
      initReveals();
      initHero();
      document.documentElement.classList.add('is-ready');
    });
  }

  boot();
})();

/* Bergstone Keramiksan — contact details, external links and shared photos. */

export const SITE = {
  name: 'Bergstone Keramiksan',
  whatsapp: '491773960199',
  phone: '+49 177 3960199',
  phoneHref: 'tel:+491773960199',
  email: 'info@bergstone-keramiksan.de',
  address: 'Notwendestraße 2, 67071 Ludwigshafen',
  maps: 'https://www.google.com/maps/search/?api=1&query=Notwendestra%C3%9Fe%202%2C%2067071%20Ludwigshafen',
  instagram: 'https://www.instagram.com/keramik.san/',
  facebook: 'https://www.facebook.com/Keramiksan',
  tiktok: 'https://www.tiktok.com/@keramik.san',
};

// Photos and catalogues still live on the current site (keramiksan.de)
export const UPLOADS = 'https://keramiksan.de/wp-content/uploads/';
const upload = (path: string) => `${UPLOADS}${path}`;

export const CATALOGS = {
  tiles: upload('2024/11/KERAMIKSAN-FLIESEN-KATALOG.pdf'),
  quartz: upload('2024/11/KERAMIKSAN-QUARTZ-CATALOG.pdf'),
  dexstone: upload('2025/02/Dex_Stone_Katalog_30kasim_revize-2.pdf'),
  pamesa: upload('2025/02/Pamesa-Genel-2025-1.pdf'),
  tilesCover: upload('2024/11/1.jpg'),
  quartzCover: upload('2024/11/2.jpg'),
};

/** Project photos (kitchens, bathrooms, stairs) used across the pages. */
export const PHOTO = {
  kitchen: upload('2021/09/WhatsApp-Image-2025-02-19-at-16.13.23-768x1024.jpeg'),
  stairs: upload('2021/09/r__0001_referenz_9.jpg'),
  bath: upload('2021/09/r__0006_referenz_4.jpg'),
  hall: upload('2021/09/r__0007_referenz_3.jpg'),
  shower: upload('2021/09/r__0008_Ebene-0.jpg'),
  tub: upload('2021/09/r__0000_referenz_2-1.jpg'),
  slide2: upload('2021/08/slide2.jpg'),
  slide3: upload('2021/08/slide3.jpg'),
  slider1: upload('2021/08/sliderkeramik1.jpg'),
};

export const BRAND = {
  logo: '/assets/img/brand/logo-horizontal.png',
  mark: '/assets/img/brand/logo-mark.png',
};

/** Fallback for browsers without WebGL2: the hosted Pano2VR tour. Deep link format: #node,pan,tilt,fov */
export const HOSTED_TOUR = {
  url: 'https://cdn2.3dwisemedia.com/2026/BERGSTONEKERAMIKSAN/',
  // Same node/pan/tilt as the hero poster (rendered at FOV 100). The poster pushes in to scale 1.08
  // while loading, which equals FOV 2·atan(tan(50°)/1.08) ≈ 95.6 — so the live tour lands on the same frame.
  view: 'node16,172,-2,95.6',
  settleMs: 5000,   // measured: the tour's fly-in intro lands ~4.9 s after its load event
  maxWaitMs: 12000, // reveal anyway on slow connections
};

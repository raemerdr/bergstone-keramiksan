/* Bergstone Keramiksan: contact details, external links and shared photos. */
import type { MessageKey } from './i18n';

export const SITE = {
  name: 'Bergstone Keramiksan',
  whatsapp: '491773960199',
  phone: '+49 177 3960199',
  phoneHref: 'tel:+491773960199',
  email: 'info@bergstone-keramiksan.de',
  address: 'Notwendestraße 2, 67071 Ludwigshafen',
  maps: 'https://www.google.com/maps/search/?api=1&query=Notwendestra%C3%9Fe%202%2C%2067071%20Ludwigshafen',
  instagram: 'https://www.instagram.com/keramik.san/',
  // Google Maps finds the business at this address and opens its reviews
  googleReviews: 'https://www.google.com/maps/search/?api=1&query=Keramiksan%2C%20Notwendestra%C3%9Fe%202%2C%2067071%20Ludwigshafen',
  facebook: 'https://www.facebook.com/Keramiksan',
  tiktok: 'https://www.tiktok.com/@keramik.san',
};

// Photos and catalogues still live on the current site (keramiksan.de)
export const UPLOADS = 'https://keramiksan.de/wp-content/uploads/';

/** The catalogues on /kataloge. `file` lives in keramiksan.de/wp-content/uploads; `mb` is its size. */
export const CATALOGS = [
  { id: 'fliesen', title: 'cat.pdf.tiles', file: '2024/11/KERAMIKSAN-FLIESEN-KATALOG.pdf', mb: 26, cover: '/assets/img/catalogs/fliesen.jpg' },
  { id: 'quarz', title: 'cat.pdf.quartz', file: '2024/11/KERAMIKSAN-QUARTZ-CATALOG.pdf', mb: 64, cover: '/assets/img/catalogs/quarz.jpg' },
  { id: 'dexstone', title: 'cat.pdf.dexstone', file: '2025/02/Dex_Stone_Katalog_30kasim_revize-2.pdf', mb: 97, cover: '/assets/img/catalogs/dexstone.jpg' },
  { id: 'pamesa', title: 'cat.pdf.pamesa', file: '2025/02/Pamesa-Genel-2025-1.pdf', mb: 70, cover: '/assets/img/catalogs/pamesa.jpg' },
] as const satisfies readonly { id: string; title: MessageKey; file: string; mb: number; cover: string }[];
export type Catalog = (typeof CATALOGS)[number];
/** Same-origin path (rewritten to keramiksan.de in next.config.ts), so `download` works. */
export const catalogDownload = (catalog: Catalog) => `/downloads/${catalog.file}`;
/** File name the browser saves the PDF under. */
export const catalogFileName = (catalog: Catalog) => `Bergstone-Keramiksan-${catalog.id}-Katalog.pdf`;

/** Legal details for the legal notice and the privacy policy, as in the legal notice on keramiksan.de. */
export const COMPANY = {
  name: 'Keramiksan GmbH',
  street: 'Notwendestraße 2',
  city: '67071 Ludwigshafen',
  representative: 'Asiye Boztas',
  court: 'Amtsgericht Ludwigshafen',
  register: 'HRB 68610',
  vatId: 'DE 339001287',
};

/** Agency credit in the footer, in English on every language version. */
export const CREDIT = {
  label: 'Site made by',
  name: 'nüll.',
  url: 'https://xn--nll-hoa.com/',
};

export const BRAND = {
  logo: '/assets/img/brand/logo-horizontal.png',
  /** The same with the BK mark at 76 %, for the header bar */
  logoHeader: '/assets/img/brand/logo-header.png',
  mark: '/assets/img/brand/logo-mark.png',
};

/** Fallback for browsers without WebGL2: the hosted Pano2VR tour. Deep link format: #node,pan,tilt,fov */
export const HOSTED_TOUR = {
  url: 'https://cdn2.3dwisemedia.com/2026/BERGSTONEKERAMIKSAN/',
  view: 'node1,44.08,-3.72,100',   // the entrance, like the in-house tour (START_VIEW in lib/tour/rooms.ts)
  settleMs: 5000,   // measured: the tour's fly-in intro lands ~4.9 s after its load event
  maxWaitMs: 12000, // reveal anyway on slow connections
};

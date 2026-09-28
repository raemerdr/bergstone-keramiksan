/* Bergstone Keramiksan: service pages. They share one template (app/[service]/page.tsx);
   the copy lives in the dictionaries under sp.{key}.* and this file holds everything else.
   Photos are AI-generated (public/assets/img/svc), several around tiles from the catalogue. */
import type { FeatureIconName } from '@/components/feature-icon';
import type { IconName } from '@/components/icons';
import type { MessageKey } from './i18n';
import type { WaTopic } from './whatsapp';

export type ServiceKey = 'beratung' | 'planung' | 'verlegung' | 'reparaturen';

export interface Service {
  slug: string;
  key: ServiceKey;
  /** Name in the breadcrumb and on the "more services" cards. */
  label: MessageKey;
  wa: WaTopic;
  /** Hero photo (4:3), also on the "more services" cards. */
  image: string;
  /** Icons for the features f1–f4. */
  icons: [FeatureIconName, FeatureIconName, FeatureIconName, FeatureIconName];
  /** Media-with-text band between the steps and the FAQ. */
  band: {
    href: string;
    tour?: boolean; // the link opens the 360° tour on the homepage
    icon: IconName;
    cta: MessageKey;
    media: { src: string; width: number; height: number };
  };
}

export const SERVICES: Service[] = [
  {
    slug: 'beratung', key: 'beratung', label: 'mega.showroomAdvice', wa: 'consult', image: '/assets/img/svc/beratung.jpg',
    icons: ['samples', 'language', 'swatches', 'handshake'],
    band: { href: '/#360', tour: true, icon: '360', cta: 'showroom.cta', media: { src: '/assets/img/tour/showroom-lounge.jpg', width: 1260, height: 1040 } },
  },
  {
    slug: 'planung-aufmass', key: 'planung', label: 'svc.planning', wa: 'planning', image: '/assets/img/svc/planung.jpg',
    icons: ['blueprint', 'oven', 'measure', 'calculator'],
    band: { href: '/fliesen?art=grossformate', icon: 'grid', cta: 'sp.planung.b.cta', media: { src: '/assets/img/svc/band-planung.jpg', width: 1400, height: 1050 } },
  },
  {
    slug: 'verlegung-montage', key: 'verlegung', label: 'cat.install', wa: 'install', image: '/assets/img/svc/verlegung.jpg',
    icons: ['floor', 'sink', 'truck', 'europe'],
    band: { href: '/#bewertungen', icon: 'next', cta: 'sp.verlegung.b.cta', media: { src: '/assets/img/svc/band-verlegung.jpg', width: 1400, height: 1050 } },
  },
  {
    slug: 'reparaturen', key: 'reparaturen', label: 'svc.repairs', wa: 'repair', image: '/assets/img/svc/reparaturen.jpg',
    icons: ['tiles', 'bucket', 'tools', 'camera'],
    // A wall of swatches from the catalogue
    band: { href: '/fliesen', icon: 'grid', cta: 'sp.reparaturen.b.cta', media: { src: '/assets/img/svc/band-reparaturen.jpg', width: 1400, height: 1050 } },
  },
];

export const getService = (slug: string) => SERVICES.find((service) => service.slug === slug);

/** Photo for step `n` (1–4) of a service's process, square. */
export const stepPhoto = (key: ServiceKey, n: number) => `/assets/img/svc/steps/${key}-${n}.jpg`;

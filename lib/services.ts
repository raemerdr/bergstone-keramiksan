/* Bergstone Keramiksan — service pages. They share one template (app/[service]/page.tsx);
   the copy lives in the dictionaries under sp.{key}.* and this file holds everything else. */
import type { IconName } from '@/components/icons';
import type { MessageKey } from './i18n';
import { PHOTO } from './site';
import { tilePhoto } from './tiles';
import type { WaTopic } from './whatsapp';

export type ServiceKey = 'beratung' | 'planung' | 'verlegung' | 'reparaturen';

export interface Service {
  slug: string;
  key: ServiceKey;
  /** Name in the breadcrumb and on the "more services" cards. */
  label: MessageKey;
  wa: WaTopic;
  image: string;
  /** Media-with-text band between the steps and the FAQ. */
  band: {
    href: string;
    tour?: boolean; // the link opens the 360° tour on the homepage
    icon: IconName;
    cta: MessageKey;
    media: { src: string; width: number; height: number; variant?: 'portrait' | 'tile' };
  };
}

export const SERVICES: Service[] = [
  {
    slug: 'beratung', key: 'beratung', label: 'mega.showroomAdvice', wa: 'consult', image: '/assets/img/svc/beratung.jpg',
    band: { href: '/#360', tour: true, icon: '360', cta: 'showroom.cta', media: { src: '/assets/img/tour/showroom-lounge.jpg', width: 1260, height: 1040 } },
  },
  {
    slug: 'planung-aufmass', key: 'planung', label: 'svc.planning', wa: 'planning', image: '/assets/img/svc/planung.jpg',
    band: { href: '/fliesen?art=grossformate', icon: 'grid', cta: 'sp.planung.b.cta', media: { src: tilePhoto('IMG_9894'), width: 1100, height: 700, variant: 'tile' } },
  },
  {
    slug: 'verlegung-montage', key: 'verlegung', label: 'cat.install', wa: 'install', image: '/assets/img/svc/verlegung.jpg',
    band: { href: '/#referenzen', icon: 'next', cta: 'sp.verlegung.b.cta', media: { src: PHOTO.bath, width: 550, height: 734, variant: 'portrait' } },
  },
  {
    slug: 'reparaturen', key: 'reparaturen', label: 'svc.repairs', wa: 'repair', image: '/assets/img/svc/reparaturen.jpg',
    band: { href: '/fliesen', icon: 'grid', cta: 'sp.reparaturen.b.cta', media: { src: tilePhoto('IMG_9944'), width: 1100, height: 700, variant: 'tile' } },
  },
];

export const getService = (slug: string) => SERVICES.find((service) => service.slug === slug);

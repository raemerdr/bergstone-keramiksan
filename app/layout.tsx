import type { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';
import { preconnect } from 'react-dom';
import { DevBar } from '@/components/dev-bar';
import { DialogProvider } from '@/components/dialogs';
import { I18nProvider } from '@/components/i18n';
import { Icon, Sprite } from '@/components/icons';
import { Boot } from '@/components/motion';
import { SiteDrawers } from '@/components/site-drawers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TourProvider } from '@/components/tour-triggers';
import { WaLink } from '@/components/wa-link';
import { clientMessages } from '@/lib/i18n';
import { getLang, getT } from '@/lib/i18n/server';
import { UPLOADS } from '@/lib/site';
import './globals.css';

const figtree = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-figtree' });   // latin-ext: "DANIŞMANLIK"
// Headings: Mediqa (regular only; the source files are in assets/fonts)
const mediqa = localFont({ src: './fonts/mediqa-regular.woff2', weight: '400', style: 'normal', variable: '--font-mediqa' });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('meta.title'), description: t('meta.description') };
}

export const viewport: Viewport = { themeColor: '#ffffff' };

// Runs before first paint: enables the hidden-until-revealed states, and drops them again
// if the app never reports `is-ready` (script error, very slow network).
const BOOT_SCRIPT = "document.documentElement.classList.add('js');setTimeout(function(){var h=document.documentElement;if(!h.classList.contains('is-ready'))h.classList.remove('js')},4000)";

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const lang = await getLang();
  const t = await getT();
  preconnect(new URL(UPLOADS).origin);

  return (
    <html lang={lang} className={`${figtree.variable} ${mediqa.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body id="top">
        <I18nProvider lang={lang} messages={clientMessages(lang)}>
          <DialogProvider>
            <TourProvider>
              <Sprite />
              <a className="skip-link" href="#main">{t('a11y.skip')}</a>
              <SiteHeader />
              {children}
              <SiteFooter />
              <WaLink topic="general" className="wa-fab" aria-label={t('a11y.whatsapp')}>
                <Icon name="wa" /><span>{t('fab.wa')}</span>
              </WaLink>
              {process.env.NODE_ENV === 'development' && <DevBar label={t('a11y.dev')} />}
              <SiteDrawers />
              <Boot />
            </TourProvider>
          </DialogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

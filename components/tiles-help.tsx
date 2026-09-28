import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { SplitHeading } from '@/components/motion';
import { WaLink } from '@/components/wa-link';
import { getT } from '@/lib/i18n/server';

/** The "Unsicher, welche Fliese passt?" section that closes the tile listing and every tile page. */
export async function TilesHelp() {
  const t = await getT();
  return (
    <section className="section section--soft tiles-help" aria-labelledby="help-title">
      <div className="container tiles-help__inner">
        <div>
          <SplitHeading className="h2" id="help-title">{t('tiles.help.title')}</SplitHeading>
          <p>{t('tiles.help.text')}</p>
        </div>
        <div className="tiles-help__actions">
          <Link className="btn btn--dark" href="/beratung">{t('mega.showroomAdvice')}</Link>
          <WaLink topic="consult" className="btn btn--light"><Icon name="wa" /><span>{t('footer.wa')}</span></WaLink>
          <Link className="link" href="/#360">{t('showroom.cta')}</Link>
        </div>
      </div>
    </section>
  );
}

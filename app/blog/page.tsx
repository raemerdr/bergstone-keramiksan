import type { Metadata } from 'next';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { PostCard } from '@/components/post-card';
import { POSTS } from '@/lib/blog';
import { getLang, getT } from '@/lib/i18n/server';
import { idx } from '@/lib/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t('blog.meta.title'), description: t('blog.meta.desc') };
}

export default async function BlogPage() {
  const t = await getT();
  const lang = await getLang();

  return (
    <main id="main">
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <nav className="crumbs" aria-label={t('crumb.label')}>
            <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('nav.blog')}</span>
          </nav>
          <SplitHeading as="h1" className="h1 page-hero__title" id="page-title">{t('nav.blog')}</SplitHeading>
          <p className="page-hero__intro">{t('blog.lead')}</p>
        </div>
      </section>

      <section className="section blog" aria-labelledby="page-title">
        <Reveal as="ul" kind="items" className="container blog-grid">
          {POSTS.map((post, i) => <PostCard key={post.slug} post={post} lang={lang} t={t} style={idx(i)} />)}
        </Reveal>
      </section>
    </main>
  );
}

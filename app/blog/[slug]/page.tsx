import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons';
import { Link } from '@/components/link';
import { Reveal, SplitHeading } from '@/components/motion';
import { PostCard, PostMeta } from '@/components/post-card';
import { TilesHelp } from '@/components/tiles-help';
import { POSTS, postBySlug, readingMinutes, type Block } from '@/lib/blog';
import { getLang, getT } from '@/lib/i18n/server';
import { SITE } from '@/lib/site';
import { idx } from '@/lib/ui';

// Only the posts in lib/blog.ts exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

async function load(props: PageProps<'/blog/[slug]'>) {
  const post = postBySlug((await props.params).slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const post = await load(props);
  const copy = post[await getLang()];
  return { title: `${copy.title} | ${SITE.name}`, description: copy.excerpt };
}

function Body({ blocks, tipLabel }: { blocks: Block[]; tipLabel: string }) {
  return blocks.map((block, i) => {
    if ('h' in block) return <h2 key={i}>{block.h}</h2>;
    if ('p' in block) return <p key={i}>{block.p}</p>;
    if ('list' in block) return <ul key={i} className="bullets">{block.list.map((item) => <li key={item}>{item}</li>)}</ul>;
    return (
      <aside key={i} className="post-tip">
        <p className="post-tip__label">{tipLabel}</p>
        <p>{block.tip}</p>
      </aside>
    );
  });
}

export default async function PostPage(props: PageProps<'/blog/[slug]'>) {
  const post = await load(props);
  const lang = await getLang();
  const t = await getT();
  const copy = post[lang];
  const more = POSTS.filter((other) => other !== post).slice(0, 3);

  return (
    <main id="main">
      <article aria-labelledby="page-title">
        <header className="post-hero">
          <div className="container post-hero__inner">
            <nav className="crumbs" aria-label={t('crumb.label')}>
              <Link href="/">{t('crumb.home')}</Link><span aria-hidden="true">/</span>
              <Link href="/blog">{t('nav.blog')}</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{copy.title}</span>
            </nav>
            <PostMeta category={copy.category} minutes={readingMinutes(copy)} t={t} />
            <SplitHeading as="h1" className="h1 post-hero__title" id="page-title">{copy.title}</SplitHeading>
            <p className="post-hero__lead">{copy.excerpt}</p>
          </div>
          <div className="container">
            <figure className="post-hero__media">
              <img src={post.image} width={1600} height={1067} fetchPriority="high" alt={copy.alt} />
            </figure>
          </div>
        </header>
        <div className="container">
          <div className="prose post-body">
            <Body blocks={copy.body} tipLabel={t('blog.tip')} />
            <p className="post-body__next">
              <Link className="btn btn--dark btn--arrow" href={post.href}><span>{copy.cta}</span><Icon name="arrow" /></Link>
            </p>
          </div>
        </div>
      </article>

      <section className="section post-more" aria-labelledby="more-title">
        <div className="container">
          <div className="section-head">
            <SplitHeading className="h2" id="more-title">{t('blog.more')}</SplitHeading>
            <Link className="link" href="/blog">{t('blog.all')}</Link>
          </div>
          <Reveal as="ul" kind="items" className="blog-grid">
            {more.map((other, i) => <PostCard key={other.slug} post={other} lang={lang} t={t} heading="h3" style={idx(i)} />)}
          </Reveal>
        </div>
      </section>

      <TilesHelp />
    </main>
  );
}

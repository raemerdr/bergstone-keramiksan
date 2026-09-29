import type { CSSProperties } from 'react';
import { Link } from '@/components/link';
import { readingMinutes, type Post } from '@/lib/blog';
import { fill, type Lang, type Translate } from '@/lib/i18n';

/** Category and reading time, above a post's title (cards and the post page). */
export function PostMeta({ category, minutes, t }: { category: string; minutes: number; t: Translate }) {
  return (
    <p className="post-meta"><span>{category}</span><span>{fill(t('blog.minutes'), { n: minutes })}</span></p>
  );
}

/** Blog post teaser: on /blog and under a post. The whole card links to the post. */
export function PostCard({ post, lang, t, heading: Heading = 'h2', style }: {
  post: Post; lang: Lang; t: Translate; heading?: 'h2' | 'h3'; style?: CSSProperties;
}) {
  const copy = post[lang];
  return (
    <li className="blog-card" style={style}>
      <Link className="blog-card__link" href={`/blog/${post.slug}`}>
        <span className="media media--3x2"><img src={post.image} alt="" loading="lazy" /></span>
        <PostMeta category={copy.category} minutes={readingMinutes(copy)} t={t} />
        <Heading className="blog-card__title">{copy.title}</Heading>
        <span className="blog-card__excerpt">{copy.excerpt}</span>
        <span className="link">{t('blog.read')}</span>
      </Link>
    </li>
  );
}

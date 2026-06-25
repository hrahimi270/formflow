import { Link } from 'react-router-dom';
import type { Post } from '../../lib/content';
import { formatDate } from '../../lib/format';
import { CategoryTag } from './CategoryPill';

export interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const fm = post.frontmatter;
  return (
    <article className={`post-card${featured ? ' post-card--featured' : ''}`}>
      <div className="post-card__media">
        {post.heroUrl ? (
          <img src={post.heroUrl} alt={fm.heroAlt} loading="lazy" decoding="async" />
        ) : null}
      </div>
      <div className="post-card__body">
        <div className="post-card__meta">
          <CategoryTag category={post.category} />
          {featured ? <span className="featured-flag">Featured</span> : null}
        </div>
        <h3 className="post-card__title">{fm.title}</h3>
        <p className="post-card__desc">{fm.description}</p>
        <span className="post-card__cta">
          <time dateTime={fm.publishedAt}>{formatDate(fm.publishedAt)}</time>
          {' · '}
          {post.readingTimeText}
        </span>
      </div>
      <Link className="post-card__link" to={post.path} aria-label={fm.title} />
    </article>
  );
}

import type { Post } from '../../lib/content';
import { formatDate } from '../../lib/format';

export default function PostMeta({ post }: { post: Post }) {
  const fm = post.frontmatter;
  const hasUpdate = fm.updatedAt && fm.updatedAt !== fm.publishedAt;
  return (
    <div className="post-meta">
      <time dateTime={fm.publishedAt}>{formatDate(fm.publishedAt)}</time>
      {hasUpdate ? (
        <>
          <span className="dot-sep" aria-hidden="true" />
          <span>Updated {formatDate(fm.updatedAt!)}</span>
        </>
      ) : null}
      <span className="dot-sep" aria-hidden="true" />
      <span>{post.readingTimeText}</span>
      {fm.tags?.length ? (
        <>
          <span className="dot-sep" aria-hidden="true" />
          <span className="tags">
            {fm.tags.map((t) => (
              <span className="tag" key={t}>
                #{t}
              </span>
            ))}
          </span>
        </>
      ) : null}
    </div>
  );
}

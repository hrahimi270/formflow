import type { Post } from '../../lib/content';
import { getRelatedPosts } from '../../lib/content';
import PostCard from './PostCard';

export default function RelatedPosts({ post }: { post: Post }) {
  const related = getRelatedPosts(post, 3);
  if (!related.length) return null;

  return (
    <section className="related" aria-label="Related posts">
      <h2>Keep reading</h2>
      <div className="related-grid">
        {related.map((p) => (
          <PostCard key={p.path} post={p} />
        ))}
      </div>
    </section>
  );
}

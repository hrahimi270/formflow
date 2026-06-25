import { Link } from 'react-router-dom';
import type { Category } from '../../lib/content';

/** Small static category tag for cards and post headers. */
export function CategoryTag({ category }: { category: Category }) {
  return <span className={`cat-tag ${category.accent}`}>{category.name}</span>;
}

export interface CategoryFilterProps {
  categories: Category[];
  /** Active category slug, or undefined for the "All" state. */
  activeSlug?: string;
  /** Optional per-category post counts. */
  counts?: Record<string, number>;
}

/** The category filter row on the blog index / category hubs. */
export function CategoryFilter({ categories, activeSlug, counts }: CategoryFilterProps) {
  return (
    <nav className="cat-filter" aria-label="Blog categories">
      <Link
        to="/blog"
        className={`cat-pill${!activeSlug ? ' is-active accent' : ''}`}
        aria-current={!activeSlug ? 'page' : undefined}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={`/blog/${c.slug}`}
          className={`cat-pill${activeSlug === c.slug ? ` is-active ${c.accent}` : ''}`}
          aria-current={activeSlug === c.slug ? 'page' : undefined}
        >
          {c.name}
          {counts ? <span className="count">{counts[c.slug] ?? 0}</span> : null}
        </Link>
      ))}
    </nav>
  );
}

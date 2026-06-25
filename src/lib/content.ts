/* ------------------------------------------------------------------ *
 * Blog content loader.
 *
 * Source of truth = MDX files under src/content/blog/<category>/<slug>/.
 * Frontmatter is read eagerly (cheap, drives the index + getStaticPaths);
 * each post's compiled MDX component is the heavy part and is rendered
 * directly from the eager module here (the blog is small — simple wins).
 * Co-located images are resolved to hashed, fingerprinted asset URLs.
 *
 * All exported types are exported (see CLAUDE.md TS export rule).
 * ------------------------------------------------------------------ */

import type { MDXContent } from 'mdx/types';

/* ----------------------------- types ------------------------------ */

export type CategoryAccent = 'accent' | 'valid' | 'violet';

export interface Category {
  slug: string;
  name: string;
  /** SEO/page title for the category hub. */
  title: string;
  description: string;
  /** Sort order in the index / nav. */
  order: number;
  /** Maps to an existing design-system accent token. */
  accent: CategoryAccent;
}

export interface PostSeo {
  /** Override the <title>. Defaults to frontmatter.title. */
  title?: string;
  /** Override the canonical URL. Rarely needed. */
  canonical?: string;
  /** Override the OG image (relative to the post folder). Defaults to hero. */
  ogImage?: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PostSchema {
  /** Adds HowTo or FAQPage JSON-LD on top of the always-present BlogPosting. */
  type?: 'HowTo' | 'FAQPage';
  steps?: HowToStep[];
  faq?: FaqItem[];
}

export interface PostFrontmatter {
  title: string;
  description: string;
  /** Hero image, relative to the post folder, e.g. "./hero.png". */
  hero: string;
  heroAlt: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** Defaults to the post folder name. */
  slug?: string;
  updatedAt?: string;
  draft?: boolean;
  featured?: boolean;
  tags?: string[];
  seo?: PostSeo;
  schema?: PostSchema;
  // NOTE: no author field, by design.
}

export interface Post {
  category: Category;
  categorySlug: string;
  slug: string;
  /** Route path WITHOUT the router basename, e.g. /blog/tutorials/my-post */
  path: string;
  frontmatter: PostFrontmatter;
  /** Fingerprinted hero asset URL (already prefixed with the base path). */
  heroUrl: string;
  /** Fingerprinted OG image asset URL. */
  ogImageUrl: string;
  readingTimeText: string;
  readingMinutes: number;
  /** Compiled MDX component. Render inside an <MDXProvider>. */
  Content: MDXContent;
}

/* --------------------------- raw globs ---------------------------- */

interface ReadingTime {
  text: string;
  minutes: number;
  words: number;
}

interface MdxModule {
  frontmatter: PostFrontmatter;
  default: MDXContent;
  // Injected by the remarkReadingTime plugin (see vite.config.ts).
  readingTime?: ReadingTime;
}

// Only matches <category>/<slug>/index.mdx (two segments) — so the top-level
// src/content/blog/_TEMPLATE/index.mdx is intentionally excluded.
const postModules = import.meta.glob<MdxModule>('../content/blog/*/*/index.mdx', {
  eager: true,
});

const imageModules = import.meta.glob('../content/blog/*/*/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const categoryModules = import.meta.glob<{ default: Category }>(
  '../content/blog/*/_category.json',
  { eager: true },
);

/* --------------------------- assembly ----------------------------- */

function resolveAsset(dir: string, ref: string): string | undefined {
  const clean = ref.replace(/^\.\//, '');
  return imageModules[`${dir}/${clean}`];
}

const categories: Category[] = Object.values(categoryModules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

const categoryBySlug: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
);

function fallbackCategory(slug: string): Category {
  return { slug, name: slug, title: slug, description: '', order: 99, accent: 'accent' };
}

const POST_KEY = /\/content\/blog\/([^/]+)\/([^/]+)\/index\.mdx$/;

const posts: Post[] = Object.entries(postModules)
  .map(([key, mod]): Post | null => {
    const match = key.match(POST_KEY);
    if (!match) return null;
    const categorySlug = match[1];
    const folderSlug = match[2];
    const dir = `../content/blog/${categorySlug}/${folderSlug}`;
    const fm = mod.frontmatter;
    const slug = fm.slug || folderSlug;
    const category = categoryBySlug[categorySlug] ?? fallbackCategory(categorySlug);
    const heroUrl = resolveAsset(dir, fm.hero) ?? '';
    const ogRef = fm.seo?.ogImage ?? fm.hero;
    const ogImageUrl = resolveAsset(dir, ogRef) ?? heroUrl;
    const rt = mod.readingTime ?? { text: '1 min read', minutes: 1, words: 0 };
    return {
      category,
      categorySlug,
      slug,
      path: `/blog/${categorySlug}/${slug}`,
      frontmatter: fm,
      heroUrl,
      ogImageUrl,
      readingTimeText: rt.text,
      readingMinutes: rt.minutes,
      Content: mod.default,
    };
  })
  .filter((p): p is Post => p !== null)
  // Drafts are hidden in production builds, visible in dev.
  .filter((p) => (import.meta.env.PROD ? !p.frontmatter.draft : true))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime(),
  );

/* ---------------------------- public API -------------------------- */

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((p) => p.categorySlug === categorySlug);
}

export function getPost(categorySlug: string, slug: string): Post | undefined {
  return posts.find((p) => p.categorySlug === categorySlug && p.slug === slug);
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug[slug];
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((p) => p.frontmatter.featured);
}

export function getRelatedPosts(post: Post, count = 3): Post[] {
  const sameCategory = posts.filter(
    (p) => p.categorySlug === post.categorySlug && p.slug !== post.slug,
  );
  if (sameCategory.length >= count) return sameCategory.slice(0, count);
  const rest = posts.filter(
    (p) => p.categorySlug !== post.categorySlug && p.slug !== post.slug,
  );
  return [...sameCategory, ...rest].slice(0, count);
}

/** vite-react-ssg getStaticPaths — relative, no leading slash. */
export function getAllPostPaths(): string[] {
  return posts.map((p) => `blog/${p.categorySlug}/${p.slug}`);
}

/** vite-react-ssg getStaticPaths for category hubs. */
export function getCategoryPaths(): string[] {
  return categories.map((c) => `blog/${c.slug}`);
}

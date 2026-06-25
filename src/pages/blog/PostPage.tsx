import { useParams } from 'react-router-dom';
import Seo from '../../components/seo/Seo';
import JsonLd from '../../components/seo/JsonLd';
import Breadcrumbs from '../../components/blog/Breadcrumbs';
import Prose from '../../components/blog/Prose';
import PostMeta from '../../components/blog/PostMeta';
import TableOfContents from '../../components/blog/TableOfContents';
import RelatedPosts from '../../components/blog/RelatedPosts';
import { CategoryTag } from '../../components/blog/CategoryPill';
import { NotFoundView } from '../NotFound';
import { getPost } from '../../lib/content';
import { blogPostingSchema, faqSchema, howToSchema, type JsonLdObject } from '../../lib/schema';

export function Component() {
  const { category, slug } = useParams();
  const post = category && slug ? getPost(category, slug) : undefined;

  if (!post) {
    return (
      <NotFoundView
        title="Post not found"
        message="That post doesn't exist or has moved. Browse the blog instead."
      />
    );
  }

  const fm = post.frontmatter;
  const Content = post.Content;

  const schemas: JsonLdObject[] = [blogPostingSchema(post)];
  const howTo = howToSchema(post);
  if (howTo) schemas.push(howTo);
  const faq = faqSchema(post);
  if (faq) schemas.push(faq);

  const published = new Date(fm.publishedAt).toISOString();
  const modified = new Date(fm.updatedAt ?? fm.publishedAt).toISOString();

  return (
    <article className="post">
      <Seo
        title={fm.seo?.title ?? fm.title}
        description={fm.description}
        image={post.ogImageUrl || undefined}
        imageAlt={fm.heroAlt}
        canonical={fm.seo?.canonical}
        type="article"
        publishedTime={published}
        modifiedTime={modified}
      />
      <JsonLd data={schemas} />

      <div className="post-head">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.category.name, path: `/blog/${post.categorySlug}` },
            { name: fm.title, path: post.path },
          ]}
        />
        <CategoryTag category={post.category} />
        <h1 className="post-title">{fm.title}</h1>
        <p className="post-desc">{fm.description}</p>
        <PostMeta post={post} />
      </div>

      {post.heroUrl ? (
        <figure className="post-hero">
          {/* Hero is the LCP element — load eagerly with high priority. */}
          <img src={post.heroUrl} alt={fm.heroAlt} decoding="async" fetchPriority="high" />
        </figure>
      ) : null}

      <div className="post-layout">
        <div className="post-body" id="post-body">
          <Prose>
            <Content />
          </Prose>
        </div>
        <aside className="post-aside">
          <TableOfContents containerId="post-body" />
        </aside>
      </div>

      <RelatedPosts post={post} />
    </article>
  );
}

import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  canonicalUrl,
  absoluteUrl,
  defaultOgImage,
} from '../../config/site';

export interface SeoProps {
  /** Page title (brand is appended). Omit on the homepage for the tagline title. */
  title?: string;
  description?: string;
  /** Image URL (absolute or root-relative). Defaults to the site OG card. */
  image?: string;
  /** Alt text for the social image. */
  imageAlt?: string;
  /** Override the canonical URL. Defaults to the current pathname. */
  canonical?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Per-route document head. Uses vite-react-ssg's <Head> so tags are captured
 * during static pre-render (real HTML for crawlers and AI), and kept in sync
 * on client-side navigation.
 */
export default function Seo({
  title,
  description,
  image,
  imageAlt,
  canonical,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
}: SeoProps) {
  const { pathname } = useLocation();
  const url = canonical ?? canonicalUrl(pathname);
  const desc = description ?? SITE_DESCRIPTION;
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const socialTitle = title ?? `${SITE_NAME} — ${SITE_TAGLINE}`;
  const ogImage = image ? absoluteUrl(image) : defaultOgImage(import.meta.env.BASE_URL);
  const ogImageAlt = imageAlt ?? socialTitle;
  // A page with its own image (post hero, landscape) suits the large card;
  // the square brand-logo fallback suits the small summary card.
  const twitterCard = image ? 'summary_large_image' : 'summary';

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {/* No canonical for noindex pages (e.g. 404). */}
      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {type === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === 'article' && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
    </Head>
  );
}

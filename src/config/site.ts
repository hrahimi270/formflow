/* ------------------------------------------------------------------ *
 * Single source of truth for site-wide identity, canonical URLs and
 * SEO defaults. Switching to a custom domain later is a one-line change
 * here (SITE_ORIGIN + BASE_PATH) plus the GITHUB_PAGES_BASE repo var.
 * ------------------------------------------------------------------ */

/** Scheme + host only, no path, no trailing slash. */
export const SITE_ORIGIN = 'https://hrahimi270.github.io';

/** Deploy sub-path (matches Vite `base`). Empty string once on a root domain. */
export const BASE_PATH = '/formflow';

/** Canonical site root, e.g. https://hrahimi270.github.io/formflow */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const SITE_NAME = 'FormFlow';
export const SITE_TAGLINE = 'The headless form builder for Strapi v5';
export const SITE_DESCRIPTION =
  'Build forms visually in the Strapi v5 admin and render them anywhere with headless ' +
  'React and Vue SDKs, over a clean REST API. Open-core, MIT-licensed free tier.';

export const REPO_URL = 'https://github.com/hrahimi270/strapi-plugin-formflow';
export const SDK_REPO_URL = 'https://github.com/hrahimi270/formflow-sdk';
export const NPM_URL = 'https://www.npmjs.com/package/@formflowjs/strapi-plugin-formflow';

/** Default social card for non-article pages: the square brand logo
 * (public/logo.png, 500x500). Post pages override this with their own hero.
 * Point this at a dedicated 1200x630 card here if you create one. */
export const DEFAULT_OG_IMAGE_PATH = 'logo.png';

export interface OrgInfo {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export const ORG: OrgInfo = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [REPO_URL, SDK_REPO_URL, NPM_URL],
};

/**
 * Turn any URL into an absolute one suitable for canonical/OG tags.
 * - Already-absolute (http...) URLs pass through.
 * - Root-absolute paths (Vite asset URLs like "/formflow/assets/x.png", which
 *   already include BASE_PATH) get the origin prepended.
 * - Bare relative paths get origin + "/".
 */
export function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${SITE_ORIGIN}${url}`;
  return `${SITE_ORIGIN}/${url}`;
}

/**
 * Canonical URL for a react-router pathname (pathname excludes the basename,
 * always starts with "/"). "/" maps to the site root.
 */
export function canonicalUrl(pathname: string): string {
  if (pathname === '/' || pathname === '') return `${SITE_URL}/`;
  return `${SITE_URL}${pathname}`;
}

/** Absolute URL to the default OG image (respects BASE_PATH at runtime). */
export function defaultOgImage(baseUrl: string): string {
  return absoluteUrl(`${baseUrl}${DEFAULT_OG_IMAGE_PATH}`);
}

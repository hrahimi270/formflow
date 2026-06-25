import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import JsonLd from '../seo/JsonLd';
import { breadcrumbSchema } from '../../lib/schema';
import { canonicalUrl } from '../../config/site';

export interface Crumb {
  name: string;
  /** Route path (without basename), e.g. /blog/tutorials. */
  path: string;
}

/** Visual breadcrumb trail + matching BreadcrumbList JSON-LD. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items.map((c) => ({ name: c.name, url: canonicalUrl(c.path) })))} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={c.path}>
              {i > 0 ? (
                <span className="sep" aria-hidden="true">
                  /
                </span>
              ) : null}
              {isLast ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link to={c.path}>{c.name}</Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}

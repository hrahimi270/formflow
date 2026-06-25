import { Children, isValidElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Link } from 'react-router-dom';

/* Internal route links use the router; hashes and external links stay plain. */
function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return <Link to={href}>{children}</Link>;
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}

/* Images resolve to fingerprinted URLs via rehype-mdx-import-media. */
function MdxImage(props: ComponentPropsWithoutRef<'img'>) {
  return <img loading="lazy" decoding="async" {...props} />;
}

/* A standalone image becomes a figure + caption (from its alt). MDX wraps
   block images in a <p>, so we unwrap that case to keep the HTML valid;
   images inline in a sentence are left as-is. */
function MdxParagraph({ children }: { children?: ReactNode }) {
  const items = Children.toArray(children);
  if (items.length === 1) {
    const only = items[0];
    if (isValidElement(only) && only.type === MdxImage) {
      const alt = (only.props as { alt?: string }).alt;
      return (
        <figure>
          {only}
          {alt ? <figcaption>{alt}</figcaption> : null}
        </figure>
      );
    }
  }
  return <p>{children}</p>;
}

/* Wrap tables so they scroll on narrow screens instead of overflowing. */
function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="table-wrap" role="region" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="6.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

export type CalloutType = 'tip' | 'note' | 'warning';

const CALLOUT_LABEL: Record<CalloutType, string> = {
  tip: 'Tip',
  note: 'Note',
  warning: 'Warning',
};

export function Callout({ type = 'note', children }: { type?: CalloutType; children: ReactNode }) {
  return (
    <div className={`callout callout--${type}`}>
      <span className="callout__icon">
        <InfoIcon />
      </span>
      <div className="callout__body">
        <span className="callout__label">{CALLOUT_LABEL[type]}</span>
        {children}
      </div>
    </div>
  );
}

/** Wraps a markdown ordered list to render it as numbered step badges. */
export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  img: MdxImage,
  p: MdxParagraph,
  table: MdxTable,
  Callout,
  Steps,
};

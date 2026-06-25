import type { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from './MDXComponents';

/** Long-form typography scope + MDX component mapping for post bodies. */
export default function Prose({ children }: { children: ReactNode }) {
  return (
    <MDXProvider components={mdxComponents}>
      <div className="prose">{children}</div>
    </MDXProvider>
  );
}

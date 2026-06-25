import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Builds an "on this page" list from the rendered post headings (which carry
 * rehype-slug ids). Runs after hydration — it's a progressive enhancement, so
 * it renders nothing during SSR and when a post has no headings.
 */
export default function TableOfContents({ containerId = 'post-body' }: { containerId?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    setItems(
      headings
        .filter((h) => h.id)
        .map((h) => ({
          id: h.id,
          text: h.textContent ?? '',
          level: h.tagName === 'H3' ? 3 : 2,
        })),
    );
  }, [containerId]);

  if (items.length < 2) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <h2>On this page</h2>
      <ol>
        {items.map((item) => (
          <li key={item.id} className={`lvl-${item.level}`}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

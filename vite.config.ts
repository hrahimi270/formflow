import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import { toString as mdastToString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

// Computes reading time from the MDX body and exposes it as a named ESM export
// (`readingTime`) on the compiled module — reliable, unlike reading a `.mdx?raw`
// import (which the MDX plugin intercepts).
function remarkReadingTime() {
  return (tree, file) => {
    const stats = getReadingTime(mdastToString(tree));
    const data = {
      text: stats.text,
      minutes: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
    };
    file.data.readingTime = data;
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: `export const readingTime = ${JSON.stringify(data)}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'readingTime' },
                    init: {
                      type: 'ObjectExpression',
                      properties: [
                        prop('text', { type: 'Literal', value: data.text }),
                        prop('minutes', { type: 'Literal', value: data.minutes }),
                        prop('words', { type: 'Literal', value: data.words }),
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}

function prop(name, value) {
  return {
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    kind: 'init',
    key: { type: 'Identifier', name },
    value,
  };
}

// `base` must be an ABSOLUTE path so deep routes like /blog/tutorials/<slug>/
// resolve assets and the react-router basename correctly.
//   - dev:   `/`
//   - build: `/formflow/` (GitHub Pages project site) unless GITHUB_PAGES_BASE
//            overrides it (e.g. set it to `/` once a custom domain is live).
export default defineConfig(({ command }) => ({
  base: process.env.GITHUB_PAGES_BASE || (command === 'build' ? '/formflow/' : '/'),
  plugins: [
    // MDX must run BEFORE @vitejs/plugin-react so the React plugin sees JSX.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
          remarkReadingTime,
        ],
        rehypePlugins: [
          // Resolve relative ![](./img) paths to fingerprinted asset imports.
          rehypeMdxImportMedia,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: 'wrap', properties: { className: ['heading-anchor'] } },
          ],
          // Syntax highlighting baked in at build time (zero runtime cost).
          // keepBackground:false lets blog.css own the code-block surface.
          [rehypePrettyCode, { theme: 'github-light', keepBackground: false }],
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}));

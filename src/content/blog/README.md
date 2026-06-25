# Blog content authoring guide

All blog content lives here as MDX. No CMS, no database — add a folder, write a
file, rebuild. Everything is pre-rendered to static HTML with its own SEO tags
and structured data.

## Folder layout

```
src/content/blog/
├── <category>/
│   ├── _category.json          ← category metadata (see below)
│   └── <post-slug>/
│       ├── index.mdx           ← the post (frontmatter + body)
│       ├── hero.png            ← hero image (also the default social card)
│       └── *.png|jpg|svg…      ← any inline images, co-located with the post
├── _TEMPLATE/                  ← copy this to start a new post
└── README.md                   ← this file
```

The **folder name is the URL slug**. A post at
`tutorials/building-your-first-form/` is served at
`/blog/tutorials/building-your-first-form`.

## Adding a post

1. Copy `_TEMPLATE/` into a category folder and rename it to your slug
   (lowercase, hyphens, no spaces).
2. Replace `hero.png` with your hero image. ~1200×630 gives the best social card.
3. Fill in the frontmatter and write the body.
4. `npm run dev` to preview, `npm run build` to verify it pre-renders.

## Adding a category

Create `src/content/blog/<slug>/_category.json`:

```json
{
  "slug": "comparisons",
  "name": "Comparisons",
  "title": "FormFlow Comparisons",
  "description": "How FormFlow compares to other form tools.",
  "order": 4,
  "accent": "accent"
}
```

`accent` is one of `accent` (cobalt), `valid` (green), `violet` — these map to the
site's existing design tokens. The category appears automatically in the blog
index, nav and routing. No code change needed.

## Frontmatter reference

| Key          | Required | Notes |
| ------------ | :------: | ----- |
| `title`      | ✔ | Post title + default `<title>`. |
| `description`| ✔ | Meta description / social summary. Aim for 150–160 chars. |
| `hero`       | ✔ | Path relative to the post folder, e.g. `./hero.png`. |
| `heroAlt`    | ✔ | Alt text for the hero (accessibility + SEO). |
| `publishedAt`| ✔ | ISO date `YYYY-MM-DD`. Drives sort order. |
| `slug`       |   | Overrides the folder-name slug. |
| `updatedAt`  |   | Shown as "Updated". Bump on meaningful edits (freshness signal). |
| `draft`      |   | `true` hides the post from production builds (still visible in dev). |
| `featured`   |   | `true` gives the post a larger card on `/blog`. |
| `tags`       |   | String array. |
| `seo`        |   | `{ title?, canonical?, ogImage? }` overrides. |
| `schema`     |   | Adds `HowTo` or `FAQPage` JSON-LD. See `_TEMPLATE`. |

There is intentionally **no author field**.

## MDX components available in the body

- `<Callout type="tip|note|warning">…</Callout>`
- `<Steps>` with an ordered list inside
- GitHub-flavored Markdown: tables, task lists, strikethrough
- Fenced code blocks are syntax-highlighted at build time
- Headings get anchor links automatically; `## H2` and `### H3` feed the
  table of contents

## SEO that happens automatically

Every post gets: a unique `<title>`, meta description, canonical URL, Open Graph
and Twitter tags (OG image = the hero), `BlogPosting` + `BreadcrumbList`
JSON-LD, an entry in `sitemap.xml`, and breadcrumb + related-post internal links.
Add `schema.type: HowTo` or `FAQPage` for richer results on tutorials.

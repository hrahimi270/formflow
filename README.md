<p align="center">
  <img src="assets/logo.jpg" alt="FormFlow" width="120" height="120" />
</p>

<h1 align="center">FormFlow website</h1>

Single-page static website for the FormFlow Strapi plugin. It is Vite + React and builds to plain static files in `dist/`, so it works on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages

The included workflow deploys `dist/` from the `main` branch using GitHub Pages Actions.

If you deploy under a project path and assets need a fixed base, set this repository variable before building:

```bash
GITHUB_PAGES_BASE=/your-repo-name/ npm run build
```

By default, Vite uses `./` as the asset base, which is friendly to both user/organization Pages and project Pages.

## Product screenshots

Real captures of the FormFlow admin live in `public/shots/` (`builder.png`, `inbox.png`,
`integrations.png`, `forms-list.png`) and render in the "Inside the admin" gallery section. To
refresh them, replace the files in `public/shots/` (keep the names and a ~16:10 ratio) and rebuild.

## Stack

Vite + React + TypeScript, no runtime data fetching — a fully static single page. Type face stack is
Bricolage Grotesque (display) · Hanken Grotesk (UI) · JetBrains Mono (code), loaded from Google Fonts.

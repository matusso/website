# burso.eu — personal blog

My personal site and writing hub lives at [burso.eu](https://burso.eu). It combines long-form blog posts, project notes, and quick blurbs about what I am working on. The site is intentionally lightweight, but it still ships conveniences such as syntax-highlighted MDX, embedded media, and Pagefind-powered search so readers can dig through the archive without friction.

## Highlights

- **Astro 5 + custom Spectre theme** for fast static output with a few island components.
- **Content collections** back every section (posts, projects, resume bits, socials) so Markdown/JSON is the single source of truth.
- **Markdown + MDX + astro-expressive-code** give pleasant prose, code samples, and callouts with a single authoring workflow.
- **astro-embed** handles Tweets, YouTube, and Vimeo without having to handcraft iframes.
- **Pagefind search** is generated automatically after every build (`pnpm run build` triggers `postbuild`).
- **Node adapter (standalone)** keeps deployment flexible: static assets + lightweight server bundle run anywhere that can execute Node 20+.

## Tech stack

| Layer | Details |
| --- | --- |
| Framework | [Astro 5](https://astro.build) with standalone Node adapter |
| Styling | Custom Spectre theme, global styles in `src/styles`, CSS modules per component |
| Content | `src/content` collections managed through `src/content.config.ts` |
| Components | Astro + a few vanilla TypeScript utilities in `src/components` and `src/scripts` |
| Tooling | PNPM, TypeScript, Vite, Biome for lint/format, Pagefind for search index |

## Repository tour

```
src/
 ├─ pages/          # Route endpoints for home, blog index, projects, 404, Pagefind UI
 ├─ layouts/        # Base page shells (blog post, project, default)
 ├─ components/     # Reusable cards, navigation, hero blocks, etc.
 ├─ content/        # Markdown/MDX + JSON collections for posts, projects, socials, tags
 ├─ assets/         # Local images referenced from content
 ├─ styles/         # Global stylesheets and theme tokens
 └─ scripts/        # Build/runtime helpers (e.g., TOC generation)
public/             # Static files copied verbatim
astro.config.ts     # Integrations, theme hook, site metadata
```

## Getting started

1. **Prereqs:** Node 20+ and [pnpm](https://pnpm.io/) `>=9`.
2. **Install:** `pnpm install`
3. **Develop:** `pnpm dev` (opens Astro on http://localhost:4321 by default)
4. **Lint/format:** `pnpm biome check .`
5. **Build:** `pnpm build` (emits a static site to `dist/` and runs Pagefind to index `dist/client`)
6. **Preview the production build:** `pnpm preview`
7. **Serve the standalone bundle:** `pnpm start`

## Authoring content

All structured data lives under `src/content` and is validated against the collection schemas in `src/content.config.ts`. A few quick references:

### Blog posts (`src/content/posts`)

```md
---
title: "F5 BIG-IP iControl REST vulnerability CVE-2022-1388"
createdAt: 2022-05-09
description: "Discovered F5 BIG-IP iControl REST vulnerability CVE-2022-1388 before it was published."
tags: ["guide"]        # must reference ids in src/content/tags.json
draft: false
image: "../assets/f5-black.jpg"
---

Long-form Markdown or MDX content goes here; MDX lets you import components or embeds.
```

- `updatedAt` is optional if you want to display last edits.
- `astro-embed` imports (e.g., `<Tweet id="..."/>`) can be used inside MDX files out of the box.

### Projects (`src/content/projects`)

```md
---
title: "DEF CON talk"
description: "Slides and tooling from my DEF CON presentation."
date: 2024-08-10
image: "../assets/defcon-cover.png"
link: "https://github.com/matusso/talk"
info:
  - text: "Slides"
    icon: { type: "lucide", name: "file-text" }
    link: "https://.../slides.pdf"
---
```

### Quick info, socials, work experience

- `info.json`, `socials.json`, and `work.json` drive the hero, contact column, and resume timeline.
- Update or append entries to have them render automatically; the schema ensures IDs stay unique.

## Deployment

`astro.config.ts` sets `output: "static"` and uses the standalone Node adapter. That means you can:

- Deploy the static `dist/client` folder to any CDN.
- Run `pnpm start` (which executes `dist/server/entry.mjs`) on a small VPS or container if server-rendered routes or middleware are ever added.
- Host on platforms like Netlify, Vercel, Fly.io, or Cloudflare Pages; just ensure the build command is `pnpm run build`.

Because the build already runs Pagefind, remember to deploy both `dist/client` (static assets) and `dist/pagefind` (search index) if your platform requires manual uploads.

## Useful scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local development server with hot reload |
| `pnpm build` | Production build (static assets + SSR bundle) |
| `pnpm preview` | Preview production output locally |
| `pnpm start` | Run the standalone Node server from `dist/server` |
| `pnpm biome check .` | Lint/format via Biome |

## Notes

- The site URL (`site`) is set to `https://burso.eu` in `astro.config.ts`. Update this if you fork the project.
- Icons are resolved through Lucide and Simple Icons. When referencing them in JSON front matter, ensure the `type` and `name` match available icon IDs.
- Pagefind requires the built files to live under `dist/client`. If you change Astro’s output target, update the `postbuild` script accordingly.

Enjoy the read—and if you notice something odd or have a feature idea, open an issue or ping me on any of the socials listed on the homepage.

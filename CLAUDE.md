# CLAUDE.md

Personal resume/portfolio website for Carlos Monti. Built with Next.js 16, React 19, TypeScript, and CSS Modules. **Hosted on Vercel** (carlosmonti.com); a secondary OpenNext build runs on Cloudflare Workers at www.xmontc.xyz.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run build:cloudflare # Build for Cloudflare Workers (OpenNext)
npm run deploy:cloudflare # Build + deploy to Cloudflare
npm run lint             # ESLint
npm run test             # Vitest (run once)
npm run test:watch       # Vitest (watch mode)
```

## Architecture

### Data Flow
All resume content lives in `src/data/resume.ts` → typed by `src/types/resume.ts` → passed as props from `src/app/page.tsx` to section components.
**IMPORTANT**: `resume.ts` is the single source of truth: page metadata, `/resume.json` and `/llms.txt` are derived from it, and `npx xmontc` syncs `/resume.json` before each publish. LinkedIn is updated by hand from the same copy.

### Component Structure
```
src/
├── app/              # Next.js App Router (layout, page, globals.css, sitemap)
├── components/
│   ├── layout/       # Header, Footer
│   ├── sections/     # Hero, About, Experience, Projects
│   └── ui/           # SocialLinks, ThemeToggle
├── data/             # Resume content (resume.ts)
├── hooks/            # useReducedMotion
├── lib/              # Animation variants (Motion)
├── providers/        # ThemeProvider (next-themes)
└── types/            # TypeScript types
```

### Key Patterns
- **IMPORTANT**: CSS Modules for styling, design tokens via CSS custom properties in `globals.css` — no Tailwind, no magic numbers
- Social links toggled via `enabled: boolean` in `src/data/resume.ts`
- Motion library for animations with `useReducedMotion` hook to respect user preferences
- `'use client'` only on components that need interactivity (Header, Hero, ThemeToggle)
- React Compiler enabled via `babel-plugin-react-compiler`

## Tech Stack
- Next.js 16 + React 19 + TypeScript
- CSS Modules + CSS custom properties (design tokens)
- Motion (framer-motion successor) for animations
- next-themes for dark/light mode
- react-icons for social icons
- Vitest + Testing Library for tests
- Node 22

## Deployment
- **carlosmonti.com is served by Vercel** — team `xmontc`, project `resume`, git-connected to this repo (push to `master` → production). The domain is registered at Vercel and its nameservers are Vercel's. **Never delete that Vercel project**: it takes the site down (it happened on 2026-10-17; see `docs/GOTCHAS.md`).
- Push to `master` also runs CI (lint + build) and "Deploy to Cloudflare Workers", which publishes the OpenNext build to a worker serving `www.xmontc.xyz` (project subdomains live there). Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
- Before touching hosting/DNS: `dig NS carlosmonti.com` and `curl -I https://carlosmonti.com`; after any change, curl the public domain again.

## Design Context

### Users
Recruiters, hiring managers, and engineering leads evaluating Carlos as a frontend candidate. The site must load fast, scan well, and leave a professional impression within seconds.

### Brand Personality
**Modern, minimalist, elegant.** Confident and direct — lets the work speak. The craft is in the restraint and polish.

### Emotional Goal
Evoke **confidence and competence**: "This candidate knows what they're doing, is serious, and is reliable."

### Aesthetic Direction
- **Color**: Teal accent in OKLCH on teal-tinted neutral palette — light `oklch(0.58 0.1 175)`, dark `oklch(0.80 0.14 175)`. Accent is **rationed**: section-number kickers, links, the hero accent line + prompt `$`, and project status dots only.
- **Typography** (via `next/font/google`): **Bricolage Grotesque** for display/headings/name, **Instrument Sans** for body, **IBM Plex Mono** for technical signals (kickers, dates, tech tags, links, the hero terminal prompt, version footer)
- **Motion**: Subtle fade-in and stagger via the Motion library, centralized through a single `<MotionConfig reducedMotion="user">` — preserves opacity fades, suppresses positional movement for reduced-motion users
- **Layout**: Editorial, no cards — Projects is a divided list, Experience a date-column grid
- **Developer signals**: hero terminal prompt (`charly@portfolio:~$ whoami` + blinking caret), project status dots, version-string footer
- **Hero scene**: a procedural WebGL2 shader behind the hero, picked at random per load — *Horizon* (ocean at eye level, name sitting on the horizon line, CRT/magenta) or *Shore* (top-down beach, the name is the coastline and waves break on the letters, dithered noon). The hero is its own screen: scene config (`src/components/sections/Hero/scenes/*.ts`) sets text/accent colors, independent of the site theme and of the teal accent rule. The `π` button (bottom right) opens a panel to pick the scene, presets and every shader parameter; the scene is always drawn at random on load (picking one in the panel lasts the session only); parameters persist in `localStorage`; `?scene=horizon|shore` forces one for a single load (shareable links). The `<h1>` stays in the DOM (shore paints it transparent and rasterizes it into the shader mask). Reduced motion → single frame; no WebGL2 → CSS gradient fallback. Playgrounds that generated the defaults: `docs/playground/hero-ocean.html`, `hero-shore.html`.

### Design Principles
1. **Content first** — Design serves the content, never competes with it
2. **Quiet confidence** — Professional polish without excess
3. **Developer identity** — Mono signals (terminal prompt, status dots, version string), numbered section kickers
4. **Consistent tokens** — All values from CSS custom properties, no magic numbers
5. **Accent rationing** — Teal appears only where listed in Aesthetic Direction; adding it elsewhere breaks the restraint
6. **Accessible by default** — WCAG AA, focus-visible, skip-to-content, reduced motion

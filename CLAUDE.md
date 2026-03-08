# CLAUDE.md

Personal resume/portfolio website for Carlos Monti. Built with Next.js 16, React 19, TypeScript, and CSS Modules. Deployed to Cloudflare Workers via OpenNext.

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
- Push to `master` → CI (lint + build) + deploy to Cloudflare Workers
- **IMPORTANT**: Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

## Design Context

### Users
Recruiters, hiring managers, and engineering leads evaluating Carlos as a frontend candidate. The site must load fast, scan well, and leave a professional impression within seconds.

### Brand Personality
**Modern, minimalist, elegant.** Confident and direct — lets the work speak. The craft is in the restraint and polish.

### Emotional Goal
Evoke **confidence and competence**: "This candidate knows what they're doing, is serious, and is reliable."

### Aesthetic Direction
- **Color**: Teal accent (`#0d9488` light / `#2dd4bf` dark) on neutral slate palette
- **Typography**: Inter (body) + JetBrains Mono (code/technical elements)
- **Motion**: Subtle fade-in and stagger. Always respect `prefers-reduced-motion`
- **Details**: Numbered section headings with decorative line, timeline with accent dots, mono-font tech tags

### Design Principles
1. **Content first** — Design serves the content, never competes with it
2. **Quiet confidence** — Professional polish without excess
3. **Developer identity** — Mono font accents, numbered sections signal "I build things"
4. **Consistent tokens** — All values from CSS custom properties, no magic numbers
5. **Accessible by default** — WCAG AA, focus-visible, skip-to-content, reduced motion

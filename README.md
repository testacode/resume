# carlosmonti.com

My portfolio. Next.js 16, React 19, TypeScript, CSS Modules, deployed to Cloudflare Workers with OpenNext.

The hero is two procedural WebGL2 shader scenes, picked at random per load:

- **Horizon** — an ocean at eye level; the name sits on the horizon line.
- **Shore** — a top-down beach; the name is the coastline and the waves break on the letters (the `<h1>` is rasterized into the shader, and stays in the DOM for accessibility).

The `π` button opens a panel with presets and every shader parameter, persisted per visitor. Sea ambience is a CC0 recording cut into seamless loops (`docs/hero-audio.md`). Reduced motion renders a single frame; without WebGL2 the hero falls back to a CSS gradient.

The scenes were designed in two self-contained playgrounds you can open in a browser:
[`docs/playground/hero-ocean.html`](https://raw.githack.com/testacode/resume/master/docs/playground/hero-ocean.html) ·
[`docs/playground/hero-shore.html`](https://raw.githack.com/testacode/resume/master/docs/playground/hero-shore.html)

Same content as the terminal version: `npx xmontc` ([source](https://github.com/testacode/xmontc)). `src/data/resume.ts` is the single source of truth; `/resume.json` and `/llms.txt` derive from it.

## Commands

```bash
npm run dev               # dev server
npm run build             # production build
npm run deploy:cloudflare # OpenNext build + wrangler deploy
npm run lint && npm test  # ESLint, Vitest
```

## License

Code: MIT. Site content (resume text, CV files, name and likeness): all rights reserved. See `LICENSE`.

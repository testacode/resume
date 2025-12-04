# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal resume/portfolio website built with React and Vite, deployed to GitHub Pages.

## Commands

```bash
# Development
npm run dev          # Start dev server with HMR

# Build
npm run build        # Production build (local)
npm run build:github # Production build for GitHub Pages (sets base=/resume/)

# Quality
npm run lint         # ESLint with zero warnings allowed

# Utilities
npm run preview      # Preview production build locally
npm run analyze      # Bundle analysis with visualizer
npm run nuke         # Clean dist and node_modules
npm run generate-images  # Generate optimized avatar images
```

## Architecture

### Data Flow
All resume content is centralized in `src/resumeData.jsx` which exports a `data` object. This object is passed as props through `App.jsx` to child components:

- `data.main` → Header, About, Footer (personal info, social links)
- `data.resume` → Resume (education, work history, skills)
- `data.testimonials` → Testimonials (currently unused in App.jsx)

### Component Structure
```
src/
├── App.jsx           # Root component, initializes PostHog analytics
├── main.jsx          # React entry point
├── resumeData.jsx    # All resume content and social icons
├── Components/       # Layout components (Header, Footer, Resume)
└── Pages/            # Section components (About, Contact, Testimonials)
```

### Key Patterns
- Components use PropTypes for runtime prop validation
- Smooth scroll navigation implemented in Header via `handleScroll`
- Social links can be toggled via `enabled: boolean` in `resumeData.jsx`
- PostHog analytics only initializes in production (`import.meta.env.PROD`)

### Build Configuration
Vite config includes:
- Gzip and Brotli compression for assets >10kb
- Manual chunk splitting: vendor-react, vendor-analytics, vendor-icons, vendor-other
- Image optimization via vite-plugin-image-optimizer
- Console/debugger statements stripped in production
- Terser minification

## Tech Stack
- React 18 with Vite 5
- PostHog for analytics
- react-icons for social media icons
- Static CSS in `public/css/` (Font Awesome, Fontello, custom fonts)

## Deployment
Pushes to `master` trigger GitHub Actions workflow that builds with `npm run build:github` and deploys to GitHub Pages.

## Node Version
Requires Node 18 (see `.nvmrc`)

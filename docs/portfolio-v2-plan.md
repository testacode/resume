# Plan: Portfolio v2 - Next.js + TypeScript

## Resumen
Nuevo portfolio minimalista elegante usando Next.js 15, TypeScript, CSS Modules y Motion. Desarrollo en branch `feature/portfolio-v2`, deploy a Vercel (proyecto existente: xmontc/resume).

## Decisiones Clave
- **Git**: Branch simple (no worktree)
- **Componentes**: Custom (no Mantine) - bundle liviano, control total del diseño
- **Deploy**: Vercel (auto-deploy a producción al merge a master, previews en PRs)

## Decisiones de Diseño
- **Estilo**: Minimalista elegante, paleta blanco/gris con accent sutil
- **Skills**: Integrados en cada experiencia laboral (no sección separada)
- **Animaciones**: Sutiles (fade-in, hover states, scroll reveal)
- **Dark/Light mode**: Sí, con detección de preferencia del sistema

## Tech Stack
| Área | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript (strict) |
| Estilos | CSS Modules + CSS Custom Properties |
| Animaciones | Motion (Framer Motion v12) |
| Theming | next-themes |
| Icons | react-icons |
| Testing | Vitest + React Testing Library |

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Root layout + providers
│   ├── page.tsx            # Single-page portfolio
│   └── globals.css         # CSS custom properties
├── components/
│   ├── layout/
│   │   ├── Header/         # Nav fija + theme toggle
│   │   └── Footer/         # Social links + copyright
│   ├── sections/
│   │   ├── Hero/           # Nombre, título, tagline, CTA
│   │   ├── About/          # Bio, contacto, download CV
│   │   └── Experience/     # Timeline con tech stack integrado
│   └── ui/
│       ├── Button/
│       ├── ThemeToggle/
│       ├── SocialLinks/
│       └── AnimatedSection/
├── data/
│   └── resume.ts           # Datos centralizados con tipos
├── hooks/
│   ├── useScrollSpy.ts
│   └── useReducedMotion.ts
├── lib/
│   └── animations.ts       # Variantes de Motion
└── types/
    └── resume.ts           # TypeScript types
```

## Secciones del Portfolio
1. **Hero**: Nombre, título "Senior Front End Developer", tagline, social links
2. **About**: Bio corta, ubicación, botón download CV
3. **Experience**: Timeline de trabajos con:
   - Empresa, rol, fechas
   - Tech stack como tags (TypeScript, React, Next.js, etc.)
   - Descripción breve
4. **Footer**: Social links, copyright

## Paleta de Colores (Light Mode Default)
```css
--color-background: #ffffff;
--color-background-alt: #f8fafc;
--color-text-primary: #1e293b;
--color-text-secondary: #64748b;
--color-accent: #0d9488;      /* Teal sutil */
--color-border: #e2e8f0;
```

## Fases de Implementación

### Fase 0: Documentación
1. Crear carpeta `docs/` si no existe
2. Crear `docs/portfolio-v2-plan.md` con este plan
3. Commit: "docs: add portfolio v2 development plan"

### Fase 1: Setup (crear branch, init Next.js)
1. `git checkout -b feature/portfolio-v2`
2. Limpiar archivos actuales (mantener .git, public/cv files, docs/)
3. `npx create-next-app@latest . --typescript --app --eslint --no-tailwind`
4. Instalar: `motion`, `next-themes`, `react-icons`
5. Configurar `next.config.ts`
6. Estructura de carpetas base
7. Push branch → Vercel crea preview automático

### Fase 2: Theming + Base Styles
1. `globals.css` con CSS custom properties (light/dark)
2. `ThemeProvider` con next-themes
3. `ThemeToggle` component
4. Tipografía: Inter (sans) + JetBrains Mono (code)

### Fase 3: Data Layer
1. Definir types en `types/resume.ts`
2. Migrar `resumeData.jsx` → `data/resume.ts`
3. Estructura:
```typescript
type WorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  technologies: string[];  // Skills integrados aquí
  description: string;
};
```

### Fase 4: Layout Components
1. `Header` con nav fija + scroll spy
2. `Footer` con social links
3. Smooth scroll navigation

### Fase 5: Animation Infrastructure
1. `lib/animations.ts` con variantes Motion
2. `AnimatedSection` wrapper (respeta prefers-reduced-motion)
3. `useReducedMotion` hook

### Fase 6: Section Components
1. `Hero` - intro con social links
2. `About` - bio + download CV
3. `Experience` - cards con tech tags integrados

### Fase 7: Polish + A11y
1. Focus states, skip-to-content
2. ARIA labels
3. Lighthouse audit (target: 95+)

### Fase 8: SEO + Deploy
1. Metadata (Open Graph, Twitter cards)
2. Conectar branch a Vercel para preview
3. Test deploy con `vercel` CLI

### Fase 9: Merge + Deploy Final
1. Code review
2. PR a master o merge directo
3. Vercel auto-deploya a producción
4. Borrar branch: `git branch -d feature/portfolio-v2`

## Archivos Críticos a Crear/Modificar
- `src/app/layout.tsx` - Root layout con providers y metadata
- `src/app/page.tsx` - Composición de secciones
- `src/app/globals.css` - Design tokens y variables CSS
- `src/data/resume.ts` - Migración de resumeData.jsx con tipos
- `src/types/resume.ts` - TypeScript types
- `src/components/sections/Experience/` - Sección principal del portfolio
- `next.config.ts` - Config de Next.js

## Notas
- NO usar Tailwind (preferencia del usuario)
- Usar `types` no `interfaces` (TypeScript)
- Archivos < 200 líneas
- Skills se muestran como tags dentro de cada trabajo, no como sección separada
- Componentes custom (no Mantine UI)
- Deploy via Vercel (proyecto: xmontc/resume)

---

## Checklist de Progreso

### Fase 0: Documentación
- [x] Crear `docs/portfolio-v2-plan.md`
- [ ] Commit del plan

### Fase 1: Setup
- [ ] Crear branch `feature/portfolio-v2`
- [ ] Limpiar archivos (mantener .git, public/cv)
- [ ] Init Next.js 15 con TypeScript
- [ ] Instalar dependencias (motion, next-themes, react-icons)
- [ ] Configurar next.config.ts
- [ ] Crear estructura de carpetas
- [ ] Push para Vercel preview

### Fase 2: Theming
- [ ] globals.css con variables CSS
- [ ] ThemeProvider setup
- [ ] ThemeToggle component
- [ ] Fuentes (Inter, JetBrains Mono)

### Fase 3: Data Layer
- [ ] Definir types en types/resume.ts
- [ ] Migrar resumeData.jsx → data/resume.ts

### Fase 4: Layout
- [ ] Header component
- [ ] Navigation con scroll spy
- [ ] Footer component
- [ ] SocialLinks component

### Fase 5: Animaciones
- [ ] lib/animations.ts (variantes Motion)
- [ ] AnimatedSection component
- [ ] useReducedMotion hook

### Fase 6: Secciones
- [ ] Hero section
- [ ] About section
- [ ] Experience section (con tech tags)

### Fase 7: A11y + Polish
- [ ] Focus states
- [ ] Skip-to-content link
- [ ] ARIA labels
- [ ] Lighthouse audit 95+

### Fase 8: SEO + Deploy
- [ ] Metadata (OG, Twitter cards)
- [ ] Test en Vercel preview
- [ ] Verificar en móvil

### Fase 9: Merge
- [ ] Code review
- [ ] PR/Merge a master
- [ ] Verificar deploy producción
- [ ] Borrar branch feature

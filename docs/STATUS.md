# Estado del proyecto

> Mantenido por la skill `backlog` de Claude Code. Fuente única del estado del proyecto.

## En curso

- Hero scenes (rama `feat/hero-scenes`): Horizonte + Playa al azar por carga, panel `π`, sonido de mar (clip CC0 en loop, on por defecto tras el primer gesto, mute recordado) — `docs/hero-audio.md`. Aprobado por Carlos a oído y en pantalla. Falta: PR/merge a master (deploya solo) y Lighthouse sobre el deploy.

## Backlog

- Hero scenes: compartir escena/config por URL (`?scene=…`)
- Hero scenes: Lighthouse/perf en móviles reales (el shader de Playa corre a 95 % de resolución)
- Hero audio: resíntesis guiada por la envolvente del clip real (ruido rosa + curva de 2–3 KB en vez de 258 KB), con switch Clip/Synth en el panel para comparar


## Hecho reciente

- 2026-10-17 — LinkedIn Destacado: link a carlosmonti.com (la tarjeta puede mostrar el título viejo hasta refrescar en post-inspector)

- 2026-10-17 — LinkedIn en español: titular (a mano) y About actualizados

- 2026-10-17 — `xmontc` 0.2.0 publicado en npm (perfil y proyectos desde `resume.json`)
- 2026-10-17 — CV PDF/DOCX regenerados desde el Google Doc `carlos-monti-cv-2025` (editado en el lugar, 1 página)
- 2026-10-17 — `xmontc`: `projects.ts` deriva de `resume.json`
- 2026-10-17 — `resume.ts` como fuente única: metadata, `/resume.json` y `/llms.txt` derivados; `xmontc` sincroniza `resume.json` antes de publicar
- 2026-10-17 — Narrativa nueva (SOFIA / IA, Prosus) y títulos normalizados en CV y LinkedIn

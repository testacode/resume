# Estado del proyecto

> Mantenido por la skill `backlog` de Claude Code. Fuente única del estado del proyecto.

## En curso

- GitHub Support: ticket enviado el 2026-10-17 (cuenta testacode, respuesta al mail de la cuenta) pidiendo GC de `resume` para purgar los commits pre-reescritura colgados de `refs/pull/1..5`. Falta la respuesta.

## Backlog

- Hero: el botón de copiar `npx xmontc` tiene nombre accesible distinto del texto visible (aviso `label-content-name-mismatch` de Lighthouse; A11y sigue en 100)
- Hero audio: si el modo Synth convence, hacerlo default y borrar los clips (−500 KB de assets)


## Hecho reciente

- 2026-10-17 — Hero scenes en producción: Horizonte + Playa al azar, panel `π`, sonido de mar CC0 con fade por scroll (`docs/hero-audio.md`). Tagline sin empleador; email fuera de `llms.txt`; GitLab oculto.
- 2026-10-17 — Hero: `?scene=horizon|shore` por URL; Lighthouse móvil 92/100/100/100 (CLS 0 tras fijar el layout desde el primer paint, TBT 180 ms con la máscara escaneando solo las filas del texto); switch Recording/Synth en el panel (resíntesis por envolvente, 3.4 KB).
- 2026-10-17 — Banner del perfil de GitHub: GIF de las dos escenas sin UI ni nombre (`scripts/capture-hero.mjs` + `scripts/make-hero-banner.sh`), 2 MB.
- 2026-10-17 — Repo `resume` público (historial reescrito sin emails, LICENSE MIT + README). Perfil GitHub: nombre, bio, website, LinkedIn, README nuevo, pins (xmontc, resume, header-editor, weird-science, mac-vs-linux-bench); `xmontc` con LICENSE/topics/homepage; descripciones y topics en los repos públicos; `renaiss-test-frontend` archivado.

- 2026-10-17 — LinkedIn Destacado: link a carlosmonti.com (la tarjeta puede mostrar el título viejo hasta refrescar en post-inspector)

- 2026-10-17 — LinkedIn en español: titular (a mano) y About actualizados

- 2026-10-17 — `xmontc` 0.2.0 publicado en npm (perfil y proyectos desde `resume.json`)
- 2026-10-17 — CV PDF/DOCX regenerados desde el Google Doc `carlos-monti-cv-2025` (editado en el lugar, 1 página)
- 2026-10-17 — `xmontc`: `projects.ts` deriva de `resume.json`
- 2026-10-17 — `resume.ts` como fuente única: metadata, `/resume.json` y `/llms.txt` derivados; `xmontc` sincroniza `resume.json` antes de publicar
- 2026-10-17 — Narrativa nueva (SOFIA / IA, Prosus) y títulos normalizados en CV y LinkedIn

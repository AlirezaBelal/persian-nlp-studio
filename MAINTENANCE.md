# Product maintenance

The public Persian NLP Studio repository contains the live product and its quality gates.

## Core application

| Area | Source | Validation |
|---|---|---|
| General text analysis | `index.html`, `src/engine.mjs`, `src/app.mjs` | `tests/engine.test.mjs`, `browser/app.spec.mjs` |
| Five text tools | `tools.html`, `src/features.mjs`, `src/tools.mjs` | `tests/features.test.mjs`, `browser/features.spec.mjs` |
| Local file import | `src/corpus-import.mjs` | `tests/corpus-import.test.mjs`, browser import acceptance |
| Layout and assets | `styles.css`, `tools.css`, `favicon.svg` | Desktop/mobile Chromium smoke checks |
| Public deployment | `.github/workflows/pages.yml` | Successful deployment for the merged commit |

## Everyday workflow

1. Start with `git status`, the default branch SHA, current PRs and workflow status.
2. Work in a focused branch; avoid changing or publishing unreviewed experimental ML components.
3. Run `npm run check` and `npm test`.
4. Open a PR and confirm both GitHub Actions CI jobs pass.
5. Merge after review; confirm the new default-branch SHA and Pages deployment run.
6. Update README and CHANGELOG for user-visible changes, and keep privacy/scope claims precise.

## Deployment

GitHub Pages serves a small allowlisted static artifact. Keep imports and the artifact manifest synchronized. On retries, the upload and deploy steps must use the same per-attempt unique artifact name. A green CI alone does not establish that the live site has updated.

## Local vs model-backed functionality

All publicly deployed modules run in the browser and are lexical or rule-based. Model experiments may live in review branches, but do not become public inference services until license, quality, hosting, and privacy gates pass.

## Durable agent instructions

`AGENTS.md` documents repository-wide safety and quality rules. `.agents/skills/persian-nlp-github-maintainer/SKILL.md` packages the GitHub review/cleanup/CI/Pages workflow for Codex-compatible agents; it does not connect a GitHub account or automatically grant permissions.

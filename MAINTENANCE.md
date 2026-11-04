# Product maintenance

The public Persian NLP Studio repository contains the live product and its quality gates.

## Core application

| Area | Source | Validation |
|---|---|---|
| General text analysis | `index.html`, `src/engine.mjs`, `src/app.mjs` | `tests/engine.test.mjs`, `browser/app.spec.mjs` |
| Five text tools | `index.html` (unified UI), `src/features.mjs`, `src/tools.mjs` | `tests/features.test.mjs`, `browser/features.spec.mjs` |
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

GitHub Pages serves a small allowlisted static artifact. `tools.html` redirects bookmarks to canonical `index.html#tool`; `unified.css` supplies the active design and `assets/fonts/Vazirmatn-Variable.woff2` is self-hosted under SIL OFL 1.1. Keep imports and the artifact manifest synchronized. On retries, the upload and deploy steps must use the same per-attempt unique artifact name. A green CI alone does not establish that the live site has updated.

## Local vs model-backed functionality

All publicly deployed modules run in the browser and are lexical or rule-based. Model experiments may live in review branches, but do not become public inference services until license, quality, hosting, and privacy gates pass.

## Durable agent instructions

`AGENTS.md` retains the repository's safety and quality rules. `CODEX_SKILLS.md` documents the pinned external `am-will/codex-skills` Git submodule and a reproducible, project-local Codex setup. The old custom maintainer skill is no longer part of this repository. Run `node scripts/setup-codex-skills.mjs --init` once per checkout; CI verifies installation without invoking skills. Installation does not grant account permissions.

## Retirement checklist

Any retirement of a separate repository is outside routine product maintenance. Historical instructions are not standing authorization for a future operation.

- Obtain a separate, current owner decision naming the repository and exact action.
- Keep private repositories out of a public-product audit unless separately authorized.
- Before a retirement decision, document unique assets, licensing, preservation and recovery evidence; never infer that historical assets are backed up or replaced by trained models.
- Preserve the product's independent setup and verify CI, deployment and browser behavior.
- Record only observed outcomes. Do not delete, archive, empty or change visibility as part of ordinary product cleanup.

## Interface verification

The supported release has one canonical application at `index.html` with a shared mobile-first design system. `tools.html` only redirects legacy bookmarks. Specialist workspaces use fragment navigation and preserve inputs in page memory, not persistent storage. Clipboard copying requires an explicit user action and has a clear unavailable fallback.

Browser dependencies are CI/development only: `npm install --no-save --no-package-lock --ignore-scripts '@playwright/test@1.56.1' '@axe-core/playwright@4.14.0'`, then `npx playwright install chromium` and `npx playwright test --config=playwright.config.mjs`. The suite includes axe WCAG A/AA checks; this is not a certification of every accessibility criterion. No production dependency is installed.

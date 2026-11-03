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

`AGENTS.md` retains the repository's safety and quality rules. `CODEX_SKILLS.md` documents the pinned external `am-will/codex-skills` Git submodule and a reproducible, project-local Codex setup. The old custom maintainer skill is no longer part of this repository. Run `node scripts/setup-codex-skills.mjs --init` once per checkout; CI verifies installation without invoking skills. Installation does not grant account permissions.

## Retirement checklist

Retirement of a separate private research repository is blocked until all items below have evidence:

- [ ] Inventory every branch/tag, commit tip, file/blob, LFS object and submodule; preserve unique code, checkpoints, preprocessing, evaluation splits and provenance.
- [ ] Map each asset to retained-private backup, verified public replacement or separately authorized disposal. Lexical tools and model smoke runs do not replace trained pipelines or research datasets.
- [ ] Review per-component licenses and collaborator attribution; preserve required notices. Never include the private inventory, customer/student identifiers or restricted assets in a public PR.
- [ ] Create an encrypted off-repository Git mirror/bundle and separate exports for Issues/PR discussions, release attachments, wiki and required configuration. Never export plaintext secrets into a report.
- [ ] Record SHA-256 checksums and verify that the backup includes LFS/submodule content, not only pointers. Keep two independently stored copies under owner control.
- [ ] Restore into an isolated directory without the original remote; run git fsck, compare refs and file hashes, and verify representative large model/data files. Record actual commands, results and missing items.
- [ ] Confirm remaining consumers, links, workflows and provenance references will not break. Deletion removes collaboration/history context and may not be reversible.
- [ ] Obtain separate explicit owner approval naming the exact repository and irreversible action. No deletion, emptying, archive or visibility change is implied by this checklist.

A failed Git clone or a metadata-only inventory is not a backup. Until restore verification succeeds, retirement remains unsafe.

Project skills: run `node scripts/setup-codex-skills.mjs --init`, then `node scripts/setup-codex-skills.mjs --check`. See [CODEX_SKILLS.md](CODEX_SKILLS.md) for license limitations, discovery evidence and safe invocation.

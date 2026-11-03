# Agent guidance — Persian NLP Studio

This repository is the standalone **Persian NLP Studio / متن‌نما** product.

## Repository scope
- Work only in `AlirezaBelal/persian-nlp-studio` unless the user separately authorizes another named repository.
- Never expose private-source materials, inherited datasets, model checkpoints, personal identifiers, credentials or private Git history.
- Do not delete or change the visibility of another repository without explicit owner authorization naming it. The latest owner instruction for the separately named legacy repository explicitly waives backup gates and authorizes deletion after the redesigned public product is merged and deployed. Do not reimpose superseded backup conditions; never infer that a backup or recovery exists. No unrelated repository deletion is authorized.
- Keep the public product independent of an ML backend until an evaluated and privacy-reviewed model integration exists.

## Existing functionality
- `index.html`, `src/engine.mjs`, `src/app.mjs`: lexical statistics, normalization, text comparison, numeric-only JSON output.
- `index.html` and `src/tools.mjs`, `src/features.mjs`: seven integrated text workspaces. `tools.html` is a legacy deep-link redirect, not a separate product UI.
- `src/corpus-import.mjs`: local, bounded UTF-8 TXT/JSONL import. It must be included in Pages static assets.
- `ml/` (if proposed in a PR): separate local research experiments, **not** proof of production ML.

## Required checks
```sh
npm run check
npm test
```

Check the existing GitHub Actions `Product checks` workflow, including real Chromium desktop/mobile runs. Verify Pages deployment against the exact commit and reported environment URL, not against a guessed URL. A passing PR check does not prove the live site was deployed.

## Product constraints
- Persian RTL accessibility and mobile layout.
- Client-side processing, no unannounced text uploads, tracking, credentials or hidden storage.
- JSON export must contain only explicitly allowlisted aggregate metrics; not words, input text or token lists.
- No unsupported medical, sentiment, orthography correction, poetry style transfer, model quality, or AI performance claims.
- Keep release docs accurate and product-oriented.

## Codex skills

The former custom maintainer skill has been retired. The externally maintained [am-will/codex-skills](https://github.com/am-will/codex-skills) collection is pinned as a Git submodule at `vendor/codex-skills`. See `CODEX_SKILLS.md` for the exact upstream SHA and the project-local installation and verification commands.

- Do not automatically run third-party install scripts, hooks, agents or network tools.
- The default selections for an authorized manual setup are `planner` and `frontend-responsive-ui`.
- No repository skill overrides the scope, privacy, accuracy, release or deletion rules above.
- GitHub operations require an authorized account or connector; the external collection does not grant access.

Project skills: run `node scripts/setup-codex-skills.mjs --init`, then `node scripts/setup-codex-skills.mjs --check`. See [CODEX_SKILLS.md](CODEX_SKILLS.md) for license limitations, discovery evidence and safe invocation.

## Interface maintenance
- The v0.3 workspace is Persian-first, light, mobile-first and buildless. Shared tokens/components live in `styles.css`; specialist layout in `tools.css`.
- Specialist links progressively enhance into one visible workspace. Preserve fragment deep links, back/forward navigation, input retention and a no-JavaScript readable fallback.
- Run the pinned Playwright + axe CI suite. Keep all functional, privacy, keyboard, reflow and contrast assertions enabled. No runtime package, CDN font or tracking is needed.

# Agent guidance — Persian NLP Studio

This repository is the standalone **Persian NLP Studio / متن‌نما** product.

## Repository scope
- Work only in `AlirezaBelal/persian-nlp-studio` unless the user separately authorizes another named repository.
- Never expose private-source materials, inherited datasets, model checkpoints, personal identifiers, credentials or private Git history.
- Do not delete or change the visibility of any other repository. Destructive actions, including deleting a repository, require separate, explicit user authorization after evidence of backups and recovery.
- Keep the public product independent of an ML backend until an evaluated and privacy-reviewed model integration exists.

## Existing functionality
- `index.html`, `src/engine.mjs`, `src/app.mjs`: lexical statistics, normalization, text comparison, numeric-only JSON output.
- `tools.html`, `src/tools.mjs`, `src/features.mjs`: five transparent, local text utilities.
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

## Reusable skill
For GitHub review, repository cleanup, CI repair, Pages releases, or PR handoff, use `.agents/skills/persian-nlp-github-maintainer/SKILL.md`. This is repository guidance, not an automatic grant of GitHub permissions; use an authorized GitHub connector or explicit user-authorized local credentials.

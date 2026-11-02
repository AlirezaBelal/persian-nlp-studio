---
name: persian-nlp-github-maintainer
description: Maintain the AlirezaBelal/persian-nlp-studio GitHub product repository; use for safe cleanup, branches, pull requests, CI and Pages failures, releases, licensing checks, and migration or retirement planning. Never act on unrelated repositories.
---

# Persian NLP Studio — GitHub maintenance skill

## Start with a verified repository snapshot

1. Confirm `owner/repo = AlirezaBelal/persian-nlp-studio`, repository visibility, default branch SHA, open PRs, latest CI and GitHub Pages deployment.
2. Inspect `AGENTS.md`, `README.md`, `FEATURE_SCOPE.md`, `PRIVACY.md`, `SECURITY.md`, `RELEASE_CHECKLIST.md`, and relevant code and tests.
3. Identify which changes are purely cleanup, production features, or experimental ML. Do not mix experimental model deployment with safe static releases.
4. If another PR touches the same files, inspect it before choosing a branch, commit or merge plan.

## Make safe, reviewable changes

1. Create a focused branch from the verified default-branch head.
2. Remove stale documentation, broken links, dead code and unused files **only when dependency inspection and tests show they are unnecessary**. Check JavaScript imports, `index.html`, `tools.html`, Pages artifact allowlist, tests and README links.
3. Keep the product-facing copy clean, accurate, Persian-first, and independent from earlier institutional branding.
4. Do not delete release evidence, unique model research, private historical data or original Git history based on filename alone.
5. Do not add third-party fonts, datasets, weights, runtime requests or external dependencies without verifying rights, privacy, compatibility and actual value.

## Verification gates

- `npm run check`
- `npm test`
- GitHub Actions `Product checks`: source tests and Chromium desktop/mobile browser tests, on the **final PR SHA**.
- Pages workflow includes every referenced browser import. In particular, `src/corpus-import.mjs` must be bundled when `src/tools.mjs` imports it.
- After merging, confirm `master` CI success and an actual successful Pages deployment on that exact commit.
- Report failures from real logs; never invent a passing test or a live URL.
- If a Pages retry creates multiple artifacts, ensure uploaded and deployed artifact names are unique per run attempt.

## Privacy, legal and ML rules

- Preserve the numeric-only JSON export and the no-upload-by-default contract.
- Do not upload text to a public service or expose any local inference endpoint without an explicit privacy and hosting review.
- Do not label heuristic tools as trained predictors.
- Do not publicly release inherited or unverified research data, collaborator code, model checkpoints, notebook outputs, access tokens or student information.
- For model-backed claims, require exact revision/license, safe loading, independent held-out evaluation, and documented failure cases.
- Keep experimental work in an isolated PR until these gates pass.

## Old-repository retirement gate

A separate historical repository may contain unique assets. **Do not delete, empty, change visibility, rewrite history, archive, or transfer it merely because this product exists.**

If the user wants retirement, first prepare a private inventory, verified full backup with restore test, license/provenance review, explicit asset-by-asset disposition and proof that no required model or dataset is lost. Present a separate, irreversible deletion approval with the exact repository name. If the connector lacks delete privileges, report the blocker instead of bypassing it.

## GitHub action and release hygiene

1. Use connected GitHub tools or an authorized Git client; never request or print tokens in chat.
2. Write a focused PR with file list, risks, migration scope, tests and any open limitations.
3. Never push directly to a protected/default branch if PR review is available; merge only after passing checks and suitable authorization.
4. Re-verify the merged commit, visibility and deployment.
5. Report in Persian: repository URL, PR number, commit SHA, actual test counts, Pages run and remaining blockers.

## Not this skill's job

Do not touch `mohlatban`, personal websites, other apps, or any unrelated repositories. Do not conduct broad account cleanup, destroy research archives, or make security/medical/ML claims without supporting tests.

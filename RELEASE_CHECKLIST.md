# Persian NLP Studio — release quality gates

Keep this checklist current for every release. Never infer deployment success from source CI alone.

## Source and privacy

- [x] Product repository has an independent Git history and does not bundle restricted private artifacts, third-party datasets or model weights.
- [x] Product is public; end-user texts are processed locally in the published static UI.
- [x] JSON download uses a strict allowlist of aggregate numeric measurements, not user input or vocabulary.
- [x] User-owned UTF-8 TXT/JSONL file imports enforce format and size limits, and run in the browser.
- [x] `AGENTS.md` and `MAINTENANCE.md` document safe scope and required review; `CODEX_SKILLS.md` describes the optional pinned skills collection.

## Verification on the current change

- [ ] Run `npm run check` on the final PR SHA.
- [ ] Run `npm test` on the final PR SHA.
- [ ] Confirm desktop/mobile Chromium jobs succeed on the final PR SHA.
- [ ] Confirm the Pages artifact includes `index.html`, `tools.html`, `favicon.svg`, CSS, and all imported `src/*.mjs` files.
- [ ] Merge the PR only after passing tests.
- [ ] Confirm post-merge default-branch CI and the deployment workflow both succeed for the exact merged commit.
- [ ] Confirm the live application actually loads if external browser access is available; otherwise report the limitation.

## ML and medical safety

- [x] Browser UI truthfully labels lexical and rule-based results as heuristic, not pretrained inference.
- [ ] Any future external model inference must pass permissions, licensing, independent evaluation, privacy, hosting cost and user-consent review.
- [ ] Medical-name lookup must not imply verified equivalence, prescriptions, dosage or treatment suitability.
- [ ] Poetry generation or style-transfer claims require real model-backed conditioning and quality evaluation.

## Release record

Record the public commit SHA, product version, PR links, successful CI run, Pages deployment URL and known limitations in the completion report. Avoid obsolete release dates or counts in this evergreen checklist.

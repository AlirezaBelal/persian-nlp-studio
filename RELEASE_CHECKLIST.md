# Release gate — Persian NLP Studio

Original private course archive: `AlirezaBelal/persian-nlp-course-projects`. Keep **PRIVATE** and preserve its contents and Git history.

## Allowlist and rights

- [x] New independent source repository with clean initial history.
- [x] Only original product HTML, CSS, JS, tests, docs and workflows.
- [x] No course notebooks, student identifiers, original course datasets, model weights or reports.
- [x] No third-party fonts, imagery or runtime libraries bundled.
- [x] MIT license limited to new product source.

## Acceptance

- [x] Deterministic lexical processing and numeric-only JSON export.
- [x] New repository source PR CI green (verified 2026-11-02; post-merge CI still required).
- [x] Chromium desktop/mobile browser acceptance green (6/6; actual browser downloads and network activity inspected).
- [ ] Security and UI copy reviewed; no network uploads of entered text.
- [ ] Final public tree rechecked for inherited coursework and secrets.

## Publication

- [ ] Make ONLY `AlirezaBelal/persian-nlp-studio` Public.
- [ ] In Settings → Pages, use **GitHub Actions** as Build and deployment source.
- [ ] Run deployment workflow and verify the *actual* public site URL.
- [ ] Verify previous coursework repository remains PRIVATE.
- [ ] Create a release version only after passing the above steps.

Never treat CI alone as proof that Pages is public or all browser/accessibility checks passed.

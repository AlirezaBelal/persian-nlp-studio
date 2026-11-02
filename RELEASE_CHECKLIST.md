# Release review — Persian NLP Studio

## Public source boundary

- [x] Dedicated clean product repository (`AlirezaBelal/persian-nlp-studio`).
- [x] Product repository **Public**, original research repository still **Private**.
- [x] No old dataset, notebook, pretrained weights, report or source history copied.
- [x] Original client-side code, documentation and small synthetic/local lists only.
- [x] No tracking, backend or runtime third-party dependencies.
- [x] Source text excluded from numeric-only JSON export.

## Verification for the new five-tool suite

- [x] Unit/structure tests of the suite passed on the PR branch (27/27, GitHub run 41461168593).
- [x] Real Chromium desktop/mobile tests passed on the PR branch (22/22, GitHub run 41461168593).
- [x] Source, privacy and scope documentation updated; no unlicensed coursework artifacts in the product commit.
- [ ] Updated GitHub Pages workflow deploys all allowlisted assets, including `tools.html`.
- [ ] Actual public site URL verified after deployment.
- [ ] Original research repository remains Private after publication.

## Separate future trained-model phase

- [ ] Validate redistribution and training rights before any dataset/checkpoint reuse.
- [ ] Define held-out evaluations and error/fairness metrics for new models.
- [ ] Explicit safety review for any clinical or prescription-adjacent features.
- [ ] Preserve clear user labels for experimental vs validated functionality.

**Important:** Shipping independently written functional text tools does not mean that the original university-trained models were transferred. Do not claim that equivalence.

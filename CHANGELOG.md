# Changelog

## Unreleased — unified seven-workspace product (0.4.0)

- Bring text analysis, comparison and five specialty tools into one canonical application; browser history and inputs persist while changing views.
- Preserve legacy `tools.html#tool` links through a same-origin redirect.
- Apply a MohlatBan-inspired paper/ink/blue design system, with mobile-first navigation and accessible interaction.
- Self-host original Vazirmatn font with its SIL OFL 1.1 attribution, without third-party runtime requests.
- Update Pages and preview allowlists. Keep MohlatBan and the private research repository unchanged.
- Include unified routing, typography and privacy regression tests.


## Unreleased — Codex skills integration

- Replace the retired custom maintainer skill with a pinned `am-will/codex-skills` Git submodule.
- Add optional, version-checked project-scoped setup for selected Codex skills.
- Update AGENTS, maintenance and regression checks; do not auto-execute third-party hooks or agents.
- Keep runtime code, static Pages packaging, and private-source boundaries unchanged.


## Unreleased
- Run source validation before Pages packaging.
- Document backup, restore and explicit-approval gates for private-repository retirement.

## Unreleased — maintenance and repository hygiene

- Add project-scoped GitHub/Codex maintenance skill and root agent guidance.
- Normalize product-facing terminology, documentation, and release acceptance gates.
- Add regression tests for skill metadata, Pages asset dependencies, and branding hygiene.
- Do not alter the application's public inference behavior or add external data flows.

## 0.2.1 — 2026-11-02

- Add local file import for UTF-8 TXT and JSONL corpora to the existing corpus explorer.
- Validate file format, byte length, JSONL record count, UTF-16 output length and encoding.
- Retain existing text after a failed file import.
- Keep the separate ML experiments in the unmerged draft PR #4; this release does not deploy a model API.

## 0.2.0 — 2026-11-02

- Add five independent, browser-local Persian text utilities: corpus concordance, he-kasreh spelling review, generic name lookup, sentiment lexicon evidence, and poetic structure review.
- Add an accessible, responsive RTL multi-tool dashboard (`tools.html`) and links from the original lexical analyzer.
- Add unit, privacy and real desktop/mobile Chromium browser acceptance tests.
- Keep the original analyzer and its strictly numeric-only JSON export.
- Deploy both pages and source modules using an allowlisted GitHub Pages artifact.
- Verify 27/27 source-level tests, 22/22 browser tests, and successful GitHub Pages deployment.
- Preserve the accuracy and safety limitations: no trained ML predictions, clinical lookup or authentic learned style transfer in this version.

## 0.1.0 — 2026-11-02

- Initial independent Persian lexical analyzer and Jaccard text comparison.
- Numeric-only JSON export, no backend or runtime tracking.
- Original static RTL UI and product-only public Git history.

The public product contains no private historical datasets, original trained weights or notebooks.

## 0.2.2 — 2026-11-03
- Reproducible project-local Codex skill installation and real loader verification.
- Responsive touch-target/readability improvements with five-width browser acceptance.
- Node-only allowlisted local preview; no production dependencies.
- Explicit audit of deferred ML work and blocked legacy backup/retirement.

## 0.3.0 — 2026-11-03
- Rebuilt both pages as a light, Persian-first workspace with a shared responsive visual system.
- Focused specialist navigation, direct links/history, retained page-memory input and per-tool clearing.
- Explicit normalized-text copy with feedback; numeric-only JSON unchanged.
- Improved empty states, local file guidance and stale-import protection.
- Added keyboard, reflow and WCAG A/AA browser checks with CI-only axe; no runtime dependency.
- Supersedes previous backup-gated retirement instructions with the owner's explicit current authorization; actual deletion outcome is recorded separately in release notes.

## 0.5.0 — 2026-11-04
- Complete Persian landing, seven feature cards, three-step guidance, privacy, creator, contact and footer.
- Verified public creator credit and GitHub contact; no unverified email or biography.
- Original local SVG logo/favicon and consistent icon sprite. Full Vazirmatn OFL included in Pages.
- Landing/card/footer navigation retains the same seven workspaces, history and in-memory text. Engines and numeric-only export retained.
- Added landing, link, asset, creator/contact and keyboard browser acceptance without weakening previous tests.

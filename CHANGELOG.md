# Changelog

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

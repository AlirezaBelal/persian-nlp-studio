# متن‌نما · Persian NLP Studio

**A privacy-first, browser-based suite of Persian text tools.** This is an independent, user-facing product with clear functional and privacy boundaries.

## Use the product

**All seven tools live in one application at `index.html`.** The analyzer, comparison and specialist tools share a single workspace; switching tools preserves in-memory input. Old `/tools.html#tool` bookmarks redirect to the correct view.

| Tool | What is implemented | What it does *not* claim |
| --- | --- | --- |
| Text analyzer | Persian normalization, characters, words, common-word chart, Jaccard lexical comparison, numeric-only JSON | Semantic embeddings or grammatical correctness |
| **Corpus Explorer** | Local UTF-8 TXT/JSONL import, text search with context snippets and frequent word bigrams | Licensed search index, automatic crawling or server-side ingestion |
| **He-Kasreh Review** | Detection of selected orthographic variants with optional alternative spellings | Trained correction, error certainty or auto-editing |
| **Generic Name Lookup** | Tiny original spelling-only list, Persian/English queries, prefix and fuzzy matching | Comprehensive pharmaceutical database, verified equivalence, diagnosis or advice |
| **Sentiment Evidence** | Small transparent positive/negative word list, film-aspect scope, simple negation rule | Validated sentiment classifier or reliable inference of someone's opinion |
| **Verse Explorer** | Line counts, repeated written endings and word frequency | Prosodic meter, validated rhyme scheme, pretrained poetry generation or style transfer |

Every entry is a **working local feature**, not a placeholder, but the methods are heuristic rather than trained ML. Do not use the medicine lookup for medical decisions.

## Run locally

Node.js 22+, no production dependencies:

```bash
node scripts/serve-product.mjs
```

Open `http://127.0.0.1:8765/` (for example `/#corpus` or `/#medicine`). The site does not upload entered text or track users. TXT and JSONL corpus import reads user-owned local files entirely in the browser; limits: 80,000 input bytes, 1,000 nonblank JSONL records, and 20,000 UTF-16 text units. Static hosting may separately log ordinary site requests.

## Verify

Node.js 22+:

```bash
npm run check
npm test
```

CI also tests the real Chromium browser on desktop and mobile viewport sizes. The browser-testing packages are development-only; the deployed website has no remote runtime assets. The bundled Vazirmatn font is served locally under the separate [SIL OFL 1.1 license](assets/fonts/OFL-Vazirmatn.txt).

## Code, privacy and rights

All frontend logic lives in `src/`. The names in the small generic-name list are common nonproprietary spellings, selected independently; no external medical dataset has been copied. Sample text was authored for this product.

The public package contains only product source, tests, documentation and deployment assets. It does not bundle third-party datasets, pretrained weights, confidential artifacts or unrelated project history.

Read [privacy](PRIVACY.md), [security](SECURITY.md), [license](LICENSE), [feature scope](FEATURE_SCOPE.md) and [maintenance instructions](MAINTENANCE.md). For coding-agent workflows, the [external Codex skills collection and installation instructions](CODEX_SKILLS.md) are available. The pinned Git submodule is opt-in and is not part of the deployed website.

## Hosting

- [Open the unified Persian NLP Studio](https://alirezabelal.github.io/persian-nlp-studio/)
- [Jump to corpus explorer](https://alirezabelal.github.io/persian-nlp-studio/#corpus)
- [Jump to sentiment evidence](https://alirezabelal.github.io/persian-nlp-studio/#sentiment)
- [Published releases](https://github.com/AlirezaBelal/persian-nlp-studio/releases)
- [Current CI and Pages runs](https://github.com/AlirezaBelal/persian-nlp-studio/actions)

## The unified v0.4 workspace

Seven workspaces live in **one document** rather than separate analyzer/toolbox pages. The top navigation switches between text analysis, comparison, corpus import/search, writing review, name lookup, sentiment evidence and poetry structure.

- Switching tools does not erase entered text. Browser back/forward and deep links use the same single page.
- Refreshing or closing the page discards unsaved text. There is no backend or browser storage.
- Old bookmarks such as `tools.html#poetry` redirect to `index.html#poetry`; the legacy page is not a separate UI.
- Responsive design and self-hosted Persian typography follow the clarity principles of the owner's MohlatBan product. No MohlatBan source code or backend is required at runtime.
- Import, export, keyboard, responsive and WCAG A/AA behavior remain covered by automated browser tests.

The previous v0.3 redesign remains documented in [REDESIGN.md](REDESIGN.md). The present system is independently maintained in `unified.css`; ML limitations remain in [FEATURE_SCOPE.md](FEATURE_SCOPE.md).

## Public product release v0.5

The main site includes the TextNema landing page, seven descriptive tool cards, a three-step guide, privacy details, creator credit, verified GitHub contact and a full footer. The interactive application stays in the same document; use the primary start action or any tool card to open a workspace. Local SVG branding and icons require no external service.

Designed and developed by [Alireza Belal](https://github.com/AlirezaBelal), as verified from the public GitHub profile. No public email was exposed by the unauthenticated API, so no email address is published. [Release decisions and verification](PRODUCT_RELEASE.md) describe contact provenance, original branding and separate font licensing.

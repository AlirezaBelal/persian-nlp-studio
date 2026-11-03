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

- [Open the public text analyzer](https://alirezabelal.github.io/persian-nlp-studio/)
- [Open the specialist workspaces](https://alirezabelal.github.io/persian-nlp-studio/tools.html)
- [Published releases](https://github.com/AlirezaBelal/persian-nlp-studio/releases)
- [CI and deployment workflows](https://github.com/AlirezaBelal/persian-nlp-studio/actions)

## The v0.3 workspace

A new Persian-first interface puts text entry, live metrics, frequency results and normalized output in clear work areas. JSON downloads still contain only numeric aggregate metrics. Copying normalized text is a separate, explicit action.

Choose one of five specialist tools in the toolbox. Direct links such as `tools.html#poetry` open the requested workspace; browser back/forward works, and switching tools preserves inputs while the page remains open. Closing or reloading the page discards inputs. Each tool includes a sample and a clear action. The corpus picker reads local UTF-8 TXT/JSONL only; nothing is uploaded.

The visual system uses local system fonts, lightweight CSS and no third-party runtime assets. Browser acceptance includes 320–1440px reflow, keyboard use, clipboard feedback, local import races, all existing feature/privacy flows and automated WCAG A/AA checks. See [redesign notes](REDESIGN.md) and [scope audit](PROJECT_AUDIT.md).

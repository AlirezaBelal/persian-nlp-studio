# متن‌نما · Persian NLP Studio

**A privacy-first, browser-based suite of Persian text tools.** This is a product with its own original source and Git history—not a copy of past class assignments or datasets.

## Use the product

Open `index.html` from a local HTTP server for the original text analyzer or go to `tools.html` for five additional tools.

| Tool | What is implemented | What it does *not* claim |
| --- | --- | --- |
| Text analyzer | Persian normalization, characters, words, common-word chart, Jaccard lexical comparison, numeric-only JSON | Semantic embeddings or grammatical correctness |
| **Corpus Explorer** | Text search with context snippets and frequent word bigrams | Licensed search index or automatic crawling |
| **He-Kasreh Review** | Detection of selected orthographic variants with optional alternative spellings | Trained correction, error certainty or auto-editing |
| **Generic Name Lookup** | Tiny original spelling-only list, Persian/English queries, prefix and fuzzy matching | Comprehensive pharmaceutical database, verified equivalence, diagnosis or advice |
| **Sentiment Evidence** | Small transparent positive/negative word list, film-aspect scope, simple negation rule | Validated sentiment classifier or reliable inference of someone's opinion |
| **Verse Explorer** | Line counts, repeated written endings and word frequency | Prosodic meter, validated rhyme scheme, pretrained poetry generation or style transfer |

Every entry is a **working local feature**, not a placeholder, but the methods are heuristic rather than trained ML. Do not use the medicine lookup for medical decisions.

## Run locally

Python 3, no production dependencies:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/` and `http://127.0.0.1:8765/tools.html`. The site does not upload entered text or track users. Static hosting may separately log ordinary site requests.

## Verify

Node.js 22+:

```bash
npm run check
npm test
```

CI also tests the real Chromium browser on desktop and mobile viewport sizes. The browser-testing packages are development-only; the deployed website has no remote runtime assets.

## Code, privacy and rights

All frontend logic lives in `src/`. The names in the small generic-name list are common nonproprietary spellings, selected independently; no external medical dataset has been copied. Sample text was authored for this product.

The repository contains no academic datasets, original trained models, classroom notebooks, historical reports or old Git history. The original private source-of-research remains independently managed and is **not** a dependency.

Read [privacy](PRIVACY.md), [security](SECURITY.md), [license](LICENSE) and [feature scope and next steps](FEATURE_SCOPE.md).

## Hosting

GitHub Pages reported a successful deployment for commit `85eba89` on 2026-11-02:

- [Open the public text analyzer](https://alirezabelal.github.io/persian-nlp-studio/)
- [Open the five-tool suite](https://alirezabelal.github.io/persian-nlp-studio/tools.html)
- [View the successful Pages deployment workflow](https://github.com/AlirezaBelal/persian-nlp-studio/actions/runs/41461677939)

The hosting URLs are evidenced by the GitHub deployment log; direct independent HTTP access from the assistant's execution environment was unavailable. Verify in your own browser if you need an external availability check.

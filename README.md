# متن‌نما — Persian NLP Studio

A privacy-first Persian text analysis web app. **Release candidate v0.1.0.**

This is an independently created product repository. It is **not** the historical university coursework repository; no inherited notebooks, research datasets, model files or old Git history have been copied into it.

## Features

- Persian text normalization (Arabic/Persian letter forms, diacritics, limited whitespace).
- Word, unique word, character, line and approximate sentence statistics.
- Frequent-word visualization in the browser.
- Lexical (Jaccard) overlap between two texts, **not semantic similarity**.
- Local downloadable JSON containing **aggregate numeric metrics only**, never source text or extracted words.
- Responsive Persian RTL interface with no backend, telemetry, account or external runtime dependencies.

This version **does not** implement learned sentiment prediction, He-Kasreh correction, medicine extraction, style transfer, AI text generation or semantic language understanding.

## Run

With Python 3:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. No package installation is required to use the browser app.

## Test

Node.js 22+:

```sh
npm run check
npm test
```

GitHub Actions runs these checks and Chromium browser acceptance tests.

## Documentation

Read [Privacy](PRIVACY.md), [Security](SECURITY.md), [License](LICENSE) and the [Public release checklist](RELEASE_CHECKLIST.md).

Text statistics are deterministic but linguistically approximate. The product is not medical, legal or clinical advice. The MIT product license does not cover unrelated academic works or datasets.

## Public site

A GitHub Pages workflow is included. The site is public only after the repository visibility, Pages settings and actual deployment are verified. Do not assume a URL is live until checked.

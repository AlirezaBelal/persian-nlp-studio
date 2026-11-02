# Product modules and accuracy boundaries

All modules below are independently implemented, client-side tools. The product does not contain third-party datasets, pretrained models, notebooks, or restricted historical artifacts.

| Product module | Implemented now | If pursuing trained-model functionality later |
| --- | --- | --- |
| Corpus Explorer | Local phrase search, context preview, repeated bigrams | Obtain a lawful source corpus and establish ingestion consent, fair-use boundaries, attribution and anti-abuse rules |
| Orthography Review | Selected `ه + ی` variants flagged for human review | New consented labeled dataset, reproducible evaluation, manual gold-set and false-positive control |
| Generic Name Lookup | Small handwritten generic spelling index, Persian/English and typo search | Check authoritative datasets' redistribution rights, versioning, ambiguity and clinical safety review; **no clinical claims** |
| Sentiment Evidence | Interpretable positive/negative lexical markers, limited movie-aspect window, simple negation | Independently train or license suitable model and evaluation set, measure per-aspect precision/recall on held-out Persian text |
| Verse Explorer | Line counts, approximate couplets, written two-character ending overlaps, word frequency | Obtain lawful text and model weights; validate poetic meter/rhyme and any generation or style-transfer claims |

The sixth general-text module (the landing page) retains normalization, word stats, Jaccard overlap, and safe numeric-only JSON export.

## User-visible safeguards

- **No automated correction** is applied to the author's text.
- **No medical prescriptions, indications, dosage or clinical equivalence** are returned.
- Aspect-based sentiment is **not an ML classifier**; adjective scope is approximate.
- Poetry ending similarity is **not** Persian metrical analysis or authentic style transfer.
- No external network API, crawling or model download occurs.
- Inputs are capped to 20,000 UTF-16 code units per field in the UI.
- Typed text is not saved in an application database or uploaded to a backend.

## Test gate

Each module needs deterministic unit tests and real browser desktop/mobile checks before release. Do not claim the trained counterparts are available without actual compatible weights, verified rights, and measured results.

## Provenance of new implementation

Code and samples here are original text-product implementations. No historical academic files, class submissions, trained model checkpoint binaries or source repository Git history have been copied. The old private research repository is independent, stays private, and is not required to build this product.

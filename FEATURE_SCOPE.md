# Product modules and accuracy boundaries

All public-facing modules below are independently implemented client-side tools. No external model is invoked and no sensitive or restricted data package is required for normal operation.

| Product module | Implemented now | If pursuing trained-model functionality later |
| --- | --- | --- |
| Corpus Explorer | User-owned TXT/JSONL import, local phrase search, context preview, repeated bigrams | Obtain a lawful source corpus and establish ingestion consent, fair-use boundaries, attribution and anti-abuse rules |
| Orthography Review | Selected `ه + ی` variants flagged for human review | New consented labeled dataset, reproducible evaluation, manual gold-set and false-positive control |
| Generic Name Lookup | Small handwritten generic spelling index, Persian/English and typo search | Check authoritative datasets' redistribution rights, versioning, ambiguity and clinical safety review; **no clinical claims** |
| Sentiment Evidence | Interpretable positive/negative lexical markers, limited movie-aspect window, simple negation | Independently train or license suitable model and evaluation set, measure per-aspect precision/recall on held-out Persian text |
| Verse Explorer | Line counts, approximate couplets, written two-character ending overlaps, word frequency | Obtain lawful text and model weights; validate poetic meter/rhyme and any generation or style-transfer claims |

The two general-text workspaces provide normalization, word statistics and safe numeric-only JSON export in the analyzer, plus Jaccard lexical overlap in text comparison. Together with the five specialist tools above, they form seven workspaces in one application.

## User-visible safeguards

- **No automated correction** is applied to the author's text.
- **No medical prescriptions, indications, dosage or clinical equivalence** are returned.
- Aspect-based sentiment is **not an ML classifier**; adjective scope is approximate.
- Poetry ending similarity is **not** Persian metrical analysis or authentic style transfer.
- No external inference API, crawling or model download occurs in the published browser application.
- User input is capped to 20,000 UTF-16 code units per text area in the UI. Local corpus imports also enforce 80,000 bytes per file and at most 1,000 JSONL records.
- Typed text is not saved in an application database or uploaded to a backend.

## Test gate

Each module needs deterministic unit tests and real browser desktop/mobile checks before release. Do not claim the trained counterparts are available without actual compatible weights, verified rights, and measured results.

## Provenance of new implementation

Public product code and samples are independently implemented. The site does not bundle third-party restricted datasets, pretrained checkpoint binaries, or unrelated repository history. Future inference features require separate rights, privacy, deployment and evaluation reviews.

# Supported product audit — v0.3

The supported public product consists of the offline text analyzer and five transparent lexical tools. The complete trained research product is not claimed. See FEATURE_SCOPE.md for exact per-module boundaries.

| Area | Supported functionality | Not shipped or independently evaluated |
|---|---|---|
| Analyzer | Normalization, metrics, frequencies, lexical comparison, numeric JSON | Semantic or grammatical inference |
| Corpus | Bounded local TXT/JSONL, concordance, bigrams | Authoritative licensed corpus / evaluated semantic retrieval |
| Orthography | Human-review candidates, no silent correction | Trained correction, licensed POS assets and held-out gold-set evaluation |
| Generic names | Small independent Persian/English spelling list | Authoritative pharmaceutical data, clinical equivalence or advice |
| Sentiment | Explicit lexical/aspect evidence | Independently evaluated trained sentiment/aspect model |
| Poetry | Lines, endings and word frequency | Evaluated generation, prosody or style transfer |

## Redesign scope

Both pages are rebuilt with a shared light RTL workspace. Specialist navigation preserves page-memory inputs, supports direct fragments/history, and works as readable sections without JavaScript. Copying is explicit; JSON still excludes source text and word lists. Stale local file reads cannot replace newer edits. See REDESIGN.md for design decisions and acceptance.

No public source depends on the historical private repository. No private assets, datasets, weights or inherited history are published. No upload, tracking, persistent input storage, external runtime asset or production dependency has been added. Restrictive CSP and inert text rendering remain enforced. The unchanged explicit Pages allowlist excludes skills and developer scripts.

## Skills and rights

The source gitlink remains at `9f954c3b63fda0d1875252009c196bf15072c1ca`. Installed project-local `planner` and `frontend-responsive-ui` are used for the redesign plan and responsive implementation/acceptance. `scripts/verify-codex-discovery.mjs` checks the actual enabled repo catalog. Installed copies are ignored, not redistributed. `frontend-design` remains uninstalled because its referenced license is missing; no broad upstream license is assumed.

## Open work disposition

At redesign start, no open Issues existed. PR #4 contains useful but unready ML experiments at `764077c18512e60a7d2d85976b85b54350dceb5b`. The local import portion is already released. Preserve that public commit under a research archive tag before closing the superseded draft without merging experimental inference. Archive other obsolete public branch tips before removing their redundant branch references. Evidence of executable smoke runs is not evidence of accuracy or production quality.

## Retirement authorization

The owner explicitly authorized deletion of the separately named legacy repository after the redesigned site is deployed, knowingly waiving the prior backup requirement. Earlier backup-gated audit statements are superseded by that instruction. No backup, successful restoration or private-asset preservation is claimed. Perform only the exact authorized deletion; publish its actual outcome or precise technical permission blocker in release notes and the final report. No unrelated repository operation is authorized.

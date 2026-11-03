# Supported product audit — 2026-11-03

Status: supported offline product verified locally; complete ML product and permanent legacy retirement remain blocked. This is not a declaration that the five original trained research pipelines have been ported.

## Implemented scope and remaining model gates

| Research area | Independent public capability | Unfinished trained/data-backed capability |
|---|---|---|
| Corpus | Bounded local TXT/JSONL import, literal concordance, bigrams | Rights-cleared corpus and independently evaluated retrieval |
| He-kasreh | Variant highlighting and human review | Rights-cleared POS assets, labeled gold set, held-out correction evaluation |
| Medicine | Original small spelling index with fuzzy matching | Authoritative redistributable multilingual data, ambiguity and clinical safety review |
| Sentiment | Transparent lexical and aspect evidence | Independent held-out sentiment/aspect evaluation, calibration, consented inference UI |
| Poetry | Line/ending/frequency analysis | Evaluated generation, meter/rhyme quality and independently validated style conditioning |

All public scripts were inspected: no legacy repository dependency, backend, model download, text upload, persistent input storage or production package dependency. Numeric-only export and inert text rendering remain covered by existing unit and browser tests. CSP retains `connect-src 'none'`. No private research asset, historical Git object, model weight or dataset is published.

## Skills: actual use

`skills@1.7.6` successfully installed the two selected skills from local revision `9f954c3b63fda0d1875252009c196bf15072c1ca`, with telemetry and npm lifecycle scripts disabled. Its responsive naming mismatch was observed, the duplicate generated copy removed, and the repository installer produced the two canonical directories. Real Codex app-server `skills/list` returned exactly `planner` and `frontend-responsive-ui`, `scope: repo`, `enabled: true`, no errors. `scripts/verify-codex-discovery.mjs` reproduces this check without model/API calls.

Both installed SKILL.md files were read and invoked during this task: planner produced `skills-integration-plan.md`; responsive guidance produced a concrete CSS improvement (44px minimum buttons/navigation targets, 1rem input text) and viewport acceptance tests. User requirements override the planner's redundant clarification and plan-only suggestions. No credentialed helper, hook, subagent or upstream executable ran. `frontend-design` is withheld because its referenced license is missing. No selected text is redistributed; ignored local copies do not acquire the product's license.

## Real local checks

- `npm run check`: passed.
- `npm test`: 36 tests passed, including real independent Git checkout, missing source, wrong SHA, missing Git, malformed frontmatter, unknown arguments, modified installed text, dirty upstream and repeated installation without extra directories or file rewrite.
- `bash -n scripts/setup-codex-skills.sh`: passed.
- Chromium: 34 desktop/mobile tests passed; additional acceptance at 375, 414, 768, 1024, 1440px checks RTL, no horizontal overflow and button target sizes.
- Exact Pages staging commands executed: 11 files total (two HTML, two CSS, favicon, five browser modules, `.nojekyll`); no vendor, skill, installer, development server, documentation or test files.
- Development browser server now uses only Node built-ins and serves that allowlist on loopback; Python is no longer a browser-test prerequisite.

## GitHub work disposition

No open Issues were returned by the authenticated repository search. Draft PR #4 (`feat/corpus-import-and-ml-gates`, tip `764077c18512e60a7d2d85976b85b54350dceb5b`) retains unique local sentiment/poetry smoke and consent/origin HTTP evidence under `ml/evidence/`. Local corpus import is already released separately. Smoke is not accuracy: retain the draft and its branch as documented deferred research; do not merge or delete the only branch evidence to make the sidebar look closed.

Other existing branches were inventoried: `chore/maintenance-and-retirement-gates`, `chore/product-maintenance-skill-cleanup`, `chore/switch-to-am-will-codex-skills`, `docs/verified-public-suite-release`, `feat/five-independent-persian-text-tools`, `feat/local-corpus-import-release`, `feat/persian-nlp-studio-public-mvp`, `fix/pages-artifact-name-per-attempt`. Their product outcomes are represented on master; history tips are retained rather than deleting evidence during a blocked retirement. No additional experimental feature is activated by this release.

## Retirement blockers

Authenticated read-only access to the legacy repository is available, but no two independent encrypted destinations or established key-recovery workflow are configured. Only local drive C: was identified. Automatic approval review rejected a full mirror into unencrypted staging because it could expose sensitive assets before secure storage was established. No mirror, backup completeness claim, archive checksum, restoration verification, asset-disposal decision or deletion is asserted. No archive/visibility/deletion operation was performed.

A complete private inventory, LFS/submodule export, discussions/releases/wiki/config export, two independent encrypted copies, hash/ref comparison and offline restoration remain mandatory. These records must stay outside this public repository. The owner must receive the evidence and explicitly approve deletion of the exact legacy repository only after all gates pass. See MAINTENANCE.md. Full closure remains blocked; release scope is the tested offline tool suite and skills integration only.

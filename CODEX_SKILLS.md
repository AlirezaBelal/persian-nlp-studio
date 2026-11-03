# Project-local Codex skills

Source: https://github.com/am-will/codex-skills.git
Git submodule: `vendor/codex-skills`
Pinned revision: `9f954c3b63fda0d1875252009c196bf15072c1ca`

## Reproducible setup

Requires Node.js 22+ and Git on PATH. From a clean checkout:

```sh
node scripts/setup-codex-skills.mjs --init
node scripts/setup-codex-skills.mjs --check
# Equivalent Bash wrapper:
bash scripts/setup-codex-skills.sh --init
```

`--init` initializes only this submodule and installs. Default `--install` works offline after initialization. Repeating setup leaves identical files unchanged. `--check` is read-only and fails on missing/modified installed skills. Wrong gitlink, wrong checkout SHA, dirty upstream, malformed frontmatter, symlink destinations, missing Git/source and unknown arguments fail clearly. Git authentication cannot prompt (stdin is ignored); this source is public. No credentials are required.

Installed project files (ignored by Git):
- `.agents/skills/planner/SKILL.md`
- `.agents/skills/frontend-responsive-ui/SKILL.md`

Codex supports repository skills in `.agents/skills` ([official documentation](https://developers.openai.com/codex/skills)). The repository-owned installer copies only reviewed Markdown and normalizes the responsive skill's human-readable `name` to `frontend-responsive-ui`. It never installs upstream scripts, hooks, agents, dependencies or API integrations. CI exercises installation, not instruction execution. No global skill is changed. Reopen/reload the project after installation if an existing client caches its catalog.

## Verified CLI alternative and compatibility

`gh skill install` is not a built-in GitHub CLI command ([manual](https://cli.github.com/manual/gh)); the previous installer was unsupported. Upstream documents the [skills CLI](https://github.com/vercel-labs/skills). This exact command was executed successfully on the pinned local source with skills 1.7.6 (Node >=22.20):

```sh
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npm_config_ignore_scripts=true \
  npx --yes skills@1.7.6 add ./vendor/codex-skills \
  --skill planner --skill 'Frontend Responsive Design Standards' --agent codex --copy --yes
```

That CLI uses the frontmatter name, creating `frontend-responsive-design-standards`, rather than the upstream folder name. Do not combine both installation methods: it creates duplicate responsive entries. The project installer avoids that naming mismatch, npm/network requirements and CLI dependency drift. Its output is a supported Codex directory, not a claim that submodules activate skills. The CLI tarball was inspected before running; telemetry was disabled. No CLI dependency is added to the product.

## Licensing and security review

The pinned collection has no root LICENSE or COPYING file. `frontend-design` refers to a missing `LICENSE.txt`; it is **not installed**. Do not represent the collection as MIT or redistribute selected skill text under the product license. The selected local copies are ignored; only the original submodule reference is published. Local installation is explicitly authorized by the owner, but does not resolve upstream redistribution rights. Seek upstream license clarification before vendoring or distributing copies. Planner and responsive skills contain only Markdown; neither requires an API key. Planner mentions Context7, which is unavailable and is not installed: use official documentation directly, keep private content local, and respect project/user rules over skill suggestions (including redundant questions or plan-only limits).

All 22 upstream definitions remain inspectable in the pinned submodule for explicit review. `read-github` may transfer repository context to gitmcp.io; Context7, Gemini and council tools may require credentials. None is activated. No upstream hooks, setup scripts, agents or model services run.

## Discovery and invocation verification

Run `node scripts/verify-codex-discovery.mjs` with Codex on PATH. This uses Codex's `skills/list` app-server request with this checkout as `cwds` and `forceReload: true`; require exactly the two names above with `scope: repo`, `enabled: true`, and no errors. This checks the real Codex loader, beyond filesystem assertions. Explicitly invoke `$planner` for a bounded audit plan and `$frontend-responsive-ui` for the responsive acceptance audit. Read the installed files, apply them to the task, and record the resulting plan/browser evidence. A successful install alone is not invocation. This chat's initial skill catalog does not dynamically change; the local Codex loader can independently reload it.

## Updating

Review the source diff, rights, frontmatter, scripts and external calls in an isolated PR before changing the gitlink and installer pin together. Run unit, integration, Bash and browser checks, then verify CI and the exact merged Pages deployment. Never use unpinned `skills update` for this integration. Pages packages only its explicit application asset allowlist, excluding `vendor`, `.agents`, `scripts` and docs.

# Codex skills source

This project uses the external [am-will/codex-skills](https://github.com/am-will/codex-skills) collection **instead of** its previous custom GitHub maintainer skill.

## Source and version

- Git submodule: `vendor/codex-skills`
- Upstream: `https://github.com/am-will/codex-skills.git`
- Pinned Git commit: `9f954c3b63fda0d1875252009c196bf15072c1ca`
- Source contains 22 skill definitions plus additional agents, hook bundles, scripts and optional integrations.

The submodule is a **reference**, not an automatically executed dependency. It is outside the Pages asset allowlist. GitHub Actions must never run upstream setup scripts or install arbitrary hooks. Updates to the pin require code review, including a review of added scripts, license notices and external network calls.

## Install for Codex in this project (opt in)

On a trusted development machine, with Git and a recent GitHub CLI supporting `gh skill install`:

```bash
git submodule update --init -- vendor/codex-skills
bash scripts/setup-codex-skills.sh
```

The bootstrap checks that the checkout matches the pinned commit, then installs only the `planner` and `frontend-responsive-ui` skills for Codex at project scope. It does not install or run any of the collection's hooks, agents, third-party model APIs or browsing tools.

You can inspect the upstream collection before opting in:

```bash
git -C vendor/codex-skills log -1 --format='%H %s'
cat vendor/codex-skills/skills/planner/SKILL.md
cat vendor/codex-skills/skills/frontend-responsive-ui/SKILL.md
```

Alternatively, use the upstream project's official selector to choose other skills **manually**:

```bash
npx skills add am-will/codex-skills --list
```

The remote selector above inspects the current upstream repository; it is **not pinned** to this project's submodule commit. Review selected skills before installing and prefer the pinned local source for reproducibility.

### Important privacy and permissions boundary

- Do not send private repository content to external documentation services such as gitmcp.io without explicit permission. In particular, `read-github` is **not** installed by default.
- Do not run hooks or startup scripts from the collection automatically.
- No installer can grant GitHub privileges: access must come from an explicitly authorized GitHub account or connector.
- Retain product safeguards defined in `AGENTS.md`, `MAINTENANCE.md`, `PRIVACY.md` and `SECURITY.md`.
- This repository currently stores the *source reference and installer*, not a claim that a developer's Codex environment has executed the installer. Confirm installation locally before claiming an active skill.

## Updating the external collection

Treat this as a third-party dependency review. Fetch, inspect changes and move the submodule pin in an isolated PR; run existing tests, check the GitHub Pages allowlist and report the exact new SHA. Do not make automatic, unreviewed updates or commit entire upstream directories into the deployed site.

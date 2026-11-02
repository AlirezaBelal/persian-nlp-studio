#!/usr/bin/env bash
# Opt-in installation. Never executed by GitHub Actions or the public website.
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
upstream_sha="9f954c3b63fda0d1875252009c196bf15072c1ca"
source_dir="$root/vendor/codex-skills"

if [[ "${1:-}" == "--help" ]]; then
  printf '%s\n' 'Install selected am-will/codex-skills from the pinned submodule into THIS Codex project.' \
    'Requires git and GitHub CLI with the gh skill command.' \
    'This script never runs third-party hooks or installs their optional dependencies.' \
    'Usage: bash scripts/setup-codex-skills.sh'
  exit 0
fi
if [[ $# -ne 0 ]]; then
  echo "Unexpected arguments. Use --help." >&2
  exit 2
fi
command -v git >/dev/null 2>&1 || { echo "git is required" >&2; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "GitHub CLI (gh) is required" >&2; exit 1; }
if ! gh skill install --help >/dev/null 2>&1; then
  echo "The gh skill extension/command is unavailable. See CODEX_SKILLS.md." >&2
  exit 1
fi
if ! git -C "$root" rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "Run from a checked-out Git repository." >&2
  exit 1
fi
git -C "$root" submodule update --init -- vendor/codex-skills
actual_sha="$(git -C "$source_dir" rev-parse HEAD)"
if [[ "$actual_sha" != "$upstream_sha" ]]; then
  echo "Refusing unexpected upstream SHA: $actual_sha" >&2
  exit 1
fi
# These are text-based skills; the collection also contains scripts and hooks
# which are deliberately NOT installed or executed by this bootstrapper.
cd "$root"
gh skill install "$source_dir" planner --from-local --agent codex --scope project
gh skill install "$source_dir" frontend-responsive-ui --from-local --agent codex --scope project
printf '%s\n' 'Installed selected project-scoped skills. Restart Codex and inspect the results.'

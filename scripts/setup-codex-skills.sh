#!/usr/bin/env bash
set -euo pipefail
command -v node >/dev/null 2>&1 || { echo 'Node.js 22+ is required' >&2; exit 1; }
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
exec node "$root/scripts/setup-codex-skills.mjs" "$@"

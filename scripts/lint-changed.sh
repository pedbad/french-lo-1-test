#!/usr/bin/env bash

set -euo pipefail

MODE="against"
BASE_REF="origin/main"

while [[ $# -gt 0 ]]; do
	case "$1" in
		--staged)
			MODE="staged"
			shift
			;;
		--against)
			MODE="against"
			BASE_REF="${2:-origin/main}"
			shift 2
			;;
		*)
			echo "Usage: $0 [--staged] [--against <ref>]" >&2
			exit 2
			;;
	esac
done

changed_files=""
if [[ "$MODE" == "staged" ]]; then
	changed_files="$(git diff --cached --name-only --diff-filter=ACMR || true)"
else
	if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
		echo "lint-changed: base ref '$BASE_REF' not found." >&2
		exit 1
	fi
	changed_files="$(git diff --name-only --diff-filter=ACMR "$BASE_REF"...HEAD || true)"
fi

lintable_files=()
while IFS= read -r file; do
	lintable_files+=("$file")
done < <(
	printf "%s\n" "$changed_files" \
	| grep -E '\.(js|jsx|mjs|cjs|ts|tsx)$' \
	| sed '/^\s*$/d' \
	| sort -u
)

if [[ ${#lintable_files[@]} -eq 0 ]]; then
	echo "lint-changed: no changed JS/TS files to lint."
	exit 0
fi

echo "lint-changed: linting ${#lintable_files[@]} changed file(s)."
yarn -s eslint "${lintable_files[@]}"

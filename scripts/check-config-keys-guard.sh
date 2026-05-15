#!/usr/bin/env bash
set -euo pipefail

# Config key schema guard.
# Blocks banned legacy instruction keys from being reintroduced into LO JSON configs.
#
# Banned keys (replaced by canonical informationText / informationTextHTML):
#   instructionsText, instructionsTextHTML, infoText, infoTextHTML
#
# Run modes:
#   --staged          check only staged JSON files (pre-commit)
#   --working         check only working-tree JSON files
#   --against <ref>   check JSON files changed since <ref> (pre-push / CI)
#   (no args)         check all lo-config JSON files

MODE="all"
REF=""

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--help]"
	echo ""
	echo "Blocks banned legacy config keys in src/lo-config/*.json:"
	echo "  instructionsText, instructionsTextHTML, infoText, infoTextHTML"
}

while [[ $# -gt 0 ]]; do
	case "$1" in
	--staged)
		MODE="staged"
		shift
		;;
	--working)
		MODE="working"
		shift
		;;
	--against)
		MODE="against"
		REF="${2:-}"
		if [[ -z "$REF" ]]; then
			echo "Error: --against requires a git ref"
			exit 2
		fi
		shift 2
		;;
	--help|-h)
		usage
		exit 0
		;;
	*)
		echo "Unknown option: $1"
		usage
		exit 2
		;;
	esac
done

# Resolve the list of JSON files to check.
if [[ "$MODE" == "staged" ]]; then
	FILES="$(git diff --cached --name-only -- 'src/lo-config/*.json' || true)"
elif [[ "$MODE" == "working" ]]; then
	FILES="$(git diff --name-only -- 'src/lo-config/*.json' || true)"
elif [[ "$MODE" == "against" ]]; then
	FILES="$(git diff "${REF}...HEAD" --name-only -- 'src/lo-config/*.json' || true)"
else
	# No mode — check all LO config files.
	FILES="$(find src/lo-config -maxdepth 1 -name '*.json' | sort || true)"
fi

if [[ -z "$FILES" ]]; then
	echo "Config key guard: no LO JSON files to check."
	exit 0
fi

BANNED_PATTERN='"(instructionsText|instructionsTextHTML|infoText|infoTextHTML)"[[:space:]]*:'

violations=()

while IFS= read -r file; do
	[[ -f "$file" ]] || continue
	while IFS= read -r line; do
		violations+=("  $file: $line")
	done < <(grep -nE "$BANNED_PATTERN" "$file" || true)
done <<< "$FILES"

if [[ ${#violations[@]} -gt 0 ]]; then
	echo "Config key guard failed."
	echo ""
	echo "Banned legacy instruction keys found in LO config files."
	echo "Use the canonical keys instead:"
	echo "  Plain text  -> \"informationText\""
	echo "  HTML        -> \"informationTextHTML\""
	echo ""
	echo "Violations:"
	printf '%s\n' "${violations[@]}"
	exit 1
fi

echo "Config key guard passed."

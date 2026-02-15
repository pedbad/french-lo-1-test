#!/usr/bin/env bash
set -euo pipefail

MODE="staged"
REF=""

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--help]"
	echo ""
	echo "Blocks SCSS drift:"
	echo "  - any .scss/.sass files in src/"
	echo "  - newly added SCSS/SASS imports in JS/TS files"
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

if [[ "$MODE" == "staged" ]]; then
	NEW_STYLE_FILES="$(git diff --cached --name-only --diff-filter=A -- '*.scss' '*.sass' || true)"
	DIFF_CMD=(git diff --cached -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs')
elif [[ "$MODE" == "working" ]]; then
	NEW_STYLE_FILES="$(git diff --name-only --diff-filter=A -- '*.scss' '*.sass' || true)"
	DIFF_CMD=(git diff -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs')
else
	NEW_STYLE_FILES="$(git diff "${REF}...HEAD" --name-only --diff-filter=A -- '*.scss' '*.sass' || true)"
	DIFF_CMD=(git diff "${REF}...HEAD" -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs')
fi

if [[ -n "$NEW_STYLE_FILES" ]]; then
	echo "SCSS guard failed."
	echo "New SCSS/SASS files were introduced."
	echo ""
	echo "Use Tailwind utilities + tokens instead of adding new SCSS files."
	echo ""
	echo "New style files:"
	printf '%s\n' "$NEW_STYLE_FILES"
	exit 1
fi

EXISTING_STYLE_FILES="$(find src -type f \( -name '*.scss' -o -name '*.sass' \) | sort || true)"
if [[ -n "$EXISTING_STYLE_FILES" ]]; then
	echo "SCSS guard failed."
	echo "SCSS/SASS files still exist in src/."
	echo ""
	echo "Project policy now requires zero SCSS source files."
	echo ""
	echo "Remaining style files:"
	printf '%s\n' "$EXISTING_STYLE_FILES"
	exit 1
fi

DIFF_OUTPUT="$("${DIFF_CMD[@]}")"

if [[ -z "$DIFF_OUTPUT" ]]; then
	echo "SCSS guard: no relevant changes."
	exit 0
fi

IMPORT_RE='import[[:space:]]+.*["'"'"'][^"'"'"']+\.(scss|sass)["'"'"']'
DYNAMIC_IMPORT_RE='import\([[:space:]]*["'"'"'][^"'"'"']+\.(scss|sass)["'"'"'][[:space:]]*\)'
REQUIRE_RE='require\([[:space:]]*["'"'"'][^"'"'"']+\.(scss|sass)["'"'"'][[:space:]]*\)'

violations=()
current_file=""

while IFS= read -r line; do
	if [[ "$line" == "+++ "* ]]; then
		current_file="${line#+++ }"
		current_file="${current_file#a/}"
		current_file="${current_file#b/}"
		continue
	fi

	[[ "$line" == +* ]] || continue
	[[ "$line" == "+++"* ]] && continue

	added_line="${line#+}"

	# Ignore empty and comment-only lines.
	[[ "$added_line" =~ ^[[:space:]]*$ ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*// ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*/\* ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*\* ]] && continue

	if [[ "$added_line" =~ $IMPORT_RE ]] || [[ "$added_line" =~ $DYNAMIC_IMPORT_RE ]] || [[ "$added_line" =~ $REQUIRE_RE ]]; then
		violations+=("${current_file}: ${added_line}")
	fi
done <<< "$DIFF_OUTPUT"

if [[ ${#violations[@]} -gt 0 ]]; then
	echo "SCSS guard failed."
	echo "Added lines introduce SCSS/SASS imports."
	echo ""
	echo "Use Tailwind utilities + tokenized styles instead of new SCSS imports."
	echo ""
	echo "Offending added lines:"
	printf '%s\n' "${violations[@]}"
	exit 1
fi

echo "SCSS guard passed."

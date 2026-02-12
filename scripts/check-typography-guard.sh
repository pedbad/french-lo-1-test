#!/usr/bin/env bash
set -euo pipefail

MODE="staged"
REF=""

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--help]"
	echo ""
	echo "Checks added typography declarations and blocks:"
	echo "  - font-size with px/rem/em"
	echo "  - line-height with px/rem/em"
	echo "  - direct font-family declarations"
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
	DIFF_CMD=(git diff --cached -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx')
elif [[ "$MODE" == "working" ]]; then
	DIFF_CMD=(git diff -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx')
else
	DIFF_CMD=(git diff "${REF}...HEAD" -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx')
fi

DIFF_OUTPUT="$("${DIFF_CMD[@]}")"

if [[ -z "$DIFF_OUTPUT" ]]; then
	echo "Typography guard: no relevant changes."
	exit 0
fi

VIOLATIONS="$(
	printf '%s\n' "$DIFF_OUTPUT" \
		| awk '
			# Keep only added lines from the patch, skip patch headers.
			/^\+\+\+/ { next }
			/^\+/     { print }
		' \
		| grep -Ev '^\+\s*//|^\+\s*/\*|^\+\s*\*|^\+\s*$' \
		| grep -En 'font-size\s*:\s*[^;]*(px|rem|em)\b|line-height\s*:\s*[^;]*(px|rem|em)\b|font-family\s*:' \
		|| true
)"

if [[ -n "$VIOLATIONS" ]]; then
	echo "Typography guard failed."
	echo "Added lines contain forbidden typography declarations."
	echo ""
	echo "Use token/utility-driven typography instead (index.css tokens + Tailwind/shadcn classes)."
	echo ""
	echo "Offending added lines:"
	echo "$VIOLATIONS"
	exit 1
fi

echo "Typography guard passed."

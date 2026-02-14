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
	echo "  - font-family declarations unless tokenized (var(--font-...))"
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
			/^\+\+\+ / {
				current_file = $0
				sub(/^\+\+\+ [ab]\//, "", current_file)
				next
			}

			# Keep only added lines from the patch, skip patch headers.
			! /^\+/   { next }
			/^\+\s*$/ { next }
			/^\+\s*\/\// { next }
			/^\+\s*\/\*/ { next }
			/^\+\s*\*/ { next }
			{
				raw = $0
				line = tolower($0)

				if (line ~ /font-size[[:space:]]*:[^;]*(px|rem|em)\b/) {
					print NR ":" raw
					next
				}

				if (line ~ /line-height[[:space:]]*:[^;]*(px|rem|em)\b/) {
					print NR ":" raw
					next
				}

				# Allow font-family only when tokenized via var(--font-...)
				if (line ~ /font-family[[:space:]]*:/) {
					# Allow literal font-family declarations in the dedicated font-face registry.
					if (current_file ~ /src\/styles\/fonts\.css$/) {
						next
					}
					if (line !~ /font-family[[:space:]]*:[[:space:]]*var\([[:space:]]*--font-[a-z0-9-]+/) {
						print NR ":" raw
					}
				}
			}
		' \
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

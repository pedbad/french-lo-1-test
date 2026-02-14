#!/usr/bin/env bash
set -euo pipefail

MODE="staged"
REF=""

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--help]"
	echo ""
	echo "Checks added markup for common W3C/a11y-invalid patterns:"
	echo "  - <header role=\"button\">"
	echo "  - aria-label on <span>"
	echo "  - aria-label on <div> without an explicit non-generic role"
	echo "  - title attribute on <svg>"
	echo "  - spaces in <img src=\"...\"> URL path segments"
	echo "  - repeated literal id=\"...\" values within added lines"
	echo "  - newly introduced duplicate literal id=\"...\" attributes in staged/indexed content"
}

extract_literal_ids() {
	perl -ne 'while (/\bid\b\s*=\s*(?:\{\s*)?["\x27]([^"\x27]+)["\x27](?:\s*\})?/ig) { print "$1\n"; }'
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
	DIFF_CMD=(git diff --cached -U0 -- '*.jsx' '*.tsx' '*.html' '*.json')
elif [[ "$MODE" == "working" ]]; then
	DIFF_CMD=(git diff -U0 -- '*.jsx' '*.tsx' '*.html' '*.json')
else
	DIFF_CMD=(git diff "${REF}...HEAD" -U0 -- '*.jsx' '*.tsx' '*.html' '*.json')
fi

DIFF_OUTPUT="$("${DIFF_CMD[@]}")"

if [[ -z "$DIFF_OUTPUT" ]]; then
	echo "A11y guard: no relevant changes."
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
			! /^\+/     { next }
			/^\+\s*$/   { next }
			/^\+\s*\/\// { next }
			/^\+\s*\/\*/ { next }
			/^\+\s*\*/  { next }
			{
				raw = $0
				line = tolower($0)

				if (line ~ /<header[^>]*role=[\"\047]button[\"\047]/) {
					print NR ":" raw "  [header-role-button]"
					next
				}

				if (line ~ /<span[^>]*aria-label[[:space:]]*=/) {
					print NR ":" raw "  [span-aria-label]"
					next
				}

				if (line ~ /<div[^>]*aria-label[[:space:]]*=/) {
					if (line !~ /role[[:space:]]*=/) {
						print NR ":" raw "  [div-aria-label-no-role]"
						next
					}
					if (line ~ /role[[:space:]]*=[\"\047](generic|presentation)[\"\047]/) {
						print NR ":" raw "  [div-aria-label-generic-role]"
						next
					}
				}

				if (line ~ /<svg[^>]*title[[:space:]]*=/) {
					print NR ":" raw "  [svg-title-attr]"
					next
				}

				if (line ~ /<img[^>]*src[[:space:]]*=[\"\047][^\"\047]* [^\"\047]*[\"\047]/) {
					print NR ":" raw "  [img-src-space]"
					next
				}
			}
		' \
		|| true
)"

if [[ -n "$VIOLATIONS" ]]; then
	echo "A11y/W3C guard failed."
	echo "Added lines contain patterns that commonly fail HTML validation."
	echo ""
	echo "Offending added lines:"
	echo "$VIOLATIONS"
	exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

ADDED_IDS_FILE="$TMP_DIR/added_ids.txt"
ADDED_IDS_RAW_FILE="$TMP_DIR/added_ids_raw.txt"
BEFORE_COUNTS_FILE="$TMP_DIR/before_counts.tsv"
AFTER_COUNTS_FILE="$TMP_DIR/after_counts.tsv"

printf '%s\n' "$DIFF_OUTPUT" \
	| awk '
		/^\+\+\+ / { next }
		/^\+/ { print substr($0, 2) }
	' \
	| extract_literal_ids > "$ADDED_IDS_RAW_FILE"

if [[ -s "$ADDED_IDS_RAW_FILE" ]]; then
	sort -u "$ADDED_IDS_RAW_FILE" > "$ADDED_IDS_FILE"
else
	: > "$ADDED_IDS_FILE"
fi

ADDED_LINE_DUPLICATE_IDS="$(
	if [[ -s "$ADDED_IDS_RAW_FILE" ]]; then
		sort "$ADDED_IDS_RAW_FILE" \
			| uniq -c \
			| awk '$1 > 1 {count=$1; $1=""; sub(/^ +/, ""); print $0 "\t" count}' \
			|| true
	fi
)"

if [[ -n "$ADDED_LINE_DUPLICATE_IDS" ]]; then
	echo "A11y/W3C guard failed."
	echo "Staged added lines repeat literal id attributes."
	echo ""
	echo "Duplicate literal ids in added lines:"
	echo "$ADDED_LINE_DUPLICATE_IDS" | awk -F '\t' '{printf "  id=\"%s\" (added %s times)\n", $1, $2}'
	exit 1
fi

if [[ -s "$ADDED_IDS_FILE" ]]; then
	if git rev-parse --verify HEAD >/dev/null 2>&1; then
		(git grep -h -i -E 'id[[:space:]]*=' HEAD -- '*.jsx' '*.tsx' '*.html' '*.json' || true) \
			| extract_literal_ids \
			| sort \
			| uniq -c \
			| awk '{count=$1; $1=""; sub(/^ +/, ""); print $0 "\t" count}' > "$BEFORE_COUNTS_FILE"
	else
		: > "$BEFORE_COUNTS_FILE"
	fi

	(git grep --cached -h -i -E 'id[[:space:]]*=' -- '*.jsx' '*.tsx' '*.html' '*.json' || true) \
		| extract_literal_ids \
		| sort \
		| uniq -c \
		| awk '{count=$1; $1=""; sub(/^ +/, ""); print $0 "\t" count}' > "$AFTER_COUNTS_FILE"

	DUPLICATE_ID_VIOLATIONS="$(
		awk -F '\t' '
			FILENAME == ARGV[1] { before[$1] = $2; next }
			FILENAME == ARGV[2] { after[$1] = $2; next }
			FILENAME == ARGV[3] {
				id = $1
				if (id == "") next
				beforeCount = (id in before) ? before[id] : 0
				afterCount = (id in after) ? after[id] : 0
				if (afterCount > 1 && afterCount > beforeCount) {
					print id "\t" beforeCount "\t" afterCount
				}
			}
		' "$BEFORE_COUNTS_FILE" "$AFTER_COUNTS_FILE" "$ADDED_IDS_FILE" \
		| sort -u \
		|| true
	)"

	if [[ -n "$DUPLICATE_ID_VIOLATIONS" ]]; then
		echo "A11y/W3C guard failed."
		echo "Staged changes introduce duplicate literal id attributes."
		echo ""
		echo "Duplicate ids introduced (before -> after counts):"
		echo "$DUPLICATE_ID_VIOLATIONS" | awk -F '\t' '{printf "  id=\"%s\" (%s -> %s)\n", $1, $2, $3}'
		exit 1
	fi
fi

echo "A11y/W3C guard passed."

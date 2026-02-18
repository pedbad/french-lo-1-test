#!/usr/bin/env bash
set -euo pipefail

MODE="staged"
REF=""

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--help]"
	echo ""
	echo "Image asset migration guard:"
	echo "  - blocks newly added files under public/images/ (legacy path)"
	echo "  - validates new public/img filenames (ASCII, lowercase, no spaces)"
	echo "  - blocks newly added legacy image references (images/ or /images/) in source diffs"
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
	NEW_PUBLIC_IMG_FILES="$(git diff --cached --name-only --diff-filter=AR -- 'public/img/**' || true)"
	NEW_LEGACY_IMAGE_FILES="$(git diff --cached --name-only --diff-filter=A -- 'public/images/**' || true)"
	DIFF_CMD=(git diff --cached -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.json' '*.css' '*.scss' '*.sass' '*.html')
elif [[ "$MODE" == "working" ]]; then
	NEW_PUBLIC_IMG_FILES="$(git diff --name-only --diff-filter=AR -- 'public/img/**' || true)"
	NEW_LEGACY_IMAGE_FILES="$(git diff --name-only --diff-filter=A -- 'public/images/**' || true)"
	DIFF_CMD=(git diff -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.json' '*.css' '*.scss' '*.sass' '*.html')
else
	NEW_PUBLIC_IMG_FILES="$(git diff "${REF}...HEAD" --name-only --diff-filter=AR -- 'public/img/**' || true)"
	NEW_LEGACY_IMAGE_FILES="$(git diff "${REF}...HEAD" --name-only --diff-filter=A -- 'public/images/**' || true)"
	DIFF_CMD=(git diff "${REF}...HEAD" -U0 -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.json' '*.css' '*.scss' '*.sass' '*.html')
fi

if [[ -n "$NEW_LEGACY_IMAGE_FILES" ]]; then
	echo "Image guard failed."
	echo "New files were added under legacy path public/images/."
	echo ""
	echo "Use public/img/ for all new assets."
	echo ""
	echo "New legacy-path files:"
	printf '%s\n' "$NEW_LEGACY_IMAGE_FILES"
	exit 1
fi

IMG_NAME_VIOLATIONS=()

while IFS= read -r file; do
	[[ -z "$file" ]] && continue

	# Allow docs/sentinels in folders.
	if [[ "$file" =~ \.gitkeep$ ]] || [[ "$file" =~ \.md$ ]]; then
		continue
	fi

	# Require printable ASCII path to avoid normalization drift.
	if ! printf '%s' "$file" | perl -ne 'exit(!/^[\x20-\x7E]+$/)'; then
		IMG_NAME_VIOLATIONS+=("$file :: path must be ASCII-only")
		continue
	fi

	if [[ "$file" =~ [[:space:]] ]]; then
		IMG_NAME_VIOLATIONS+=("$file :: spaces are not allowed")
		continue
	fi

	if [[ "$file" =~ [A-Z] ]]; then
		IMG_NAME_VIOLATIONS+=("$file :: uppercase characters are not allowed")
		continue
	fi

	base="$(basename "$file")"
	if ! [[ "$base" =~ ^[a-z0-9]+([._-][a-z0-9]+)*\.(png|jpg|jpeg|svg|webp|gif|avif)$ ]]; then
		IMG_NAME_VIOLATIONS+=("$file :: use lowercase kebab/snake filename with extension png|jpg|jpeg|svg|webp|gif|avif")
	fi
done <<< "$NEW_PUBLIC_IMG_FILES"

if [[ ${#IMG_NAME_VIOLATIONS[@]} -gt 0 ]]; then
	echo "Image guard failed."
	echo "New public/img asset names do not follow policy."
	echo ""
	echo "Violations:"
	printf '  - %s\n' "${IMG_NAME_VIOLATIONS[@]}"
	exit 1
fi

DIFF_OUTPUT="$("${DIFF_CMD[@]}")"

if [[ -z "$DIFF_OUTPUT" ]]; then
	echo "Image guard passed."
	exit 0
fi

LEGACY_REF_VIOLATIONS="$(
	printf '%s\n' "$DIFF_OUTPUT" \
		| awk '
			/^\+\+\+ / {
				current_file = $0
				sub(/^\+\+\+ [ab]\//, "", current_file)
				next
			}
			! /^\+/    { next }
			/^\+\+\+/  { next }
			{
				raw = $0
				line = substr($0, 2)
				if (line ~ /(^|[^A-Za-z0-9_-])(\/?images\/)/) {
					print current_file ": " line
				}
			}
		' \
		|| true
)"

if [[ -n "$LEGACY_REF_VIOLATIONS" ]]; then
	echo "Image guard failed."
	echo "Added lines introduced legacy image references (images/ or /images/)."
	echo ""
	echo "Use img/ paths instead."
	echo ""
	echo "Offending added lines:"
	echo "$LEGACY_REF_VIOLATIONS"
	exit 1
fi

echo "Image guard passed."

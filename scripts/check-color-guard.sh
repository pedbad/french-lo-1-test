#!/usr/bin/env bash
set -euo pipefail

MODE="staged"
REF=""
ALLOWLIST_FILE="scripts/color-allowlist.txt"

usage() {
	echo "Usage: $0 [--staged|--working|--against <ref>] [--allowlist <file>] [--help]"
	echo ""
	echo "Checks added style-like lines and blocks literal color drift."
	echo ""
	echo "Allowed by default:"
	echo "  - tokenized color usage via var(--...)"
	echo "  - files listed in scripts/color-allowlist.txt"
	echo ""
	echo "Blocked examples (outside allowlist):"
	echo "  - hex colors: #fff, #ffcc00"
	echo "  - color functions without tokens: rgb(...), hsl(...), oklch(...)"
	echo "  - named colors: black, white, red, blue, ..."
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
	--allowlist)
		ALLOWLIST_FILE="${2:-}"
		if [[ -z "$ALLOWLIST_FILE" ]]; then
			echo "Error: --allowlist requires a file path"
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

if [[ ! -f "$ALLOWLIST_FILE" ]]; then
	echo "Error: allowlist file not found: $ALLOWLIST_FILE"
	exit 2
fi

if [[ "$MODE" == "staged" ]]; then
	DIFF_CMD=(git diff --cached -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx' '*.js' '*.ts')
elif [[ "$MODE" == "working" ]]; then
	DIFF_CMD=(git diff -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx' '*.js' '*.ts')
else
	DIFF_CMD=(git diff "${REF}...HEAD" -U0 -- '*.scss' '*.css' '*.jsx' '*.tsx' '*.js' '*.ts')
fi

DIFF_OUTPUT="$("${DIFF_CMD[@]}")"

if [[ -z "$DIFF_OUTPUT" ]]; then
	echo "Color guard: no relevant changes."
	exit 0
fi

ALLOWLIST_PATTERNS=()
while IFS= read -r pattern; do
	ALLOWLIST_PATTERNS+=("$pattern")
done < <(grep -Ev '^[[:space:]]*(#|$)' "$ALLOWLIST_FILE" || true)

is_allowlisted_file() {
	local file="$1"
	local pattern
	for pattern in "${ALLOWLIST_PATTERNS[@]}"; do
		[[ -z "$pattern" ]] && continue
		if [[ "$file" == $pattern ]]; then
			return 0
		fi
	done
	return 1
}

is_color_violation() {
	local line="$1"

	# Reduce false positives by only scanning style-like contexts.
	if [[ ! "$line" =~ (color[[:space:]]*:|background[[:space:]]*:|border[[:space:]-]*:|fill[[:space:]]*:|stroke[[:space:]]*:|box-shadow[[:space:]]*:|text-shadow[[:space:]]*:|outline[[:space:]-]*:|filter[[:space:]]*:|class(name)?=|style=|text-|bg-|border-|from-|to-|via-|stroke-|fill-|shadow-) ]]; then
		return 1
	fi

	# Hex literals.
	if [[ "$line" =~ \#[0-9a-f]{3,8}\b ]]; then
		return 0
	fi

	# Named colors (keep transparent/currentColor/inherit allowed for utility usage).
	if [[ "$line" =~ (^|[^[:alnum:]_-])(black|white|red|green|blue|yellow|orange|purple|pink|brown|gray|grey|silver|gold|maroon|navy|teal|aqua|fuchsia|lime|olive)([^[:alnum:]_-]|$) ]]; then
		return 0
	fi

	# Function-style colors without token indirection.
	if [[ "$line" =~ (oklch|oklab|rgb|rgba|hsl|hsla|hwb|lab|lch|color-mix|color|linear-gradient|radial-gradient|conic-gradient)\( ]]; then
		if [[ ! "$line" =~ var\(-- ]]; then
			return 0
		fi
	fi

	return 1
}

current_file=""
violations=()

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

	# Skip empty lines and comment-only lines.
	[[ "$added_line" =~ ^[[:space:]]*$ ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*// ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*/\* ]] && continue
	[[ "$added_line" =~ ^[[:space:]]*\* ]] && continue
	[[ "$added_line" == *"<!--"* ]] && continue

	if is_allowlisted_file "$current_file"; then
		continue
	fi

	lower_line="$(printf '%s' "$added_line" | tr '[:upper:]' '[:lower:]')"
	if is_color_violation "$lower_line"; then
		violations+=("${current_file}: ${added_line}")
	fi
done <<< "$DIFF_OUTPUT"

if [[ ${#violations[@]} -gt 0 ]]; then
	echo "Color guard failed."
	echo "Added lines contain non-tokenized literal colors."
	echo ""
	echo "Use color tokens/semantic utilities instead (src/index.css + Tailwind/shadcn classes)."
	echo "If a literal is intentional, add a narrow file pattern to $ALLOWLIST_FILE."
	echo ""
	echo "Offending added lines:"
	printf '%s\n' "${violations[@]}"
	exit 1
fi

echo "Color guard passed."

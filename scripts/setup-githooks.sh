#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath .githooks
echo "Git hooks enabled for this repo (.githooks)."
echo "Pre-commit now runs: yarn -s check:typography"


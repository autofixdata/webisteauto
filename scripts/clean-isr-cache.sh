#!/usr/bin/env bash
set -euo pipefail

# Get directory of this script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run Node cleanup script
node "${DIR}/clean-isr-cache.js" "$@"

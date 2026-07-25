#!/usr/bin/env bash
# Creates a lean ZIP for CyberPanel upload (no node_modules, .next, .git, dev tools).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NAME="autofixdata-deploy"
OUT_DIR="${ROOT}/deploy/${NAME}"
ZIP_PATH="${ROOT}/deploy/${NAME}.zip"
EXCLUDE_FILE="${ROOT}/deploy.exclude"

cd "$ROOT"

echo "→ Cleaning old output…"
rm -rf "$OUT_DIR" "$ZIP_PATH"

echo "→ Copying project (excluding deploy.exclude entries)…"
mkdir -p "$OUT_DIR"
rsync -a \
  --exclude-from="$EXCLUDE_FILE" \
  --exclude='deploy.exclude' \
  ./ "$OUT_DIR/"

echo "→ Creating ZIP…"
(cd "$(dirname "$OUT_DIR")" && zip -rq "$(basename "$ZIP_PATH")" "$(basename "$OUT_DIR")")

SIZE=$(du -sh "$ZIP_PATH" | cut -f1)
echo ""
echo "✓ Ready: $ZIP_PATH ($SIZE)"
echo "  Upload this to your Ubuntu server, then: unzip → npm ci → npm run build → pm2 start"
echo "  See DEPLOY.md for full CyberPanel steps."

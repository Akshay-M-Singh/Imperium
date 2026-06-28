#!/usr/bin/env bash
# Subset Cormorant Garamond + DM Sans → WOFF2 (Latin + Latin Extended).
# See scripts/README.md. Requires: pip install fonttools brotli
set -euo pipefail

FONT_DIR="${1:-public/fonts}"
SRC_DIR="${2:-.fonts-source}"

if [ ! -d "$SRC_DIR" ]; then
  echo "Source font directory '$SRC_DIR' does not exist." >&2
  echo "Place original TTFs there and re-run." >&2
  exit 1
fi

command -v pyftsubset >/dev/null 2>&1 || {
  echo "pyftsubset not found. Install with: pip install fonttools brotli" >&2
  exit 1
}

subset_one() {
  local src="$1"
  local out="$2"
  if [ ! -f "$src" ]; then
    echo "skip: $src not found" >&2
    return
  fi
  pyftsubset "$src" \
    --unicodes="U+0000-024F,U+1E00-1EFF,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F" \
    --flavor="woff2" \
    --layout-features+="kern,liga,calt" \
    --no-hinting \
    --output-file="$out"
  echo "wrote $out"
}

mkdir -p "$FONT_DIR"
subset_one "$SRC_DIR/CormorantGaramond-Regular.ttf"     "$FONT_DIR/CormorantGaramond-Regular.woff2"
subset_one "$SRC_DIR/CormorantGaramond-Medium.ttf"       "$FONT_DIR/CormorantGaramond-Medium.woff2"
subset_one "$SRC_DIR/CormorantGaramond-SemiBold.ttf"     "$FONT_DIR/CormorantGaramond-SemiBold.woff2"
subset_one "$SRC_DIR/CormorantGaramond-Italic.ttf"       "$FONT_DIR/CormorantGaramond-Italic.woff2"
subset_one "$SRC_DIR/CormorantGaramond-MediumItalic.ttf" "$FONT_DIR/CormorantGaramond-MediumItalic.woff2"
subset_one "$SRC_DIR/DMSans-Regular.ttf"                 "$FONT_DIR/DMSans-Regular.woff2"
subset_one "$SRC_DIR/DMSans-Medium.ttf"                  "$FONT_DIR/DMSans-Medium.woff2"

echo "Done."
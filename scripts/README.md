# Imperium Italian Textile — Developer Scripts

This directory holds standalone developer helper scripts. They are not part
of the runtime build and are never imported by `src/`.

## `subset-fonts.sh`

Subsets the Cormorant Garamond and DM Sans TTF/OTF source files to Latin +
Latin Extended codepoints and produces the WOFF2 files shipped from
`/public/fonts/`. Requires `pyftsubset` (part of `fonttools`) and `woff2_compress`.

The architecture (TECHNICAL_ARCHITECTURE.md §5) mandates self-hosted WOFF2
fonts to eliminate a render-blocking external request and avoid GDPR
data-transfer concerns. This script is the production path for producing
those files; run it once when the original font binaries are obtained and
again whenever the source fonts change.

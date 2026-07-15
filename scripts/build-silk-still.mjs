import sharp from "sharp";

const OUT = "public/images/hero/silk-still.jpg";

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2880" height="1620">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#2e2117"/>
      <stop offset="60%" stop-color="#1c1208"/>
      <stop offset="100%" stop-color="#0f0a06"/>
    </radialGradient>
    <radialGradient id="shimmer" cx="55%" cy="40%" r="40%">
      <stop offset="0%" stop-color="#d4b886" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#d4b886" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
    </radialGradient>
    <filter id="silk-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="mono"/>
      <feBlend in="SourceGraphic" in2="mono" mode="soft-light"/>
    </filter>
  </defs>
  <g filter="url(#silk-grain)">
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#shimmer)"/>
    <rect width="100%" height="100%" fill="url(#vignette)"/>
  </g>
</svg>`);

await sharp(svg).resize(2880, 1620).jpeg({ quality: 85, mozjpeg: true }).toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} — ${meta.width}×${meta.height}`);

import { readFileSync } from "node:fs";
import sharp from "sharp";

const TEX = "public/images/hero/champagne-silk.jpg";
const OUT = "public/images/hero/silk-still.jpg";

const texBuf = readFileSync(TEX);

const tinted = await sharp(texBuf)
  .resize(2880, 1620, { fit: "cover" })
  .greyscale()
  .linear(0.9, 0)
  .tint({ r: 100, g: 78, b: 48 })
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer();

const vignette = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="2880" height="1620">
    <defs>
      <radialGradient id="v" cx="50%" cy="45%" r="72%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.22"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`,
);
const vignetteBuf = await sharp(vignette).resize(2880, 1620).png().toBuffer();

await sharp(tinted)
  .composite([{ input: vignetteBuf, blend: "multiply" }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} — ${meta.width}×${meta.height}`);

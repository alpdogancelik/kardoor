import sharp from "sharp";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = "nuxt/public/images/doorrrender";
const crop = { left: 846, top: 316, width: 225, height: 493 };

const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();

let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const path = join(dir, file);
  const before = statSync(path).size;
  const buffer = await sharp(path)
    .extract(crop)
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  writeFileSync(path, buffer);
  const after = statSync(path).size;
  beforeTotal += before;
  afterTotal += after;
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

console.log(
  `\nTOTAL: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB -> ${(afterTotal / 1024 / 1024).toFixed(2)}MB ` +
  `(${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(1)}% reduction)`
);

// Generates every brand file from the Gloock font, so the logo, icons and social image always match.
// Usage: node scripts/brand.mjs
//
//   public/brand/   vector logo + monogram (SVG), transparent PNGs, Instagram avatar
//   src/app/        icon.svg, favicon.ico, apple-icon.png, opengraph-image.png, twitter-image.png
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import opentype from "opentype.js";
import { chromium } from "playwright";

const root = process.cwd();
const fonts = join(root, "src/assets/fonts");
const brandDir = join(root, "public/brand");
const appDir = join(root, "src/app");
mkdirSync(brandDir, { recursive: true });

const C = { cream: "#fff9eb", oxblood: "#370808", oat: "#f0e7d7", butter: "#f8e47d" };
const TRACKING = -0.03; // matches the nav wordmark

const buffer = readFileSync(join(fonts, "Gloock-Regular.ttf"));
const gloock = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

/** Text as outlined path data, so the logo never depends on the font being installed. */
function outline(text, size) {
  const path = gloock.getPath(text, 0, 0, size, { kerning: true, letterSpacing: TRACKING });
  return { d: path.toPathData(2), box: path.getBoundingBox() };
}

function wordmarkSvg(fill) {
  const { d, box } = outline("bebon", 1000);
  const pad = 40; // breathing room so serifs never touch the edge
  const [w, h] = [box.x2 - box.x1 + pad * 2, box.y2 - box.y1 + pad * 2];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(box.x1 - pad).toFixed(1)} ${(box.y1 - pad).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="bebon"><path fill="${fill}" d="${d}"/></svg>`;
}

/** The "b" centred on a square tile. `radius` is a fraction of the side; 0 gives a full-bleed square. */
function monogramSvg({ background, foreground, radius = 0.22, glyph = 0.62 }) {
  const side = 1000;
  const raw = outline("b", 1000);
  const scale = (side * glyph) / (raw.box.y2 - raw.box.y1);
  const { d, box } = outline("b", 1000 * scale);
  // Centre on the bounding box, nudged right a touch because the bowl carries the visual weight.
  const dx = side / 2 - (box.x1 + box.x2) / 2 + side * 0.012;
  const dy = side / 2 - (box.y1 + box.y2) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" role="img" aria-label="bebon"><rect width="${side}" height="${side}" rx="${side * radius}" fill="${background}"/><path transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})" fill="${foreground}" d="${d}"/></svg>`;
}

const files = {
  wordmark: wordmarkSvg(C.oxblood),
  wordmarkCream: wordmarkSvg(C.cream),
  monogram: monogramSvg({ background: C.oxblood, foreground: C.cream }),
  avatar: monogramSvg({ background: C.oxblood, foreground: C.cream, radius: 0, glyph: 0.5 }),
  appleIcon: monogramSvg({ background: C.oxblood, foreground: C.cream, radius: 0, glyph: 0.58 }),
};

writeFileSync(join(brandDir, "bebon-wordmark.svg"), files.wordmark);
writeFileSync(join(brandDir, "bebon-wordmark-cream.svg"), files.wordmarkCream);
writeFileSync(join(brandDir, "bebon-monogram.svg"), files.monogram);
writeFileSync(join(appDir, "icon.svg"), files.monogram);

// Raster versions are screenshots of the SVGs (and of the social card below).
const browser = await chromium.launch();
const page = await browser.newPage();

async function rasterize(svg, width, height, out, background = "transparent") {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<body style="margin:0;background:${background}"><div style="width:${width}px;height:${height}px;display:flex">${svg.replace("<svg ", '<svg width="100%" height="100%" ')}</div></body>`,
  );
  return page.screenshot({ path: out, omitBackground: background === "transparent" });
}

const ratio = (() => {
  const { box } = outline("bebon", 1000);
  return (box.x2 - box.x1 + 80) / (box.y2 - box.y1 + 80);
})();
await rasterize(files.wordmark, 2000, Math.round(2000 / ratio), join(brandDir, "bebon-wordmark.png"));
await rasterize(files.wordmarkCream, 2000, Math.round(2000 / ratio), join(brandDir, "bebon-wordmark-cream.png"));
await rasterize(files.monogram, 1024, 1024, join(brandDir, "bebon-monogram.png"));
await rasterize(files.avatar, 1080, 1080, join(brandDir, "bebon-instagram-avatar.png"));
await rasterize(files.appleIcon, 180, 180, join(appDir, "apple-icon.png"));

// favicon.ico for older browsers: a single 32px PNG wrapped in an ICO header.
const png32 = await rasterize(files.monogram, 32, 32, join(brandDir, "bebon-favicon-32.png"));
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18); // image data offset
writeFileSync(join(appDir, "favicon.ico"), Buffer.concat([header, png32]));

// Social preview card (1200×630): the wordmark, the hero line, and the floating cookie.
const font = (file) => pathToFileURL(join(fonts, file)).href;
const cookie = pathToFileURL(join(root, "src/assets/images/lotus-cookie.png")).href;
const card = `<!doctype html><html><head><style>
  @font-face { font-family: Instrument; src: url(${font("InstrumentSerif-Regular.ttf")}); }
  @font-face { font-family: Instrument; font-style: italic; src: url(${font("InstrumentSerif-Italic.ttf")}); }
  body { margin: 0; }
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: ${C.cream}; color: ${C.oxblood}; font-family: Instrument; }
  .logo { position: absolute; left: 72px; top: 64px; width: 330px; }
  .title { position: absolute; left: 72px; bottom: 118px; margin: 0; font-size: 104px; line-height: 0.88; letter-spacing: -0.01em; font-weight: 400; }
  .title span { display: block; }
  .title span + span { padding-left: 0.9em; }
  .note { position: absolute; left: 76px; bottom: 58px; margin: 0; font-size: 30px; font-style: italic; opacity: 0.75; }
  .sun { position: absolute; right: -110px; top: 40px; width: 560px; height: 560px; border-radius: 50%; background: ${C.butter}; }
  .cookie { position: absolute; right: -40px; top: 70px; width: 560px; transform: rotate(-12deg); filter: drop-shadow(0 34px 34px rgb(55 8 8 / 0.28)); }
</style></head><body><div class="card">
  <div class="sun"></div>
  <img class="cookie" src="${cookie}">
  <div class="logo">${files.wordmark.replace("<svg ", '<svg width="100%" ')}</div>
  <h1 class="title"><span>Cookies worth</span><span>waiting for</span></h1>
  <p class="note">Small-batch cookies, baked to order in Winnipeg</p>
</div></body></html>`;
const cardPath = join(tmpdir(), "bebon-social-card.html");
writeFileSync(cardPath, card);
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(pathToFileURL(cardPath).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
for (const name of ["opengraph-image", "twitter-image"]) {
  await page.screenshot({ path: join(appDir, `${name}.png`) });
  writeFileSync(join(appDir, `${name}.alt.txt`), "Bebon: Cookies worth waiting for. Small-batch cookies, baked to order in Winnipeg.");
}
await page.screenshot({ path: join(brandDir, "bebon-social-card.png") });

await browser.close();
console.log("brand files written to public/brand and src/app");

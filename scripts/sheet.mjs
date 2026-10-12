// Build contact sheets from a folder of numbered PNGs.
// Usage: node scripts/sheet.mjs <dir> [cols] [perSheet] [cellWidth]
import { chromium } from "playwright";
import { readdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const [dir, cols = "2", per = "6", cw = "720"] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => /^\d+\.png$/.test(f)).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(cols) * Number(cw), height: 400 } });

for (let s = 0; s * Number(per) < files.length; s++) {
  const chunk = files.slice(s * Number(per), (s + 1) * Number(per));
  const html =
    `<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},${cw}px);background:#000;font:14px sans-serif">` +
    chunk
      .map(
        (f) =>
          `<div style="position:relative"><img src="${f}" style="width:${cw}px;display:block;outline:1px solid #f0f">` +
          `<span style="position:absolute;top:4px;left:4px;background:#f0f;color:#fff;padding:2px 6px">${f}</span></div>`,
      )
      .join("") +
    `</body>`;
  const htmlPath = join(dir, `_sheet-${s}.html`);
  writeFileSync(htmlPath, html);
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.screenshot({ path: join(dir, `sheet-${s}.png`), fullPage: true });
}
await browser.close();

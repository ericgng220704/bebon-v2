// Screenshot a page at regular scroll steps, for comparing against the Savor reference.
// Usage: node scripts/capture.mjs <url> <outDir> [width] [height] [steps]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [url, outDir, width = "1440", height = "900", steps = "40"] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("usage: node scripts/capture.mjs <url> <outDir> [width] [height] [steps]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const vw = Number(width);
const vh = Number(height);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
page.on("console", (msg) => ["error", "warning"].includes(msg.type()) && console.log("[console." + msg.type() + "]", msg.text().slice(0, 400)));
page.on("pageerror", (error) => console.log("[pageerror]", error.message));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3500);
await page.mouse.move(vw / 2, vh / 2);

for (let i = 0; i < Number(steps); i++) {
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, "0")}.png` });
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, Math.round(vh * 0.6));
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => window.scrollY);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  console.log(i, Math.round(after), "/", max);
  if (after === before && i > 2) break;
}
await browser.close();

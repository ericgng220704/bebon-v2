# Bebon

Landing page for Bebon, a small-batch cookie shop in Winnipeg. The structure, type and motion follow savor.it; the content, photos and palette usage are Bebon's own.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static)
```

## Editing content (Sanity)

Content is edited in **Sanity Studio**, built into the site at `/studio` (live: https://bebon-v2.vercel.app/studio). Publishing a change updates the live site within seconds, with no redeploy.

| In the Studio | Controls |
| --- | --- |
| **Home page** | Every section's text and photos, one tab per section |
| **Site settings** | Instagram handle (every Order button DMs it), city |
| **Cookies** | Menu items: name, category, price, sold out, ingredients, photo, order |
| **Boxes** | Box sizes and prices |

Photos use Sanity's crop and hotspot tools to choose what stays in frame. A few things stay in code: the nav (it links to section ids), the phone hero video (`public/media/hero-portrait.mp4`), and the layout itself.

### One-time setup

1. **Allow the site to talk to Sanity.** At sanity.io/manage, open the project, then API → CORS origins. Add each of these with **Allow credentials** ticked:
   - `http://localhost:3000` (plus any other local port you use)
   - `https://bebon-v2.vercel.app`
2. **Copy the starting content into Sanity.** Under API → Tokens, create an **Editor** token. Add it to `.env.local` (never commit it):
   ```
   SANITY_API_WRITE_TOKEN=sk...
   ```
   Then run `npm run seed`. This uploads the photos and creates the documents. It never overwrites edits made in the Studio; `npm run seed -- --force` resets the seeded documents to the built-in content.

### Built-in content

`src/content/` holds the built-in content. It is the seed source, and the page falls back to it for any field that's empty in Sanity, so the site never shows holes. Project id and dataset are in `src/sanity/env.ts`; schemas are in `src/sanity/schemas/`.

## Brand files

`node scripts/brand.mjs` regenerates every brand asset from the Gloock font (`src/assets/fonts`, OFL-licensed), so the logo, icons and social image always match:

| File | Use |
| --- | --- |
| `public/brand/bebon-wordmark.svg` / `.png` (+ `-cream`) | The logo, outlined as vectors (no font needed). For packaging, stickers, print |
| `public/brand/bebon-monogram.svg` / `.png` | The "b" tile |
| `public/brand/bebon-instagram-avatar.png` | Instagram profile picture (safe for circle crops) |
| `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` | Browser and home-screen icons |
| `src/app/opengraph-image.png`, `twitter-image.png` | Link previews (iMessage, Instagram, X, Facebook) |

The social card's design lives in `scripts/brand.mjs`. Edit it there and re-run.

## Before launch

- Set the real Instagram handle (Studio → Site settings). Every "Order" button DMs it.
- Replace the placeholder menu, prices and pickup schedule.
- Swap any photos that aren't yours. Several came from the old site, and some show other bakeries' branding (the kraft box lid) or look like stock or Pinterest images.

## How the motion works

- **Lenis** smooth scroll drives **GSAP ScrollTrigger** (`src/components/providers/SmoothScroll.tsx`).
- **Loader**: a butter-yellow curtain that lifts once fonts and the first hero frame are ready (`src/components/ui/Loader.tsx`).
- **Headlines**: SplitText characters rise out of masked lines (`src/components/motion/SplitReveal.tsx`).
- **Story canvas**: an SVG clip path "bubble" opens into a pinned scene. Lines draw themselves and the canvas folds into a framed picture (`src/components/sections/Story.tsx`).
- **Ribbon**: photo tiles slide along a sine wave as they scroll (`src/components/sections/Ribbon.tsx`).
- **Framer Motion** handles component-level motion: the menu filter pill, list transitions, the cursor-following preview, the mobile menu and fade-ins.
- Everything respects `prefers-reduced-motion`.

## Comparing against the reference

```bash
node scripts/capture.mjs <url> <outDir> [width] [height] [steps]   # screenshot each scroll step
node scripts/sheet.mjs <outDir> [cols] [perSheet] [cellWidth]      # tile them into contact sheets
```

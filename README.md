# Bebon

Landing page for Bebon, a small-batch cookie shop in Winnipeg. The structure, type and motion follow savor.it; the content, photos and palette usage are Bebon's own.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static)
```

## Editing content

Everything on the page comes from `src/content/`, so copy changes never touch components:

| File | What lives there |
| --- | --- |
| `site.ts` | Instagram handle, nav, every section's copy, pickup details |
| `cookies.ts` | Menu items, categories, prices, sold-out flags, box sizes |
| `media.ts` | Every photo, its alt text, and optional crop position |

Photos live in `src/assets/images/` (imported statically so Next sizes and blurs them). The phone hero clip is `public/media/hero-portrait.mp4`.

These files are shaped like the planned Sanity schemas, so moving to a CMS means replacing the imports with queries.

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

- Set the real Instagram handle in `src/content/site.ts` (`INSTAGRAM_HANDLE`). Every "Order" button DMs it.
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

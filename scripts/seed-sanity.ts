// Copies the built-in content (src/content) and its photos into Sanity as the starting point.
//
//   npm run seed           creates documents that don't exist yet (safe: never overwrites Studio edits)
//   npm run seed -- --force   replaces the seeded documents with the built-in content
//
// Needs SANITY_API_WRITE_TOKEN in .env.local (sanity.io/manage → API → Tokens → Editor).
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient, type IdentifiedSanityDocumentStub } from "@sanity/client";
import { localContent } from "../src/content/local";
import type { ImageRef } from "../src/content/types";
import { apiVersion, dataset, projectId } from "../src/sanity/env";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Add an Editor token to .env.local, then run again.");
  process.exit(1);
}

const force = process.argv.includes("--force");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const imagesDir = join(process.cwd(), "src/assets/images");

// Upload each file once. Sanity also de-duplicates identical files, so re-runs don't create copies.
const uploads = new Map<string, Promise<string>>();
const upload = (file: string) => {
  if (!uploads.has(file)) {
    uploads.set(
      file,
      client.assets.upload("image", createReadStream(join(imagesDir, file)), { filename: file }).then((asset) => {
        console.log(`  uploaded ${file}`);
        return asset._id;
      }),
    );
  }
  return uploads.get(file)!;
};

let keyCount = 0;
const key = () => `k${(keyCount++).toString(36)}`;

/** A local photo as a Sanity image; the CSS crop position becomes the hotspot. */
async function image(ref: ImageRef) {
  const [x, y] = (ref.position ?? "50% 50%").split(" ").map((part) => parseFloat(part) / 100);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: await upload(ref.file) },
    alt: ref.alt,
    hotspot: { _type: "sanity.imageHotspot", x, y, width: 1, height: 1 },
  };
}

const images = (refs: ImageRef[]) => Promise.all(refs.map(async (ref) => ({ _key: key(), ...(await image(ref)) })));
const keyed = <T extends object>(items: T[]) => items.map((item) => ({ _key: key(), ...item }));

async function main() {
  const c = localContent;
  console.log(`Seeding ${projectId}/${dataset}${force ? " (replacing existing documents)" : ""}…`);

  const documents: IdentifiedSanityDocumentStub[] = [
    { _id: "siteSettings", _type: "siteSettings", ...c.settings },
    {
      _id: "home",
      _type: "home",
      hero: { ...c.hero, frames: await images(c.hero.frames) },
      story: { ...c.story, scenes: await images(c.story.scenes) },
      origin: { ...c.origin, image: await image(c.origin.image) },
      ribbon: { ...c.ribbon, images: await images(c.ribbon.images) },
      menu: c.menu,
      band: { ...c.band, image: await image(c.band.image) },
      occasions: c.occasions,
      howToOrder: { ...c.howToOrder, steps: keyed(c.howToOrder.steps), details: keyed(c.howToOrder.details) },
      footer: c.footer,
    },
    ...(await Promise.all(
      c.cookies.map(async ({ _id, image: photo, ...cookie }, i) => ({
        _id: `cookie-${_id}`,
        _type: "cookie",
        ...cookie,
        sortOrder: (i + 1) * 10,
        ...(photo ? { image: await image(photo) } : {}),
      })),
    )),
    ...c.boxes.map(({ _id, ...box }) => ({ _id, _type: "box", ...box })),
  ];

  const transaction = client.transaction();
  for (const doc of documents) {
    if (force) transaction.createOrReplace(doc);
    else transaction.createIfNotExists(doc);
  }
  await transaction.commit();

  console.log(`Done: ${documents.length} documents (${uploads.size} photos). Open /studio to edit.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

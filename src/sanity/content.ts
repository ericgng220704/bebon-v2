import { createImageUrlBuilder } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import { fallbackContent } from "@/content/images";
import type { Content, Picture } from "@/content/types";
import { dataset, projectId } from "./env";
import { cachedSanity } from "./live";

const image = `{ alt, crop, hotspot, "asset": asset->{ _id, "lqip": metadata.lqip } }`;

const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{ instagramHandle, city },
  "home": *[_id == "home"][0]{
    hero{ ..., frames[]${image} },
    story{ ..., scenes[]${image} },
    origin{ ..., image${image} },
    ribbon{ ..., images[]${image} },
    menu,
    band{ ..., image${image} },
    occasions,
    howToOrder,
    footer
  },
  "cookies": *[_type == "cookie" && defined(name)] | order(coalesce(sortOrder, 999) asc, name asc){
    _id, name, notes, description, price, category, soldOut, image${image}
  },
  "boxes": *[_type == "box" && defined(name)] | order(count asc){ _id, name, count, price, note }
}`);

type SanityImage = {
  alt?: string | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number } | null;
  asset?: { _id: string; lqip?: string | null } | null;
};

const builder = createImageUrlBuilder({ projectId, dataset });

/** A Sanity image as a renderable picture: the crop goes in the URL, the hotspot becomes object-position. */
function toPicture(source: SanityImage | null | undefined): Picture | null {
  if (!source?.asset?._id) return null;
  const { crop, hotspot } = source;
  let position: string | undefined;
  if (hotspot) {
    // The hotspot is measured on the original image; re-measure it inside the crop.
    const left = crop?.left ?? 0;
    const top = crop?.top ?? 0;
    const width = 1 - left - (crop?.right ?? 0);
    const height = 1 - top - (crop?.bottom ?? 0);
    position = `${(((hotspot.x - left) / width) * 100).toFixed(1)}% ${(((hotspot.y - top) / height) * 100).toFixed(1)}%`;
  }
  return {
    src: builder.image({ asset: { _ref: source.asset._id }, crop: crop ?? undefined, hotspot: hotspot ?? undefined }).url(),
    alt: source.alt ?? "",
    position,
    blurDataURL: source.asset.lqip ?? undefined,
  };
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value) && !("src" in value);

/**
 * Takes each field from Sanity when it has a value, otherwise keeps the built-in one,
 * so a half-filled Studio never leaves holes in the page.
 */
function fill<T>(fallback: T, value: unknown): T {
  if (value === null || value === undefined || value === "") return fallback;
  if (Array.isArray(value)) {
    const present = value.filter((item) => item !== null && item !== undefined);
    return (present.length ? present : fallback) as T;
  }
  if (isPlainObject(fallback) && isPlainObject(value)) {
    const merged: Record<string, unknown> = { ...fallback };
    for (const key of Object.keys(fallback)) merged[key] = fill(fallback[key], value[key]);
    return merged as T;
  }
  return value as T;
}

type RemoteHome = Partial<{
  hero: Partial<Content["hero"]> & { frames?: SanityImage[] | null };
  story: Partial<Content["story"]> & { scenes?: SanityImage[] | null };
  origin: Partial<Content["origin"]> & { image?: SanityImage | null };
  ribbon: Partial<Content["ribbon"]> & { images?: SanityImage[] | null };
  menu: Partial<Content["menu"]>;
  band: Partial<Content["band"]> & { image?: SanityImage | null };
  occasions: Partial<Content["occasions"]>;
  howToOrder: Partial<Content["howToOrder"]>;
  footer: Partial<Content["footer"]>;
}>;

type RemoteCookie = Omit<Content["cookies"][number], "image"> & { image?: SanityImage | null };

type RemoteContent = {
  settings?: Partial<Content["settings"]> | null;
  home?: RemoteHome | null;
  cookies?: RemoteCookie[] | null;
  boxes?: Content["boxes"] | null;
};

const pictures = (list?: SanityImage[] | null) => list?.map(toPicture).filter((picture): picture is Picture => picture !== null);

export async function getContent(): Promise<Content> {
  try {
    const { data } = await cachedSanity({ query: CONTENT_QUERY, perspective: "published", stega: false });
    const { settings, home, cookies, boxes } = (data ?? {}) as RemoteContent;
    const { hero, story, origin, ribbon, band, ...text } = home ?? {};

    return fill(fallbackContent, {
      ...text,
      settings,
      hero: hero && { ...hero, frames: pictures(hero.frames) },
      story: story && { ...story, scenes: pictures(story.scenes) },
      origin: origin && { ...origin, image: toPicture(origin.image) },
      ribbon: ribbon && { ...ribbon, images: pictures(ribbon.images) },
      band: band && { ...band, image: toPicture(band.image) },
      // A cookie is replaced as a whole, so give missing fields safe defaults.
      cookies: cookies?.map((cookie) => ({
        ...cookie,
        notes: cookie.notes ?? [],
        description: cookie.description ?? "",
        soldOut: cookie.soldOut ?? false,
        image: toPicture(cookie.image),
      })),
      boxes,
    });
  } catch (error) {
    console.error("Sanity fetch failed; using the built-in content.", error);
    return fallbackContent;
  }
}

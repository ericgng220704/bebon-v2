import type { Content } from "./types";

/** Converts every photo in the content, e.g. local file refs or Sanity images into renderable pictures. */
export function mapPictures<A, B>(content: Content<A>, convert: (picture: A) => B): Content<B> {
  return {
    ...content,
    hero: { ...content.hero, frames: content.hero.frames.map(convert) },
    story: { ...content.story, scenes: content.story.scenes.map(convert) },
    origin: { ...content.origin, image: convert(content.origin.image) },
    ribbon: { ...content.ribbon, images: content.ribbon.images.map(convert) },
    band: { ...content.band, image: convert(content.band.image) },
    cookies: content.cookies.map((cookie) => ({ ...cookie, image: cookie.image && convert(cookie.image) })),
  };
}

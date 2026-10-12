import type { StaticImageData } from "next/image";

/** A photo in the local content: a file in `src/assets/images` plus how to show it. */
export type ImageRef = {
  file: string;
  alt: string;
  /** CSS object-position, used to crop one photo several ways. */
  position?: string;
};

/** A photo ready to render: a bundled image, or an image on Sanity's CDN. */
export type Picture = {
  src: StaticImageData | string;
  alt: string;
  position?: string;
  blurDataURL?: string;
};

export type Cta = { first: string; second: string };
export type CtaLink = Cta & { href: string };
export type Link = { label: string; href: string };

export type CookieCategory = "classic" | "signature" | "seasonal";

export type Cookie<P = Picture> = {
  _id: string;
  name: string;
  notes: string[];
  description: string;
  price: number;
  category: CookieCategory;
  /** Optional in Sanity: a cookie without a photo simply shows none. */
  image: P | null;
  soldOut?: boolean;
};

export type Box = {
  _id: string;
  name: string;
  count: number;
  price: number;
  note: string;
};

/**
 * Everything the page shows that an owner might edit. The same shape comes from the local files
 * (with `ImageRef` photos) and from Sanity (with CDN photos), so the page doesn't care which.
 */
export type Content<P = Picture> = {
  settings: { instagramHandle: string; city: string };
  hero: { title: string[]; intro: string; cta: Cta; frames: P[] };
  story: {
    scenes: P[];
    from: { start: string; end: string };
    craft: string[];
    without: { lead: string; items: string[] };
    future: { lead: string; more: string; first: string; last: string };
  };
  origin: { title: string[]; body: string; cta: CtaLink; image: P };
  ribbon: { title: string[]; body: string; cta: CtaLink; images: P[] };
  menu: { title: string; body: string; boxesTitle: string; ctaLead: string; cta: Cta };
  band: { title: string[]; image: P };
  occasions: { title: string; items: string[] };
  howToOrder: {
    title: string[];
    steps: { title: string; body: string }[];
    details: { label: string; value: string }[];
    cta: Cta;
  };
  footer: { pitch: string; cta: Cta; smallprint: string[]; year: number };
  cookies: Cookie<P>[];
  boxes: Box[];
};

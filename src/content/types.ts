import type { StaticImageData } from "next/image";

// These shapes mirror the Sanity schemas planned for phase 2, so swapping the
// local data for GROQ queries only changes where the data comes from.

export type Picture = {
  src: StaticImageData;
  alt: string;
  /** CSS object-position, used to crop one photo several ways. */
  position?: string;
};

export type Link = {
  label: string;
  href: string;
};

export type CookieCategory = "classic" | "signature" | "seasonal";

export type Cookie = {
  _id: string;
  name: string;
  notes: string[];
  description: string;
  price: number;
  category: CookieCategory;
  image: Picture;
  soldOut?: boolean;
};

export type Box = {
  _id: string;
  name: string;
  count: number;
  price: number;
  note: string;
};

export type StoryScene = {
  image: Picture;
};

export type SiteSettings = {
  name: string;
  city: string;
  instagram: { handle: string; profileUrl: string; dmUrl: string };
  nav: Link[];
};

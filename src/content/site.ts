import type { Link } from "./types";

// Fixed parts of the site that aren't content: anchors match section ids, so they stay in code.
export const nav: Link[] = [
  { label: "Story", href: "#story" },
  { label: "Cookies", href: "#cookies" },
  { label: "Menu", href: "#menu" },
  { label: "How to order", href: "#order" },
];

export const heroVideo = { src: "/media/hero-portrait.mp4", poster: "/media/hero-portrait-poster.jpg" };

export const instagramLinks = (handle: string) => {
  const clean = handle.replace(/^@/, "").trim();
  return {
    handle: clean,
    profileUrl: `https://www.instagram.com/${clean}/`,
    dmUrl: `https://ig.me/m/${clean}`,
  };
};

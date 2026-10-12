import { crop, media } from "./media";
import type { Picture, SiteSettings } from "./types";

// TODO: replace with the real Instagram handle before launch.
const INSTAGRAM_HANDLE = "bebon.cookies";

export const site: SiteSettings = {
  name: "Bebon",
  city: "Winnipeg",
  instagram: {
    handle: INSTAGRAM_HANDLE,
    profileUrl: `https://www.instagram.com/${INSTAGRAM_HANDLE}/`,
    dmUrl: `https://ig.me/m/${INSTAGRAM_HANDLE}`,
  },
  nav: [
    { label: "Story", href: "#story" },
    { label: "Cookies", href: "#cookies" },
    { label: "Menu", href: "#menu" },
    { label: "How to order", href: "#order" },
  ],
};

export const hero = {
  title: ["Cookies worth", "waiting for"],
  intro: "Small-batch cookies, baked to order in Winnipeg.",
  cta: { first: "Order", second: "on Instagram" },
  // Desktop cycles through these like quick film cuts; phones play the clip instead.
  frames: [
    crop(media.kitchenOverhead, "50% 40%"),
    media.ingredients,
    crop(media.coolingRack, "50% 60%"),
    crop(media.almondDarkChocolate, "50% 35%"),
    crop(media.ovenTray, "50% 55%"),
    media.drizzleAssortment,
  ] satisfies Picture[],
  video: { src: "/media/hero-portrait.mp4", poster: "/media/hero-portrait-poster.jpg" },
};

export const story = {
  scenes: [media.ingredients, crop(media.ovenTray, "50% 60%"), crop(media.kitchenOverhead, "50% 50%"), media.coolingRack] satisfies Picture[],
  from: { start: "From brown butter", end: "to flaky sea salt" },
  craft: ["We bake honest cookies", "One small batch at a time."],
  without: { lead: "Without", items: ["preservatives", "premixes", "shortcuts", "day-old dough", "or compromises."] },
  future: {
    lead: "We're baking toward a future where there's",
    more: "more",
    first: "of the cookies you love",
    last: "excuses to share them.",
  },
};

export const origin = {
  title: ["From our", "oven to your hands"],
  body: "What started as weekend baking for friends became Bebon: a tiny Winnipeg kitchen turning out small batches, boxed by hand and ready to give.",
  cta: { first: "See", second: "the menu", href: "#menu" },
  // A transparent cut-out: shown with no frame or background.
  image: media.lotusCookie,
};

export const ribbon = {
  title: ["Real butter,", "real flavour."],
  body: "Classic and seasonal cookies, baked fresh for every order.",
  cta: { first: "See", second: "the menu", href: "#menu" },
  images: [
    media.ingredients,
    crop(media.kitchenOverhead, "30% 30%"),
    media.ovenTray,
    media.smoresRack,
    media.caramelTray,
    media.smoresClose,
    crop(media.kraftBox, "50% 75%"),
    media.almondDarkChocolate,
    media.caramelSwirl,
    crop(media.coolingRack, "40% 40%"),
    media.drizzleAssortment,
    media.matchaRack,
    crop(media.kitchenOverhead, "70% 85%"),
  ] satisfies Picture[],
};

export const menuIntro = {
  title: "The menu",
  body: "Everything is baked fresh to order. Order at least 48 hours ahead; boxes are mix and match.",
  boxesTitle: "Boxes",
  cta: { first: "DM us", second: "your order" },
};

export const band = {
  title: ["Baked at home,", "boxed by hand"],
  image: media.kitchenOverhead,
};

export const occasions = {
  title: "Made for",
  items: ["Birthdays", "Thank-yous", "Weddings", "Office treats", "Baby showers", "Holidays", "Get-well boxes", "Just because"],
};

export const howToOrder = {
  title: ["How to", "order"],
  steps: [
    { title: "Send a DM", body: "Message us on Instagram with your flavours, box size and pickup day." },
    { title: "Confirm & pay", body: "We'll confirm your order and total. Pay by e-Transfer to lock in your spot." },
    { title: "Pick up warm", body: "Collect your box in Winnipeg. We'll send the pickup address with your confirmation." },
  ],
  // Placeholder details until the real schedule is set.
  details: [
    { label: "Lead time", value: "48 hours" },
    { label: "Pickup", value: "Fri – Sun, 12 – 6 pm" },
    { label: "Where", value: "Winnipeg, MB" },
    { label: "Payment", value: "e-Transfer or cash" },
  ],
  cta: { first: "Start", second: "your order" },
};

export const footer = {
  pitch: "Hungry for more? Send us a DM and we'll save you a box from the next batch.",
  cta: { first: "Message", second: "Bebon" },
  smallprint: ["Pre-order pickup only", "Winnipeg, MB"],
  year: 2026,
};

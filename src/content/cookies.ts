import { crop, media } from "./media";
import type { Box, Cookie, CookieCategory } from "./types";

// Placeholder menu: flavours, notes and prices are stand-ins until the real list is ready.
export const cookies: Cookie[] = [
  {
    _id: "brown-butter-chocolate-chip",
    name: "Brown Butter Chocolate Chip",
    notes: ["brown butter", "70% dark chocolate", "flaky salt"],
    description: "The one we started with. Nutty brown butter, puddles of dark chocolate, a pinch of salt on top.",
    price: 4.5,
    category: "classic",
    image: media.ovenTray,
  },
  {
    _id: "lotus-biscoff",
    name: "Lotus Biscoff",
    notes: ["cookie butter", "white chocolate", "speculoos crumb"],
    description: "Spiced cookie butter folded through a chewy dough and crowned with a whole Lotus biscuit.",
    price: 5,
    category: "signature",
    image: media.lotusCookie,
  },
  {
    _id: "pistachio-cream",
    name: "Pistachio Cream",
    notes: ["pistachio cream", "white chocolate", "crushed pistachio"],
    description: "Filled with pistachio cream and finished with a white chocolate drizzle.",
    price: 5.5,
    category: "signature",
    image: crop(media.drizzleAssortment, "85% 88%"),
  },
  {
    _id: "salted-caramel-swirl",
    name: "Salted Caramel Swirl",
    notes: ["house caramel", "vanilla bean", "sea salt"],
    description: "A soft vanilla bean cookie with a well of house-made caramel swirled through the middle.",
    price: 5,
    category: "signature",
    image: media.caramelSwirl,
  },
  {
    _id: "double-dark-chocolate",
    name: "Double Dark Chocolate",
    notes: ["dutch cocoa", "dark chocolate chunks", "sea salt"],
    description: "Deep cocoa dough, more chocolate on top. For people who think there is no such thing as too much.",
    price: 4.5,
    category: "classic",
    image: crop(media.kraftBox, "88% 82%"),
  },
  {
    _id: "matcha-white-chocolate",
    name: "Matcha White Chocolate",
    notes: ["ceremonial matcha", "white chocolate", "macadamia"],
    description: "Earthy matcha balanced with sweet white chocolate and buttery macadamia.",
    price: 5,
    category: "classic",
    image: crop(media.kraftBox, "22% 70%"),
  },
  {
    _id: "toasted-smores",
    name: "Toasted S'mores",
    notes: ["toasted marshmallow", "milk chocolate", "graham crumb"],
    description: "Campfire in a cookie: graham dough, milk chocolate and a torched marshmallow cap.",
    price: 5,
    category: "seasonal",
    image: media.smoresClose,
  },
  {
    _id: "almond-dark-chocolate",
    name: "Almond Dark Chocolate",
    notes: ["toasted almonds", "dark chocolate dip"],
    description: "Crunchy with toasted almonds and half-dipped in dark chocolate.",
    price: 5,
    category: "seasonal",
    image: media.almondDarkChocolate,
  },
  {
    _id: "cranberry-oat",
    name: "Cranberry Oat",
    notes: ["rolled oats", "dried cranberry", "white chocolate"],
    description: "Chewy oats, tart cranberries and white chocolate. Back when the weather turns.",
    price: 4.5,
    category: "seasonal",
    image: crop(media.kraftBox, "68% 50%"),
    soldOut: true,
  },
];

export const categories: { value: CookieCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "classic", label: "Classics" },
  { value: "signature", label: "Signatures" },
  { value: "seasonal", label: "Seasonal" },
];

export const boxes: Box[] = [
  { _id: "box-4", name: "The Little Box", count: 4, price: 18, note: "Pick any four" },
  { _id: "box-6", name: "The Gift Box", count: 6, price: 26, note: "Our most-loved size" },
  { _id: "box-12", name: "The Party Box", count: 12, price: 48, note: "Mix up to four flavours" },
];

const priceFormat = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export const formatPrice = (value: number) => priceFormat.format(value);

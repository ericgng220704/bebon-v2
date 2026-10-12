import type { ImageRef } from "./types";

// Every local photo, in one place. Files live in src/assets/images.
const library = {
  almondDarkChocolate: { file: "almond-dark-chocolate.jpg", alt: "Almond cookies half-dipped in dark chocolate on a cooling rack" },
  caramelSwirl: { file: "caramel-swirl.jpg", alt: "Salted caramel swirl cookies on parchment" },
  caramelTray: { file: "caramel-tray.jpg", alt: "A tray of caramel cookies next to a rack of s'mores cookies" },
  coolingRack: { file: "cooling-rack.jpg", alt: "Pretzel, matcha and marshmallow cookies cooling on a rack" },
  drizzleAssortment: { file: "drizzle-assortment.jpg", alt: "Six drizzled cookies: cashew caramel, cookies and cream, pistachio and more" },
  ingredients: { file: "ingredients.jpg", alt: "Brown sugar, butter, flour, eggs and chocolate chips laid out on a board" },
  kitchenOverhead: { file: "kitchen-overhead.jpg", alt: "Overhead view of a mixing bowl, oven mitts and trays of fresh cookies" },
  kraftBox: { file: "kraft-box.jpg", alt: "An open kraft box of six assorted cookies", position: "50% 85%" },
  lotusCookie: { file: "lotus-cookie.png", alt: "A Lotus Biscoff cookie with white chocolate chunks" },
  matchaRack: { file: "matcha-rack.jpg", alt: "Matcha cookies cooling beside a tray of caramel cookies", position: "30% 15%" },
  ovenTray: { file: "oven-tray.jpg", alt: "A tray of chocolate chip cookies coming out of the oven" },
  smoresClose: { file: "smores-close.jpg", alt: "S'mores cookies topped with toasted marshmallow" },
  smoresRack: { file: "smores-rack.jpg", alt: "A rack of s'mores cookies" },
} satisfies Record<string, ImageRef>;

export const media: Record<keyof typeof library, ImageRef> = library;

export const crop = (picture: ImageRef, position: string): ImageRef => ({ ...picture, position });

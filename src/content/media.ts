import type { Picture } from "./types";

import almondDarkChocolate from "@/assets/images/almond-dark-chocolate.jpg";
import caramelSwirl from "@/assets/images/caramel-swirl.jpg";
import caramelTray from "@/assets/images/caramel-tray.jpg";
import coolingRack from "@/assets/images/cooling-rack.jpg";
import drizzleAssortment from "@/assets/images/drizzle-assortment.jpg";
import ingredients from "@/assets/images/ingredients.jpg";
import kitchenOverhead from "@/assets/images/kitchen-overhead.jpg";
import kraftBox from "@/assets/images/kraft-box.jpg";
import lotusCookie from "@/assets/images/lotus-cookie.png";
import matchaRack from "@/assets/images/matcha-rack.jpg";
import ovenTray from "@/assets/images/oven-tray.jpg";
import smoresClose from "@/assets/images/smores-close.jpg";
import smoresRack from "@/assets/images/smores-rack.jpg";

// Every photo on the site, in one place. Swap a file here and it updates everywhere.
const library = {
  almondDarkChocolate: { src: almondDarkChocolate, alt: "Almond cookies half-dipped in dark chocolate on a cooling rack" },
  caramelSwirl: { src: caramelSwirl, alt: "Salted caramel swirl cookies on parchment" },
  caramelTray: { src: caramelTray, alt: "A tray of caramel cookies next to a rack of s'mores cookies" },
  coolingRack: { src: coolingRack, alt: "Pretzel, matcha and marshmallow cookies cooling on a rack" },
  drizzleAssortment: { src: drizzleAssortment, alt: "Six drizzled cookies: cashew caramel, cookies and cream, pistachio and more" },
  ingredients: { src: ingredients, alt: "Brown sugar, butter, flour, eggs and chocolate chips laid out on a board" },
  kitchenOverhead: { src: kitchenOverhead, alt: "Overhead view of a mixing bowl, oven mitts and trays of fresh cookies" },
  kraftBox: { src: kraftBox, alt: "An open kraft box of six assorted cookies", position: "50% 85%" },
  lotusCookie: { src: lotusCookie, alt: "A Lotus Biscoff cookie with white chocolate chunks" },
  matchaRack: { src: matchaRack, alt: "Matcha cookies cooling beside a tray of caramel cookies", position: "30% 15%" },
  ovenTray: { src: ovenTray, alt: "A tray of chocolate chip cookies coming out of the oven" },
  smoresClose: { src: smoresClose, alt: "S'mores cookies topped with toasted marshmallow" },
  smoresRack: { src: smoresRack, alt: "A rack of s'mores cookies" },
} satisfies Record<string, Picture>;

export const media: Record<keyof typeof library, Picture> = library;

export const crop = (picture: Picture, position: string): Picture => ({ ...picture, position });

import type { StaticImageData } from "next/image";

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
import { localContent } from "./local";
import { mapPictures } from "./mapPictures";
import type { Content, ImageRef, Picture } from "./types";

// Bundled photos by file name. Static imports give Next their size and a blur placeholder.
const files: Record<string, StaticImageData> = {
  "almond-dark-chocolate.jpg": almondDarkChocolate,
  "caramel-swirl.jpg": caramelSwirl,
  "caramel-tray.jpg": caramelTray,
  "cooling-rack.jpg": coolingRack,
  "drizzle-assortment.jpg": drizzleAssortment,
  "ingredients.jpg": ingredients,
  "kitchen-overhead.jpg": kitchenOverhead,
  "kraft-box.jpg": kraftBox,
  "lotus-cookie.png": lotusCookie,
  "matcha-rack.jpg": matchaRack,
  "oven-tray.jpg": ovenTray,
  "smores-close.jpg": smoresClose,
  "smores-rack.jpg": smoresRack,
};

const toPicture = ({ file, alt, position }: ImageRef): Picture => {
  const src = files[file];
  if (!src) throw new Error(`Unknown local image "${file}". Add it to src/content/images.ts.`);
  return { src, alt, position };
};

/** The built-in content with its photos ready to render. */
export const fallbackContent: Content<Picture> = mapPictures(localContent, toPicture);

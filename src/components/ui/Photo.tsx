"use client";

import Image, { type ImageProps } from "next/image";
import { imageLoader } from "next-sanity/image";
import type { Picture } from "@/content/types";
import { cn } from "@/lib/cn";

type Props = Omit<ImageProps, "src" | "alt" | "fill" | "loader" | "placeholder" | "blurDataURL"> & {
  picture: Picture;
  /** Override the picture's alt text, e.g. "" when the photo is decorative. */
  alt?: string;
  blur?: boolean;
};

/** A full-bleed photo from either source: bundled images use Next's optimiser, Sanity images its own CDN. */
export function Photo({ picture, alt, blur = true, className, style, ...rest }: Props) {
  const remote = typeof picture.src === "string";
  const canBlur = blur && (!remote || Boolean(picture.blurDataURL));

  return (
    <Image
      src={picture.src}
      alt={alt ?? picture.alt}
      fill
      loader={remote ? imageLoader : undefined}
      placeholder={canBlur ? "blur" : "empty"}
      blurDataURL={remote ? picture.blurDataURL : undefined}
      className={cn("object-cover", className)}
      style={{ objectPosition: picture.position, ...style }}
      {...rest}
    />
  );
}

import { defineArrayMember, defineField } from "sanity";

const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the photo for people who can't see it (screen readers, slow connections).",
  validation: (rule) => rule.required(),
});

const photoOptions = { hotspot: true } as const;
const photoDescription = "Use the crop and hotspot tools to choose which part of the photo stays in frame.";

/** A photo with alt text; the hotspot decides how it is cropped on the page. */
export const photo = (name: string, title: string, description = photoDescription) =>
  defineField({ name, title, type: "image", description, options: photoOptions, fields: [altField], validation: (rule) => rule.required() });

export const photos = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [defineArrayMember({ type: "image", options: photoOptions, fields: [altField] })],
    options: { layout: "grid" },
    validation: (rule) => rule.min(1),
  });

/** Big headlines are set line by line, exactly as they break on the page. */
export const lines = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    description: "One entry per line, in order.",
    of: [defineArrayMember({ type: "string" })],
    validation: (rule) => rule.min(1),
  });

export const strings = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "array", description, of: [defineArrayMember({ type: "string" })] });

/** Savor-style two-word button: "Order —— on Instagram". */
export const cta = (name = "cta", title = "Button", withLink = false) =>
  defineField({
    name,
    title,
    type: "object",
    description: 'Two parts either side of the dash, e.g. "Order" —— "on Instagram".',
    options: { columns: withLink ? 3 : 2 },
    fields: [
      defineField({ name: "first", title: "Before the dash", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "second", title: "After the dash", type: "string", validation: (rule) => rule.required() }),
      ...(withLink
        ? [defineField({ name: "href", title: "Links to", type: "string", description: "A section on the page, e.g. #menu", initialValue: "#menu" })]
        : []),
    ],
  });

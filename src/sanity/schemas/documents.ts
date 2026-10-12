import { defineArrayMember, defineField, defineType } from "sanity";
import { cta, lines, photo, photos, strings } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "instagramHandle",
      title: "Instagram handle",
      type: "string",
      description: "Without the @. Every Order button opens a DM to this account.",
      validation: (rule) => rule.required().regex(/^@?[A-Za-z0-9._]{1,30}$/, { name: "Instagram handle" }),
    }),
    defineField({ name: "city", title: "City", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", group: name, options: { collapsible: false }, fields });

export const home = defineType({
  name: "home",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Story" },
    { name: "origin", title: "From our oven" },
    { name: "ribbon", title: "Photo ribbon" },
    { name: "menu", title: "Menu" },
    { name: "band", title: "Photo band" },
    { name: "occasions", title: "Made for" },
    { name: "howToOrder", title: "How to order" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    section("hero", "Hero", [
      lines("title", "Headline"),
      defineField({ name: "intro", title: "Intro", type: "string" }),
      cta(),
      photos("frames", "Photo reel", "Desktop cuts between these like a short film. Phones play the video instead."),
    ]),
    section("story", "Story", [
      photos("scenes", "Scene photos", "Four full-screen backgrounds, shown in order as the notes play."),
      defineField({
        name: "from",
        title: "From … to …",
        type: "object",
        options: { columns: 2 },
        fields: [defineField({ name: "start", title: "Start", type: "string" }), defineField({ name: "end", title: "End", type: "string" })],
      }),
      lines("craft", "Craft line"),
      defineField({
        name: "without",
        title: "Without …",
        type: "object",
        fields: [defineField({ name: "lead", title: "Lead word", type: "string" }), strings("items", "List")],
      }),
      defineField({
        name: "future",
        title: "More & more",
        type: "object",
        fields: [
          defineField({ name: "lead", title: "Sentence", type: "string" }),
          defineField({ name: "more", title: "Repeated word", type: "string" }),
          defineField({ name: "first", title: "After the fifth", type: "string" }),
          defineField({ name: "last", title: "After the last", type: "string" }),
        ],
      }),
    ]),
    section("origin", "From our oven", [
      lines("title", "Headline"),
      defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
      cta("cta", "Button", true),
      photo("image", "Cookie", "Use a cut-out with a transparent background (PNG). It floats with no frame."),
    ]),
    section("ribbon", "Photo ribbon", [
      lines("title", "Headline"),
      defineField({ name: "body", title: "Text", type: "text", rows: 2 }),
      cta("cta", "Button", true),
      photos("images", "Photos", "The snaking column of photos. Around 12–14 works best."),
    ]),
    section("menu", "Menu", [
      defineField({ name: "title", title: "Headline", type: "string" }),
      defineField({ name: "body", title: "Intro", type: "text", rows: 2 }),
      defineField({ name: "boxesTitle", title: "Boxes headline", type: "string" }),
      defineField({ name: "ctaLead", title: "Line before the order button", type: "string" }),
      cta(),
    ]),
    section("band", "Photo band", [lines("title", "Headline"), photo("image", "Photo")]),
    section("occasions", "Made for", [
      defineField({ name: "title", title: "Headline", type: "string" }),
      strings("items", "Occasions", "Eight works best: they sit in a 4 × 2 grid."),
    ]),
    section("howToOrder", "How to order", [
      lines("title", "Headline"),
      defineField({
        name: "steps",
        title: "Steps",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [defineField({ name: "title", title: "Title", type: "string" }), defineField({ name: "body", title: "Text", type: "text", rows: 2 })],
          }),
        ],
      }),
      defineField({
        name: "details",
        title: "Details",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "value", title: "Value", type: "string" })],
            preview: { select: { title: "value", subtitle: "label" } },
          }),
        ],
      }),
      cta(),
    ]),
    section("footer", "Footer", [
      defineField({ name: "pitch", title: "Pitch", type: "text", rows: 2 }),
      cta(),
      strings("smallprint", "Small print"),
      defineField({ name: "year", title: "Copyright year", type: "number" }),
    ]),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const cookie = defineType({
  name: "cookie",
  title: "Cookie",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Classic", value: "classic" },
          { title: "Signature", value: "signature" },
          { title: "Seasonal", value: "seasonal" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "classic",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "price", title: "Price (CAD)", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "soldOut", title: "Sold out", type: "boolean", description: "Shows the cookie crossed out with a Sold out tag.", initialValue: false }),
    defineField({ name: "notes", title: "Key ingredients", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    photo("image", "Photo", "Shown when hovering the cookie on desktop and as a thumbnail on phones."),
    defineField({ name: "sortOrder", title: "Order on the menu", type: "number", description: "Lower numbers come first." }),
  ],
  orderings: [{ title: "Menu order", name: "menuOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "name", price: "price", category: "category", soldOut: "soldOut", media: "image" },
    prepare: ({ title, price, category, soldOut, media }) => ({
      title,
      subtitle: [price != null ? `$${Number(price).toFixed(2)}` : null, category, soldOut ? "sold out" : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});

export const box = defineType({
  name: "box",
  title: "Box",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "count", title: "Cookies in the box", type: "number", validation: (rule) => rule.required().min(1) }),
    defineField({ name: "price", title: "Price (CAD)", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "note", title: "Note", type: "string" }),
  ],
  orderings: [{ title: "Size", name: "size", by: [{ field: "count", direction: "asc" }] }],
  preview: {
    select: { title: "name", count: "count", price: "price" },
    prepare: ({ title, count, price }) => ({ title, subtitle: `${count} cookies · $${Number(price ?? 0).toFixed(2)}` }),
  },
});

export const schemaTypes = [siteSettings, home, cookie, box];

/** One-of-a-kind documents: no "create new", no delete or duplicate. */
export const singletons = new Set(["siteSettings", "home"]);

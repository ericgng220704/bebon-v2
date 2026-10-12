import type { StructureResolver } from "sanity/structure";

/** Studio sidebar: the two singletons first, then the menu. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Bebon")
    .items([
      S.listItem().title("Home page").id("home").child(S.document().schemaType("home").documentId("home").title("Home page")),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.divider(),
      S.documentTypeListItem("cookie").title("Cookies").child(S.documentTypeList("cookie").title("Cookies").defaultOrdering([{ field: "sortOrder", direction: "asc" }])),
      S.documentTypeListItem("box").title("Boxes"),
    ]);

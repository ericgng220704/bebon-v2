import { createClient } from "next-sanity";
import { defineLive, type StrictDefinedFetchType } from "next-sanity/live";
import { apiVersion, dataset, projectId } from "./env";

const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" });

// Published content only (the dataset is public), so no tokens are needed.
// <SanityLive /> listens for changes and refreshes the cached page when content is published.
export const { sanityFetch, SanityLive } = defineLive({ client, strict: true, serverToken: false, browserToken: false });

/** The app's one cache boundary around Sanity fetches. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

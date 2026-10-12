// Not secret: the project id and dataset are visible in every public API request.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "km5bqqnn";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-02-19";

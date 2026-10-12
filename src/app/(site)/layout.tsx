import { Providers } from "@/components/providers/Providers";
import { SanityLive } from "@/sanity/live";

// Smooth scroll, motion settings and live content updates apply to the site only, not the Studio.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <Providers>
      {children}
      <SanityLive includeDrafts={false} />
    </Providers>
  );
}

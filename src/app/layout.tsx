import type { Metadata, Viewport } from "next";
import { Geist_Mono, Gloock, Instrument_Serif, Inter_Tight } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const gloock = Gloock({
  variable: "--font-gloock",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bebon — Small-batch cookies in Winnipeg",
  description:
    "Homemade, small-batch cookies baked to order in Winnipeg. Gift-ready boxes for pre-order pickup. Order through Instagram.",
  openGraph: {
    title: "Bebon — Small-batch cookies in Winnipeg",
    description: "Homemade cookies baked to order, boxed by hand and ready to give.",
    type: "website",
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff9eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${gloock.variable} ${geistMono.variable} is-loading antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

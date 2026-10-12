import { Band } from "@/components/sections/Band";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowToOrder } from "@/components/sections/HowToOrder";
import { Menu } from "@/components/sections/Menu";
import { Occasions } from "@/components/sections/Occasions";
import { Origin } from "@/components/sections/Origin";
import { Ribbon } from "@/components/sections/Ribbon";
import { Story } from "@/components/sections/Story";
import { Loader } from "@/components/ui/Loader";
import { Nav } from "@/components/ui/Nav";
import { ScrollThumb } from "@/components/ui/ScrollThumb";
import { instagramLinks } from "@/content/site";
import { getContent } from "@/sanity/content";

export default async function Home() {
  const content = await getContent();
  const instagram = instagramLinks(content.settings.instagramHandle);

  return (
    <>
      <Loader />
      <Nav dmUrl={instagram.dmUrl} />
      <main>
        <Hero hero={content.hero} dmUrl={instagram.dmUrl} />
        <Story story={content.story} />
        <Origin origin={content.origin} />
        <Ribbon ribbon={content.ribbon} />
        <Menu menu={content.menu} cookies={content.cookies} boxes={content.boxes} dmUrl={instagram.dmUrl} />
        <Band band={content.band} />
        <Occasions occasions={content.occasions} />
        <HowToOrder howToOrder={content.howToOrder} dmUrl={instagram.dmUrl} />
      </main>
      <Footer footer={content.footer} instagram={instagram} />
      <ScrollThumb />
    </>
  );
}

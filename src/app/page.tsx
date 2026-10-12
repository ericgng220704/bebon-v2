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

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Origin />
        <Ribbon />
        <Menu />
        <Band />
        <Occasions />
        <HowToOrder />
      </main>
      <Footer />
      <ScrollThumb />
    </>
  );
}

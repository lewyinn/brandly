import { Navbar } from "@/components/NavbarComponent";
import Hero from "./../components/HeroSection";
import About from "@/components/AboutSection";
import PaketLayanan from "@/components/PaketSection";
import Portfolio from "@/components/Portfolio";
import WorkFlow from "@/components/WorkFlowSection";
import FAQ from "@/components/FaqSection";
import CTA from "@/components/CtaSection";
import Footer from "@/components/FooterComponent";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-8 overflow-x-hidden">
        <Navbar />
        <Hero />
        <About />
        <PaketLayanan />
        <Portfolio />
        <WorkFlow />
        <FAQ />
        <CTA />
      </div>

      <Footer />
    </>
  );
}

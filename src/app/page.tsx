import LenisProvider from "@/components/layout/LenisProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Partners from "@/components/sections/Partners";
import CareerChapters from "@/components/sections/CareerChapters";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <LenisProvider>
      <Header />
      <main>
        <Hero />
        <div className="gradient-line" />
        <About />
        <div className="gradient-line" />
        <Partners />
        <div className="gradient-line" />
        <CareerChapters />
        <div className="gradient-line" />
        <Experience />
        <div className="gradient-line" />
        <Projects />
        <div className="gradient-line" />
        <Research />
        <div className="gradient-line" />
        <Contact />
      </main>
      <Footer />
    </LenisProvider>
  );
}

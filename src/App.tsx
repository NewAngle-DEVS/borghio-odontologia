import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import ImplantSequence from "./components/ImplantSequence";
import Specialties from "./components/Specialties";
import Family from "./components/Family";
import Hyperboloid from "./components/Hyperboloid";
import Process from "./components/Process";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { WhatsAppIcon } from "./components/ui";
import { links } from "./content/site";

function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById("contato");
      const nearContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[var(--ease)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className="btn btn-primary w-full justify-center shadow-[0_20px_40px_-12px_rgba(20,35,75,0.6)]"
      >
        <WhatsAppIcon />
        Agendar pelo WhatsApp
      </a>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Recalculate scroll positions once fonts and images have settled
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Header />
      <main id="conteudo">
        <ImplantSequence />
        <Specialties />
        <Family />
        <Hyperboloid />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}

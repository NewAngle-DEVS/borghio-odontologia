import { useEffect, useRef, useState } from "react";
import { links, nav, WHATSAPP_DISPLAY } from "../content/site";
import { Arrow, WhatsAppIcon } from "./ui";

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-baseline gap-2 ${light ? "text-porcelain" : "text-ink"}`}>
      <span className="font-display text-[1.9rem] leading-none">Borghi</span>
      <span className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${light ? "text-cobalt-light" : "text-muted"}`}>
        Odontologia
      </span>
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 480 && y > last + 2);
        if (y < last - 2) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstLink.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      btnRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const solid = scrolled && !open;

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-porcelain focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-porcelain/95 shadow-[0_1px_0_rgba(20,35,75,0.08)]" : "bg-transparent"}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10 xl:px-14">
          <a href="#inicio" aria-label="Borghi Odontologia – início" className="relative z-[60]" onClick={() => setOpen(false)}>
            <Wordmark light={open} />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.92rem] font-medium">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-line py-1 text-ink/80 transition-colors hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[60] flex items-center gap-2">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn min-h-[44px] px-4 text-sm ${open ? "btn-light" : "btn-primary"}`}
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              <span>Agendar</span>
            </a>
            <button
              ref={btnRef}
              type="button"
              className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${
                open ? "text-porcelain ring-1 ring-porcelain/30" : "text-ink ring-1 ring-ink/20"
              }`}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[var(--ease)] ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[var(--ease)] ${
                    open ? "top-1/2 -rotate-45" : "top-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 flex flex-col bg-navy text-porcelain transition-[clip-path,visibility] duration-700 ease-[var(--ease)] lg:hidden ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Menu" className="flex flex-1 flex-col justify-center px-6 pt-20">
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={n.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline gap-4 py-2 font-display text-[2.6rem] leading-tight transition-transform duration-700 ease-[var(--ease)] ${
                    open ? "translate-y-0" : "translate-y-full"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <span className="font-sans text-xs tabular-nums text-cobalt-light">0{i + 1}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={`border-t border-porcelain/15 px-6 py-6 transition-opacity duration-500 ${open ? "opacity-100 delay-500" : "opacity-0"}`}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-cobalt-light">WhatsApp</p>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="mt-1 inline-flex items-center gap-2 text-xl font-semibold"
          >
            {WHATSAPP_DISPLAY} <Arrow dir="up-right" />
          </a>
        </div>
      </div>
    </>
  );
}

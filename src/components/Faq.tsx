import { useState } from "react";
import { faq, links } from "../content/site";
import { Arrow, Eyebrow } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" aria-labelledby="faq-title" className="bg-paper pb-24 lg:pb-36">
      <div className="mx-auto grid max-w-[1440px] gap-12 border-t border-ink/10 px-5 pt-20 sm:px-8 lg:grid-cols-12 lg:px-10 lg:pt-28 xl:px-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="mb-6">Dúvidas</Eyebrow>
            <h2 id="faq-title" className="font-display text-[clamp(2.6rem,4.8vw,4.6rem)] leading-[0.94]">
              Perguntas <em>frequentes</em>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">
              Respostas gerais para orientar a sua primeira conversa. Cada caso é avaliado individualmente na consulta.
            </p>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line mt-6 inline-flex items-center gap-2 py-2 font-semibold text-cobalt"
            >
              Não encontrou? Pergunte pelo WhatsApp <Arrow dir="up-right" />
            </a>
          </div>
        </div>

        <ul className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-ink/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-semibold leading-snug text-ink sm:text-xl">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ease-[var(--ease)] ${
                        isOpen ? "bg-ink text-porcelain ring-ink" : "text-ink ring-ink/25 group-hover:ring-ink"
                      }`}
                    >
                      <span className="absolute h-[1.5px] w-3 bg-current" />
                      <span
                        className={`absolute h-3 w-[1.5px] bg-current transition-transform duration-500 ease-[var(--ease)] ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-2xl pb-7 pr-12 leading-relaxed text-muted">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

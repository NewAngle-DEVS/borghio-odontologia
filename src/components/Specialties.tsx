import { useState } from "react";
import { specialties, waLink } from "../content/site";
import { useReveal } from "../hooks/useEnv";
import { Arrow, Eyebrow } from "./ui";

export default function Specialties() {
  const [active, setActive] = useState(0);
  const head = useReveal<HTMLDivElement>();
  const frame = useReveal<HTMLDivElement>(0.15);

  return (
    <section id="especialidades" aria-labelledby="esp-title" className="relative bg-paper py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-14">
        <div ref={head} className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">Especialidades</Eyebrow>
            <h2 id="esp-title" className="font-display text-[clamp(2.8rem,6.4vw,6.2rem)] leading-[0.92]">
              <span className="reveal-line">
                <span>O que tratamos,</span>
              </span>
              <span className="reveal-line">
                <span>
                  <em>explicado</em> sem pressa.
                </span>
              </span>
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Estas são as especialidades apresentadas no perfil da Borghi. Abra cada uma para entender o tratamento
            antes da consulta.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Sticky image frame – desktop */}
          <div className="hidden lg:col-span-5 lg:block">
            <div ref={frame} className="reveal-img sticky top-28 aspect-[4/5] overflow-hidden rounded-md bg-mist">
              <div className="absolute inset-0">
                {specialties.map((s, i) =>
                  s.image ? (
                    <img
                      key={s.id}
                      src={s.image.src}
                      alt={i === active ? s.image.alt : ""}
                      aria-hidden={i !== active}
                      width={1024}
                      height={1280}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition-[clip-path,transform] duration-[1100ms] ease-[var(--ease)] ${
                        i === active ? "scale-100 [clip-path:inset(0_0_0_0)]" : "scale-110 [clip-path:inset(0_0_100%_0)]"
                      }`}
                    />
                  ) : null
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-navy/70 to-transparent p-6 text-porcelain">
                <p className="font-display text-3xl">{specialties[active].short}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-porcelain/80">Imagem ilustrativa</p>
              </div>
            </div>
          </div>

          {/* Typographic list */}
          <ol className="border-t border-ink/15 lg:col-span-7">
            {specialties.map((s, i) => {
              const open = i === active;
              return (
                <li key={s.id} className="border-b border-ink/15">
                  <h3>
                    <button
                      type="button"
                      id={`esp-btn-${s.id}`}
                      aria-expanded={open}
                      aria-controls={`esp-panel-${s.id}`}
                      onClick={() => setActive(open ? active : i)}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto] lg:py-8"
                    >
                      <span className={`text-xs font-semibold tabular-nums transition-colors ${open ? "text-cobalt" : "text-muted"}`}>
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-[clamp(2.1rem,5vw,4.4rem)] leading-[0.95] transition-[color,transform] duration-500 ease-[var(--ease)] ${
                          open ? "text-ink" : "text-ink/45 group-hover:translate-x-2 group-hover:text-ink/80"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full ring-1 transition-all duration-500 ease-[var(--ease)] ${
                          open ? "rotate-45 bg-ink text-porcelain ring-ink" : "text-ink ring-ink/25 group-hover:ring-ink"
                        }`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`esp-panel-${s.id}`}
                    role="region"
                    aria-labelledby={`esp-btn-${s.id}`}
                    className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease)] ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!open}>
                      <div className="grid gap-6 pb-10 pl-[2.5rem] pr-2 sm:pl-[3.5rem] md:grid-cols-[1fr_auto]">
                        <div className="max-w-xl">
                          <p className="font-display text-2xl leading-snug text-ink sm:text-[1.7rem]">{s.lead}</p>
                          <p className="mt-4 leading-relaxed text-muted">{s.body}</p>
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {s.tags.map((t) => (
                              <li key={t} className="rounded-full px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-ink/15">
                                {t}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={waLink(s.waMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-line mt-6 inline-flex items-center gap-2 py-2 font-semibold text-cobalt"
                          >
                            Perguntar sobre {s.title.split(" ")[0].toLowerCase() === "ortopedia" ? "a OFM" : s.title.toLowerCase()}
                            <Arrow dir="up-right" />
                          </a>
                        </div>
                        {s.image && (
                          <figure className="lg:hidden">
                            <img
                              src={s.image.src}
                              alt={s.image.alt}
                              width={1024}
                              height={768}
                              loading="lazy"
                              decoding="async"
                              className="aspect-[4/3] w-full rounded-md object-cover md:w-64"
                            />
                            <figcaption className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
                              Imagem ilustrativa
                            </figcaption>
                          </figure>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="border-b border-ink/15">
              <a
                href={waLink("Olá! Gostaria de saber quais especialidades vocês atendem.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 py-6 sm:grid-cols-[3.5rem_1fr_auto]"
              >
                <span className="text-xs font-semibold text-muted">+</span>
                <span>
                  <span className="block font-display text-2xl text-ink/80 transition-colors group-hover:text-ink sm:text-3xl">
                    Outras especialidades
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    O perfil lista outras áreas de atuação. Pergunte às secretárias qual especialista atende o seu caso.
                  </span>
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-ink/25 transition-colors group-hover:bg-ink group-hover:text-porcelain">
                  <Arrow dir="up-right" />
                </span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

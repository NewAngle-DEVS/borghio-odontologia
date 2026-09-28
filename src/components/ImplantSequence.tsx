import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hasWebGL, useInView, useIsDesktop, useReducedMotion } from "../hooks/useEnv";
import { links, secretaries } from "../content/site";
import type { ProgressRef } from "../three/ImplantScene";
import { ImplantFallback, SceneBoundary } from "./ImplantFallback";
import { Arrow, Eyebrow, MagneticLink, WhatsAppIcon } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const ImplantScene = lazy(() => import("../three/ImplantScene"));

const PARTS = [
  { n: "01", tag: "Prótese", name: "Coroa cerâmica", text: "A parte visível: devolve forma, cor e mastigação." },
  { n: "02", tag: "Conexão", name: "Pilar", text: "Une a coroa ao implante com encaixe preciso." },
  { n: "03", tag: "Implante", name: "Raiz de titânio", text: "Instalada no osso, assume o papel da raiz perdida." },
];

const CHAPTERS = ["Sorriso", "Peças", "Especialidades"];

export default function ImplantSequence() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const mode: "sequence" | "linear" = isDesktop && !reduced ? "sequence" : "linear";

  const progress = useRef<ProgressRef>({ current: 0 }).current;
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const chapters = useRef<(HTMLLIElement | null)[]>([]);
  const wrap = useRef<HTMLElement>(null);
  const [stageRef, inView] = useInView<HTMLDivElement>("150px", mode);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    progress.current = 0;
    const ctx = gsap.context(() => {
      if (mode === "sequence") {
        let current = -1;
        const setChapter = (p: number) => {
          const idx = p < 0.25 ? 0 : p < 0.68 ? 1 : 2;
          if (idx === current) return;
          current = idx;
          chapters.current.forEach((li, i) => li?.setAttribute("data-active", String(i === idx)));
        };
        setChapter(0);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              progress.current = s.progress;
              setChapter(s.progress);
            },
          },
        });
        tl.to("[data-hero-out]", { yPercent: -22, autoAlpha: 0, duration: 0.12, stagger: 0.015 }, 0.03)
          .fromTo("[data-halo]", { left: "68%" }, { left: "55%", duration: 0.26 }, 0.12)
          .to("[data-halo]", { left: "28%", duration: 0.24 }, 0.7)
          .fromTo("[data-anatomy]", { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.27)
          .to("[data-anatomy]", { autoAlpha: 0, y: -48, duration: 0.07 }, 0.6)
          .fromTo("[data-finale]", { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.8)
          .fromTo("[data-cue]", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.05 }, 0.02)
          .fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .set({}, {}, 1);
      } else if (!reduced) {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          onUpdate: (s) => {
            progress.current = s.progress;
          },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [mode, reduced, progress]);

  const stage =
    webgl === null ? null : webgl ? (
      <SceneBoundary fallback={<ImplantFallback progress={progress} mode={mode} reduced={reduced} />}>
        <Suspense fallback={null}>
          <ImplantScene
            progress={progress}
            mode={mode}
            reduced={reduced}
            active={inView}
            quality={isDesktop ? "high" : "low"}
            labels={labels}
            eventSource={stageRef}
          />
        </Suspense>
      </SceneBoundary>
    ) : (
      <ImplantFallback progress={progress} mode={mode} reduced={reduced} />
    );

  const headline = (size: string) => (
    <h1 className={`font-display leading-[0.86] tracking-[-0.025em] text-ink ${size}`}>
      <span className="block">Cuidando do</span>
      <span className="block pl-[1.1em] italic">sorriso</span>
      <span className="block">
        da sua família<span className="text-cobalt">.</span>
      </span>
    </h1>
  );

  const ctas = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <MagneticLink href={links.whatsapp} variant="primary" className="justify-center">
        <WhatsAppIcon />
        Agendar pelo WhatsApp
        <Arrow />
      </MagneticLink>
      <MagneticLink href="#especialidades" variant="ghost" className="justify-center">
        Ver especialidades
        <Arrow dir="down" />
      </MagneticLink>
    </div>
  );

  /* ---------------------------- DESKTOP ---------------------------- */
  if (mode === "sequence") {
    return (
      <section id="inicio" ref={wrap} className="relative h-[430vh]" aria-label="Apresentação da Borghi Odontologia">
        <div ref={stageRef} className="grain sticky top-0 h-[100svh] overflow-hidden">
          {/* studio light that follows the object */}
          <div
            data-halo
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: "68%", background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.55) 32%, rgba(255,255,255,0) 66%)" }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[84px] mx-auto h-px max-w-[1440px] bg-ink/10" />

          {/* 1 · Presentation copy (behind the object for depth) */}
          <div className="relative z-0 mx-auto h-full max-w-[1440px] px-10 xl:px-14">
            <div className="pt-[max(96px,15vh)]" data-hero-out>
              <Eyebrow className="mb-6">Borghi Odontologia · Odontologia Especializada</Eyebrow>
              {headline("text-[clamp(4rem,min(9.2vw,15.5vh),10.5rem)]")}
            </div>
          </div>

          <div className="absolute inset-0 z-10">{stage}</div>

          {/* CTAs & support copy above the canvas */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[118px] z-20 mx-auto max-w-[1440px] px-10 xl:px-14">
            <div className="pointer-events-auto flex max-w-[34rem] flex-col gap-7" data-hero-out>
              <p className="text-lg leading-relaxed text-muted">
                Implantes, prótese e Ortopedia Funcional dos Maxilares, com atendimento para a família inteira. Agende com{" "}
                {secretaries.join(" e ")} pelo WhatsApp.
              </p>
              {ctas}
            </div>
          </div>

          {/* 2 · Exploration: callouts pinned to each 3D piece */}
          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {PARTS.map((p, i) => (
              <div
                key={p.n}
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="invisible absolute left-0 top-0 opacity-0 will-change-transform"
              >
                <div className="flex -translate-y-1/2 items-center">
                  <span className="-ml-[5px] h-2.5 w-2.5 shrink-0 rounded-full bg-cobalt ring-4 ring-cobalt/20" />
                  <span className="h-px w-[clamp(110px,11vw,180px)] bg-ink/35" />
                  <div className="w-60 pl-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cobalt">
                      {p.n} · {p.tag}
                    </p>
                    <p className="font-display text-[1.75rem] leading-tight">{p.name}</p>
                    <p className="mt-1 text-sm leading-snug text-muted">{p.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-anatomy className="invisible absolute inset-y-0 left-0 z-20 flex items-center opacity-0">
            <div className="mx-auto w-full max-w-[1440px] px-10 xl:px-14">
              <div className="max-w-[26rem]">
                <Eyebrow className="mb-6">Anatomia de um implante</Eyebrow>
                <h2 className="font-display text-[clamp(3rem,4.6vw,4.8rem)] leading-[0.95]">
                  Três peças,
                  <br />
                  <em>um dente</em> de volta.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">
                  Quando um dente é perdido, o implante faz o papel da raiz, o pilar conecta e a coroa devolve forma e
                  mastigação. Implantes e prótese são duas das especialidades da Borghi.
                </p>
              </div>
            </div>
          </div>

          {/* 3 · Transition to the specialties */}
          <div data-finale className="invisible absolute inset-y-0 right-0 z-20 flex w-full items-center opacity-0">
            <div className="mx-auto flex w-full max-w-[1440px] justify-end px-10 xl:px-14">
              <div className="max-w-[31rem]">
                <Eyebrow className="mb-6">Especialidades</Eyebrow>
                <h2 className="font-display text-[clamp(3rem,4.6vw,4.8rem)] leading-[0.95]">
                  Cada fase do sorriso pede <em>um especialista</em>.
                </h2>
                <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-lg">
                  {["Implantes", "Prótese", "Ortopedia Funcional dos Maxilares"].map((s, i) => (
                    <li key={s} className="flex items-baseline gap-4 py-3">
                      <span className="text-xs tabular-nums text-muted">0{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
                <a href="#especialidades" className="link-line mt-7 inline-flex items-center gap-2 font-semibold text-ink">
                  Conhecer cada especialidade <Arrow dir="down" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom rail: scroll cue + chapters */}
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex h-[84px] max-w-[1440px] items-center justify-between gap-8 px-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted xl:px-14">
            <div data-cue className="flex items-center gap-3">
              <span className="relative block h-8 w-px overflow-hidden bg-ink/10">
                <span className="cue-line absolute inset-0 bg-ink" />
              </span>
              Role para ver as peças
            </div>
            <div className="flex flex-1 items-center justify-center gap-6">
              <ol className="flex gap-6">
                {CHAPTERS.map((c, i) => (
                  <li
                    key={c}
                    ref={(el) => {
                      chapters.current[i] = el;
                    }}
                    data-active={i === 0}
                    className="transition-colors duration-500 data-[active=true]:text-ink"
                  >
                    <span className="tabular-nums">0{i + 1}</span> {c}
                  </li>
                ))}
              </ol>
              <span className="relative h-px w-40 bg-ink/15" aria-hidden="true">
                <span data-bar className="absolute inset-0 origin-left scale-x-0 bg-cobalt" />
              </span>
            </div>
            <p className="font-display text-base normal-case tracking-normal text-ink">
              <em>Fazendo você sorrir!</em>
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------- MOBILE / REDUCED ------------------------- */
  return (
    <>
      <section id="inicio" ref={wrap} className="grain relative overflow-hidden" aria-label="Apresentação da Borghi Odontologia">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[52%] h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0) 68%)" }}
        />
        <div ref={stageRef} className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col px-5 pb-10 pt-28 sm:px-8">
          <Eyebrow className="mb-5">Odontologia Especializada</Eyebrow>
          <div className="relative z-0">{headline("text-[clamp(3.4rem,16vw,6.5rem)]")}</div>
          <div className="relative -mx-5 -mt-8 min-h-[290px] flex-1 sm:-mx-8" style={{ height: "38svh" }}>
            {stage}
          </div>
          <p className="relative z-10 mb-6 text-base leading-relaxed text-muted">
            Implantes, prótese e Ortopedia Funcional dos Maxilares, com atendimento para a família inteira.
          </p>
          <div className="relative z-10">{ctas}</div>
        </div>
      </section>

      <section aria-labelledby="anatomia-title" className="bg-porcelain px-5 pb-20 pt-6 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="mb-5">Anatomia de um implante</Eyebrow>
          <h2 id="anatomia-title" className="font-display text-[clamp(2.6rem,11vw,4rem)] leading-[0.95]">
            Três peças, <em>um dente</em> de volta.
          </h2>
          <ol className="mt-8 border-t border-ink/10">
            {PARTS.map((p) => (
              <li key={p.n} className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-ink/10 py-5">
                <span className="pt-1 text-xs font-semibold tabular-nums text-cobalt">{p.n}</span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{p.tag}</p>
                  <p className="font-display text-3xl leading-tight">{p.name}</p>
                  <p className="mt-1 text-[15px] leading-snug text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">Representação 3D ilustrativa, fora de escala.</p>
        </div>
      </section>
    </>
  );
}

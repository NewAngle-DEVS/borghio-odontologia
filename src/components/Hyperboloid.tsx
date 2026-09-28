import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waLink } from "../content/site";
import { useReducedMotion, useReveal } from "../hooks/useEnv";
import { Arrow, Eyebrow, MagneticLink } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const N = 40;
const R = 150;
const H = 360;
const RY = 0.26;
const MAX_TWIST = 1.18; // rad ≈ 68°

export default function Hyperboloid() {
  const section = useRef<HTMLElement>(null);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const waist = useRef<SVGEllipseElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const text = useReveal<HTMLDivElement>();

  useEffect(() => {
    const draw = (phi: number) => {
      for (let i = 0; i < N; i++) {
        const base = (i / N) * Math.PI * 2;
        const a = base + phi;
        const b = base - phi;
        const el = lines.current[i];
        if (!el) continue;
        el.setAttribute("x1", (R * Math.cos(a)).toFixed(2));
        el.setAttribute("y1", (-H / 2 + R * RY * Math.sin(a)).toFixed(2));
        el.setAttribute("x2", (R * Math.cos(b)).toFixed(2));
        el.setAttribute("y2", (H / 2 + R * RY * Math.sin(b)).toFixed(2));
        // lines whose midpoint faces the viewer are brighter
        const front = Math.sin(base) > 0;
        el.setAttribute("stroke-opacity", front ? "0.95" : "0.28");
      }
      const w = R * Math.cos(phi);
      waist.current?.setAttribute("rx", w.toFixed(2));
      waist.current?.setAttribute("ry", (w * RY).toFixed(2));
      if (readout.current) readout.current.textContent = `${Math.round((phi * 180) / Math.PI)}°`;
    };

    if (reduced) {
      draw(MAX_TWIST * 0.85);
      return;
    }
    draw(0);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 75%",
      end: "center 40%",
      scrub: 0.6,
      onUpdate: (s) => draw(MAX_TWIST * s.progress),
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section
      id="hiperboloide"
      ref={section}
      aria-labelledby="hip-title"
      className="relative overflow-hidden rounded-t-[2rem] bg-navy py-24 text-porcelain lg:rounded-t-[3.5rem] lg:py-36"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-10 xl:px-14">
        <div ref={text} className="lg:col-span-5">
          <Eyebrow light className="mb-6">
            Destaque do perfil · Hiperboloide
          </Eyebrow>
          <h2 id="hip-title" className="font-display text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.92]">
            <span className="reveal-line">
              <span>Linhas retas,</span>
            </span>
            <span className="reveal-line">
              <span>
                <em className="text-cobalt-light">forma curva.</em>
              </span>
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-porcelain/80">
            O hiperboloide é um instrumento de mastigação em silicone, com formato de ampulheta, usado como auxiliar na
            Ortopedia Funcional dos Maxilares.
          </p>
          <p className="mt-4 leading-relaxed text-porcelain/65">
            O nome vem da geometria: essa forma pode ser construída apenas com linhas retas, torcendo as extremidades de
            um cilindro. Role a página e veja a curva surgir.
          </p>
          <p className="mt-6 border-l border-cobalt-light/50 pl-4 text-sm leading-relaxed text-porcelain/65">
            A indicação, o tamanho e o tempo de exercício são definidos pelo profissional depois da avaliação.
          </p>
          <div className="mt-10">
            <MagneticLink href={waLink("Olá! Gostaria de saber mais sobre o hiperboloide.")} variant="light">
              Perguntar sobre o hiperboloide
              <Arrow />
            </MagneticLink>
          </div>
        </div>

        <figure className="relative lg:col-span-6 lg:col-start-7">
          <svg
            viewBox="-210 -250 420 500"
            className="mx-auto h-auto w-full max-w-[520px]"
            role="img"
            aria-label="Diagrama de um hiperboloide formado por linhas retas que se torcem, passando de cilindro a ampulheta"
          >
            <ellipse cx="0" cy={-H / 2} rx={R} ry={R * RY} fill="none" stroke="#8fa6ec" strokeOpacity="0.7" />
            <ellipse cx="0" cy={H / 2} rx={R} ry={R * RY} fill="rgba(143,166,236,0.06)" stroke="#8fa6ec" strokeOpacity="0.7" />
            {Array.from({ length: N }).map((_, i) => (
              <line
                key={i}
                ref={(el) => {
                  lines.current[i] = el;
                }}
                stroke={i % 5 === 0 ? "#8fa6ec" : "#f3f0ea"}
                strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
                strokeLinecap="round"
              />
            ))}
            <ellipse ref={waist} cx="0" cy="0" rx={R} ry={R * RY} fill="none" stroke="#e3bfae" strokeDasharray="3 5" strokeOpacity="0.9" />
          </svg>
          <figcaption className="mt-6 flex items-center justify-between border-t border-porcelain/15 pt-4 text-[11px] uppercase tracking-[0.2em] text-porcelain/60">
            <span>Superfície regrada · {N} linhas retas</span>
            <span>
              Torção <span ref={readout} className="tabular-nums text-porcelain">0°</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

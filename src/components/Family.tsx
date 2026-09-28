import { useReveal } from "../hooks/useEnv";
import { Eyebrow } from "./ui";

const PHASES = [
  { k: "Crescimento", v: "Ortopedia Funcional dos Maxilares", d: "Orientação do crescimento da face na infância." },
  { k: "Reconstrução", v: "Prótese", d: "Coroas, pontes e próteses para dentes desgastados ou perdidos." },
  { k: "Reposição", v: "Implantes", d: "Uma nova raiz para sustentar o dente que faltava." },
];

export default function Family() {
  const img = useReveal<HTMLDivElement>(0.15);
  const text = useReveal<HTMLDivElement>();
  const rail = useReveal<HTMLOListElement>(0.3);

  return (
    <section id="familia" aria-labelledby="familia-title" className="relative overflow-hidden bg-porcelain py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-14">
        <div className="relative grid items-end gap-8 lg:grid-cols-12">
          <figure className="lg:col-span-8 lg:row-start-1">
            <div ref={img} className="reveal-img relative aspect-[4/5] overflow-hidden rounded-md bg-mist sm:aspect-[16/11]">
              <img
                src="/images/familia.jpg"
                alt="Imagem ilustrativa de avó e neta sorrindo juntas à mesa"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
              />
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted">
              Imagem ilustrativa, não retrata pacientes da clínica
            </figcaption>
          </figure>

          <div
            ref={text}
            className="relative z-10 bg-porcelain lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:-ml-10 lg:mb-24 lg:rounded-md lg:p-12 lg:pr-2"
          >
            <Eyebrow className="mb-6">Para a família</Eyebrow>
            <h2 id="familia-title" className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[0.94]">
              <span className="reveal-line">
                <span>Da infância</span>
              </span>
              <span className="reveal-line">
                <span>
                  à <em>reabilitação</em>.
                </span>
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              “Cuidando do sorriso da sua família” é a frase que abre o perfil da Borghi. Na prática, isso significa
              reunir especialidades para fases diferentes da vida: a Ortopedia Funcional atua enquanto a face das
              crianças cresce; prótese e implantes recuperam dentes na vida adulta.
            </p>
          </div>
        </div>

        <ol ref={rail} className="relative mt-16 grid gap-10 pt-10 md:grid-cols-3 md:gap-8 lg:mt-24">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ink/20 transition-transform duration-[1400ms] ease-[var(--ease)] [.is-in>&]:scale-x-100"
          />
          {PHASES.map((p, i) => (
            <li key={p.k} className="relative">
              <span className="absolute -top-[45px] left-0 h-2.5 w-2.5 rounded-full bg-cobalt ring-4 ring-porcelain" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                0{i + 1} · {p.k}
              </p>
              <p className="mt-3 font-display text-3xl leading-tight lg:text-4xl">{p.v}</p>
              <p className="mt-2 max-w-xs leading-relaxed text-muted">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

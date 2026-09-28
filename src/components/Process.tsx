import { useReveal } from "../hooks/useEnv";
import { links, secretaries, WHATSAPP_DISPLAY } from "../content/site";
import { Arrow, Eyebrow } from "./ui";

const STEPS = [
  {
    t: "Mensagem",
    d: `Chame no WhatsApp ${WHATSAPP_DISPLAY}. ${secretaries.join(" e ")} organizam a agenda e tiram as primeiras dúvidas.`,
  },
  { t: "Avaliação", d: "Na consulta, o especialista examina, conversa sobre o seu caso e indica os exames necessários." },
  { t: "Plano", d: "As etapas do tratamento são explicadas antes de começar, para você decidir com clareza." },
];

export default function Process() {
  const ref = useReveal<HTMLDivElement>(0.25);
  return (
    <section
      id="como-agendar"
      aria-labelledby="proc-title"
      className="relative z-10 -mt-8 rounded-t-[2rem] bg-paper py-24 lg:-mt-14 lg:rounded-t-[3.5rem] lg:py-32"
    >
      <div ref={ref} className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-6">Como agendar</Eyebrow>
            <h2 id="proc-title" className="font-display text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.94]">
              <span className="reveal-line">
                <span>Do primeiro “oi”</span>
              </span>
              <span className="reveal-line">
                <span>
                  ao <em>plano de tratamento</em>.
                </span>
              </span>
            </h2>
          </div>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line inline-flex items-center gap-2 self-start py-2 font-semibold text-cobalt md:self-end"
          >
            Começar pelo WhatsApp <Arrow dir="up-right" />
          </a>
        </div>

        <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[2.6rem] hidden h-px origin-left scale-x-0 bg-ink/20 transition-transform delay-300 duration-[1600ms] ease-[var(--ease)] md:block [.is-in_&]:scale-x-100"
          />
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative">
              <span className="block font-display text-[5.2rem] leading-none text-ink/15" aria-hidden="true">
                0{i + 1}
              </span>
              <span
                aria-hidden="true"
                className="absolute left-[0.3rem] top-[2.35rem] hidden h-3 w-3 rounded-full bg-paper ring-2 ring-cobalt md:block"
              />
              <h3 className="mt-4 font-display text-3xl">{s.t}</h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

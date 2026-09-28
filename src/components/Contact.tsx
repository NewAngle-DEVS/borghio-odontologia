import { useId, useState } from "react";
import { links, secretaries, waLink, WHATSAPP_DISPLAY } from "../content/site";
import { useReveal } from "../hooks/useEnv";
import { Arrow, Eyebrow, WhatsAppIcon } from "./ui";

const INTERESTS = ["Implantes", "Prótese", "Ortopedia Funcional", "Hiperboloide", "Outro assunto"];

const CHANNELS = [
  { label: "WhatsApp", value: WHATSAPP_DISPLAY, href: links.whatsapp, note: `Agendamento com ${secretaries.join(" e ")}` },
  { label: "Como chegar", value: "Abrir no Google Maps", href: links.maps, note: "Localização do consultório" },
  { label: "Instagram", value: "@borghiodontologia", href: links.instagram, note: "Procedimentos, dicas e novidades" },
  { label: "Facebook", value: "Borghi Odontologia", href: links.facebook, note: "Página oficial" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [note, setNote] = useState("");
  const id = useId();
  const head = useReveal<HTMLDivElement>();

  const message = [
    `Olá! ${name.trim() ? `Meu nome é ${name.trim()}. ` : ""}Vim pelo site da Borghi Odontologia.`,
    interest === "Outro assunto"
      ? "Gostaria de agendar uma consulta."
      : `Gostaria de agendar uma consulta sobre ${interest.toLowerCase() === "hiperboloide" ? "o hiperboloide" : interest}.`,
    note.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="contato" aria-labelledby="contato-title" className="grain relative bg-porcelain py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:px-10 xl:px-14">
        <div ref={head} className="lg:col-span-6">
          <Eyebrow className="mb-6">Contato</Eyebrow>
          <h2 id="contato-title" className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.88]">
            <span className="reveal-line">
              <span>Fale com</span>
            </span>
            <span className="reveal-line">
              <span>
                a <em>Borghi</em>
                <span className="text-cobalt">.</span>
              </span>
            </span>
          </h2>

          <ul className="mt-12 border-t border-ink/15">
            {CHANNELS.map((c) => (
              <li key={c.label} className="border-b border-ink/15">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:grid-cols-[9rem_1fr_auto]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{c.label}</span>
                  <span className="col-start-1 sm:col-start-auto">
                    <span className="block font-display text-2xl leading-tight transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-1.5 sm:text-3xl">
                      {c.value}
                    </span>
                    <span className="block text-sm text-muted">{c.note}</span>
                  </span>
                  <span className="col-start-2 row-span-2 row-start-1 grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-ink/25 transition-colors duration-300 group-hover:bg-ink group-hover:text-porcelain sm:col-start-auto sm:row-span-1 sm:row-start-auto">
                    <Arrow dir="up-right" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
          <form
            className="rounded-2xl bg-paper p-6 shadow-[0_40px_80px_-40px_rgba(20,35,75,0.35)] ring-1 ring-ink/10 sm:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink(message), "_blank", "noopener,noreferrer");
            }}
          >
            <p className="font-display text-3xl leading-tight">Monte sua mensagem</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ela abre pronta no WhatsApp da clínica. Nada é enviado ou armazenado por este site.
            </p>

            <label htmlFor={`${id}-name`} className="mt-8 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Seu nome (opcional)
            </label>
            <input
              id={`${id}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              className="mt-2 h-12 w-full border-b border-ink/25 bg-transparent text-lg outline-none transition-colors placeholder:text-ink/30 focus:border-cobalt focus-visible:outline-none"
              placeholder="Como podemos te chamar?"
            />

            <fieldset className="mt-8">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Assunto</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTERESTS.map((it) => (
                  <label
                    key={it}
                    className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cobalt ${
                      interest === it ? "bg-ink text-porcelain ring-ink" : "text-ink ring-ink/20 hover:ring-ink/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${id}-interest`}
                      value={it}
                      checked={interest === it}
                      onChange={() => setInterest(it)}
                      className="sr-only"
                    />
                    {it}
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor={`${id}-note`} className="mt-8 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Algo mais? (opcional)
            </label>
            <textarea
              id={`${id}-note`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-2 w-full resize-none border-b border-ink/25 bg-transparent py-2 text-base outline-none transition-colors placeholder:text-ink/30 focus:border-cobalt focus-visible:outline-none"
              placeholder="Ex.: prefiro horários pela manhã"
            />

            <div className="mt-6 rounded-lg bg-porcelain p-4 text-sm leading-relaxed text-muted">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em]">Prévia</span>
              <span aria-live="polite">{message}</span>
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full justify-center">
              <WhatsAppIcon />
              Abrir conversa no WhatsApp
              <Arrow />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

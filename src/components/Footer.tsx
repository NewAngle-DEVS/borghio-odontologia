import { links, nav, WHATSAPP_DISPLAY } from "../content/site";
import { Wordmark } from "./Header";

export default function Footer() {
  return (
    <footer className="bg-navy text-porcelain">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 lg:px-10 xl:px-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark light />
            <p className="mt-6 max-w-sm font-display text-3xl leading-tight text-porcelain/90">
              Odontologia especializada. <em className="text-cobalt-light">Fazendo você sorrir!</em>
            </p>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cobalt-light">Navegação</p>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-line py-1 text-porcelain/80 hover:text-porcelain">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cobalt-light">Contato</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="link-line py-1 text-porcelain/80 hover:text-porcelain">
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a href={links.maps} target="_blank" rel="noopener noreferrer" className="link-line py-1 text-porcelain/80 hover:text-porcelain">
                  Como chegar (Google Maps)
                </a>
              </li>
              <li>
                <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="link-line py-1 text-porcelain/80 hover:text-porcelain">
                  Instagram
                </a>
              </li>
              <li>
                <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="link-line py-1 text-porcelain/80 hover:text-porcelain">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none font-display text-[clamp(5rem,22vw,20rem)] leading-[0.8] tracking-[-0.03em] text-porcelain/[0.07]"
        >
          Borghi
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-porcelain/15 pt-6 text-xs text-porcelain/55 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Borghi Odontologia. Todos os direitos reservados.</p>
          <p>Imagens e cena 3D ilustrativas. Não retratam pacientes nem casos da clínica.</p>
        </div>
      </div>
    </footer>
  );
}

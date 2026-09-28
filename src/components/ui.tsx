import { useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useFinePointer, useReducedMotion } from "../hooks/useEnv";

type MagneticProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost" | "light";
  children: ReactNode;
  strength?: number;
};

/** Link-button with a subtle magnetic pull (fine pointers only, no reduced motion). */
export function MagneticLink({ variant = "primary", className = "", children, strength = 0.22, ...rest }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.translate = "0px 0px";
  };

  const external = rest.href?.startsWith("http");
  return (
    <a
      ref={ref}
      className={`btn btn-${variant} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Arrow({ className = "", dir = "right" }: { className?: string; dir?: "right" | "down" | "up-right" }) {
  const rot = dir === "down" ? "rotate-90" : dir === "up-right" ? "-rotate-45" : "";
  return (
    <svg viewBox="0 0 20 20" className={`btn-arrow h-4 w-4 ${rot} ${className}`} fill="none" aria-hidden="true">
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 1 1 6.95 3.86Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07 4.86 4.86 0 0 0 1.02 2.57 11.1 11.1 0 0 0 4.25 3.76c1.58.68 2.2.74 2.99.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

export function Eyebrow({ children, className = "", light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${
        light ? "text-cobalt-light" : "text-muted"
      } ${className}`}
    >
      <span className={`h-px w-8 ${light ? "bg-cobalt-light/60" : "bg-ink/30"}`} aria-hidden="true" />
      {children}
    </p>
  );
}

import { Component, useEffect, useRef, type ReactNode } from "react";
import type { ProgressRef } from "../three/ImplantScene";

/**
 * Alternativa 2D (SVG em camadas) usada quando o WebGL não está disponível
 * ou quando a cena falha. Não é 3D – é uma ilustração esquemática.
 */
export function ImplantFallback({
  progress,
  mode,
  reduced,
}: {
  progress: ProgressRef;
  mode: "sequence" | "linear";
  reduced: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const crown = useRef<SVGGElement>(null);
  const abut = useRef<SVGGElement>(null);
  const imp = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    const ss = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const tick = () => {
      const p = reduced ? 0 : progress.current;
      const e = mode === "sequence" ? ss(0.2, 0.42, p) * (1 - ss(0.64, 0.84, p)) : ss(0.08, 0.75, p) * 0.85;
      const x = mode === "sequence" ? (p < 0.4 ? 30 - 20 * ss(0.12, 0.38, p) : 10 - 54 * ss(0.7, 0.94, p)) : 0;
      if (wrap.current) wrap.current.style.transform = `translateX(${x}vw)`;
      crown.current?.setAttribute("transform", `translate(0 ${-70 * e})`);
      abut.current?.setAttribute("transform", `translate(0 ${-28 * e})`);
      imp.current?.setAttribute("transform", `translate(0 ${44 * e})`);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress, mode, reduced]);

  return (
    <div ref={wrap} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <svg viewBox="-120 -170 240 360" className="h-[72%] max-h-[640px] w-auto drop-shadow-[0_30px_40px_rgba(20,35,75,0.18)]">
        <defs>
          <linearGradient id="fb-ti" x1="0" x2="1">
            <stop offset="0" stopColor="#8c95a3" />
            <stop offset="0.45" stopColor="#e6e9ee" />
            <stop offset="1" stopColor="#7d8594" />
          </linearGradient>
          <linearGradient id="fb-cer" x1="0" x2="1">
            <stop offset="0" stopColor="#e7e1d6" />
            <stop offset="0.4" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#d9d2c4" />
          </linearGradient>
        </defs>
        <g ref={imp}>
          <path d="M-22 10 L22 10 L20 110 Q0 140 -20 110 Z" fill="url(#fb-ti)" />
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d={`M-24 ${22 + i * 9} Q0 ${27 + i * 9} 24 ${18 + i * 9}`} stroke="#6f7888" strokeWidth="3" fill="none" />
          ))}
        </g>
        <g ref={abut}>
          <path d="M-22 2 L22 2 L16 -10 L12 -50 L-12 -50 L-16 -10 Z" fill="url(#fb-ti)" opacity="0.9" />
        </g>
        <g ref={crown}>
          <path
            d="M-30 -8 C-44 -20 -48 -60 -40 -84 C-34 -98 -20 -92 -14 -100 C-6 -92 6 -92 14 -100 C20 -92 34 -98 40 -84 C48 -60 44 -20 30 -8 Z"
            fill="url(#fb-cer)"
          />
        </g>
      </svg>
      <span className="absolute bottom-6 right-6 text-[11px] uppercase tracking-[0.2em] text-muted">
        Ilustração esquemática
      </span>
    </div>
  );
}

export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[Borghi] Cena 3D indisponível, usando ilustração 2D.", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

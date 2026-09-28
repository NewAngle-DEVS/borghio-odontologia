import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeMQ(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    subscribeMQ(query),
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

let webglCache: boolean | null = null;
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** Adds `is-in` class once the element enters the viewport. */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Tracks whether an element is (near) on screen – used to pause WebGL. */
export function useInView<T extends HTMLElement>(rootMargin = "100px", key: unknown = null) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    setInView(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, key]);
  return [ref, inView] as const;
}

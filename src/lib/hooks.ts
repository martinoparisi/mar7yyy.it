import { useEffect, useRef, useState } from "react";

/**
 * Accende .is-in quando l'elemento entra in viewport.
 * Un solo observer per tutta la pagina: uno per elemento, con decine di
 * reveal, costa più della cosa che sta osservando.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          observer?.unobserve(e.target); // una volta accesa, resta accesa
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
  );
  return observer;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.hasAttribute("data-reveal")
      ? [el, ...el.querySelectorAll("[data-reveal]")]
      : Array.from(el.querySelectorAll("[data-reveal]"));
    const io = getObserver();
    targets.forEach((t) => io.observe(t));
    return () => targets.forEach((t) => io.unobserve(t));
  }, []);
  return ref;
}

/**
 * Tilt 3D reale al passaggio del mouse. Scrive su custom property
 * invece che su style.transform così il CSS resta padrone della transizione.
 */
export function useTilt<T extends HTMLElement>(intensita = 9) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--tilt-x", `${-py * intensita}deg`);
        el.style.setProperty("--tilt-y", `${px * intensita}deg`);
        el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [intensita]);

  return ref;
}

/**
 * Progresso 0..1 di un elemento che attraversa il viewport.
 * Serve alle sezioni sticky per lo scrub delle animazioni.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return setP(r.top < 0 ? 1 : 0);
      // Quantizzato: un re-render per ogni mezzo punto percentuale basta,
      // e non ruba frame alla scena WebGL.
      const v = Math.max(0, Math.min(1, -r.top / total));
      setP((prec) => (Math.abs(v - prec) > 0.004 ? v : prec));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [ref, p] as const;
}

/** true se il device regge il canvas WebGL a piena qualità. */
export function useQualita() {
  // Calcolata al primo render: cambiarla dopo rimonterebbe il composer.
  const [alta] = useState(() => {
    if (typeof window === "undefined") return false;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const pochiCore = (navigator.hardwareConcurrency ?? 8) <= 4;
    const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !mobile && !pochiCore && !ridotto;
  });
  return alta;
}

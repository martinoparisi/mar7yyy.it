import Lenis from "lenis";

/**
 * Stato di scroll condiviso fra DOM e scena WebGL.
 * È un oggetto mutabile letto dentro useFrame: passarlo per state React
 * vorrebbe dire un re-render per frame.
 */
export const scrollState = {
  /** 0 in cima, 1 in fondo alla pagina */
  progress: 0,
  /** velocità istantanea normalizzata, per il "warp" delle particelle */
  velocity: 0,
  /** puntatore in coordinate -1..1, già smussato */
  pointer: { x: 0, y: 0 },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

export function initScroll() {
  if (lenis) return lenis;
  if (prefersReducedMotion()) {
    // Niente smooth scroll forzato: aggiorno solo il progresso.
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return null;
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    // Su touch lo smooth via JS combatte con lo scroll nativo: lì non serve.
    syncTouch: false,
  });

  lenis.on("scroll", ({ progress, velocity }) => {
    scrollState.progress = progress;
    scrollState.velocity = Math.max(-1, Math.min(1, velocity / 40));
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
}

export function scrollTo(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

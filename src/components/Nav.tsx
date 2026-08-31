import { useEffect, useRef, useState } from "react";
import { sezioni, persona } from "../data/content";
import { scrollTo, scrollState } from "../lib/scroll";

export default function Nav() {
  const [staccata, setStaccata] = useState(false);
  const [attiva, setAttiva] = useState("home");
  // La barra di avanzamento si muove ogni frame: la scrivo sul DOM invece
  // che in stato, altrimenti tutta la nav si ridisegna a 60 fps.
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (barra.current) {
        barra.current.style.transform = `scaleX(${scrollState.progress})`;
      }
      setStaccata(window.scrollY > 80);
      // La sezione attiva è quella che occupa il centro dello schermo.
      const centro = window.innerHeight / 2;
      for (const s of sezioni) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= centro && r.bottom >= centro) {
          setAttiva(s.id);
          break;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)] ${
          staccata ? "px-3 pt-3 md:px-6 md:pt-4" : "px-0 pt-0"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-700 ease-[var(--ease-out-expo)] ${
            staccata
              ? "glass rounded-2xl px-4 py-3 md:px-6"
              : "border-b border-transparent px-6 py-5 md:px-12"
          }`}
        >
          <button
            type="button"
            onClick={() => scrollTo("#home")}
            className="group flex items-center gap-2.5"
          >
            <img
              src="/img/logo.webp"
              alt=""
              width="32"
              height="32"
              className="h-8 w-8 object-contain"
            />
            <span className="font-mono text-sm tracking-tight">
              {persona.handle}
              <span className="text-ink-faint">.it</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {sezioni.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(`#${s.id}`)}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                    attiva === s.id
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  {attiva === s.id && (
                    <span className="absolute inset-0 rounded-full border border-line bg-black/[0.04]" />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <a
            href="mailto:parisimartino07@gmail.com"
            className="rounded-full bg-viola px-5 py-2 text-sm font-medium text-void transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-105"
          >
            Scrivimi
          </a>
        </nav>
      </header>

      {/* filo di avanzamento della pagina */}
      <div className="fixed inset-x-0 top-0 z-[60] h-px bg-transparent">
        <div
          ref={barra}
          className="h-full origin-left"
          style={{ background: "var(--grad-accent)", transform: "scaleX(0)" }}
        />
      </div>
    </>
  );
}

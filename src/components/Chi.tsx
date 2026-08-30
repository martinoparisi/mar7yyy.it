import { useReveal } from "../lib/hooks";
import { persona } from "../data/content";
import { Shot, TitoloSezione } from "./ui";

export default function Chi() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="chi" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <TitoloSezione
          numero="01"
          occhiello="Chi sono"
          titolo={
            <>
              Scrivo software.
              <br />
              <span className="text-ink-faint">Web, mobile e quello sotto.</span>
            </>
          }
        />

        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div
            className="scene-3d"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-line"
              style={{
                transform: "rotateY(9deg) rotateX(4deg)",
                boxShadow: "0 50px 120px -50px var(--color-viola)",
              }}
            >
              <Shot
                src="/img/ritratto.webp"
                alt={`Ritratto di ${persona.nome}`}
                nota="Una tua foto verticale, luce fredda o comunque scura"
                ratio="4 / 5"
              />
              <div className="glass absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3">
                <p className="font-mono text-xs text-ink-dim">
                  @{persona.handle}
                </p>
                <p className="mt-0.5 text-sm">{persona.ruolo}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {persona.bio.map((par, i) => (
              <p
                key={i}
                className="mb-7 max-w-2xl text-balance text-xl leading-relaxed md:text-2xl md:leading-relaxed"
                data-reveal
                style={{ "--reveal-delay": `${180 + i * 120}ms` } as React.CSSProperties}
              >
                {par}
              </p>
            ))}

            <div
              className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
              data-reveal
              style={{ "--reveal-delay": "440ms" } as React.CSSProperties}
            >
              {[
                { v: "6", l: "Progetti pubblici" },
                { v: "3", l: "Piattaforme native" },
                { v: "TS", l: "Linguaggio di casa" },
                { v: "2026", l: "Diploma informatico" },
              ].map((s) => (
                <div key={s.l} className="bg-void px-5 py-6">
                  <div className="display text-2xl text-gradient">{s.v}</div>
                  <div className="mt-1.5 text-[0.7rem] leading-tight text-ink-faint">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

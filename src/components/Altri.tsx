import { useReveal } from "../lib/hooks";
import { altriProgetti } from "../data/content";
import { Card, Pill, TitoloSezione } from "./ui";

export default function Altri() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="altro"
      className="relative px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <TitoloSezione
          numero="03"
          occhiello="Altri progetti"
          titolo={
            <>
              Roba che ho costruito
              <br />
              <span className="text-ink-faint">per capire come si fa.</span>
            </>
          }
        />

        <p
          className="mb-14 max-w-2xl leading-relaxed text-ink-dim"
          data-reveal
          style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
        >
          Progetti personali, nati da un problema mio o di qualcuno che conosco.
          Qui non c'è un link da cliccare: c'è quello che fanno e perché sono
          fatti così.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {altriProgetti.map((prog, i) => (
            <div
              key={prog.id}
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <Card>
                <article className="flex h-full flex-col p-8 md:p-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display text-2xl md:text-3xl">{prog.nome}</h3>
                      <p className="mt-1.5 text-sm text-ciano/80">{prog.tipo}</p>
                    </div>
                    <span className="font-mono text-xs text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mb-8 flex-1 text-[0.95rem] leading-relaxed text-ink-dim">
                    {prog.testo}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {prog.stack.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                </article>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

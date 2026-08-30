import { useReveal } from "../lib/hooks";
import { persona } from "../data/content";
import { scrollTo } from "../lib/scroll";

/** Spezza una parola in caratteri animabili uno per uno. */
function Lettere({ testo, ritardo = 0 }: { testo: string; ritardo?: number }) {
  return (
    <span className="inline-block whitespace-nowrap" aria-hidden="true">
      {testo.split("").map((c, i) => (
        <span
          key={i}
          data-reveal="char"
          style={{ "--reveal-delay": `${ritardo + i * 42}ms` } as React.CSSProperties}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useReveal<HTMLElement>();
  const [nome, cognome] = persona.nome.split(" ");

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center px-6 pb-24 pt-32 md:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="mb-8 flex items-center gap-3"
          data-reveal
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ciano opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ciano" />
          </span>
          <span className="eyebrow">
            {persona.ruolo} — {persona.luogo}
          </span>
        </div>

        {/* Il nome: la cosa più grande della pagina, e l'unica in gradiente. */}
        <h1 className="display text-[clamp(3.2rem,13vw,11rem)] [perspective:600px]">
          <span className="sr-only">{persona.nome}</span>
          <span className="block">
            <Lettere testo={nome} />
          </span>
          <span className="block text-gradient">
            <Lettere testo={cognome} ritardo={260} />
          </span>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
          <p
            className="max-w-xl text-balance text-lg leading-relaxed text-ink-dim md:text-xl"
            data-reveal
            style={{ "--reveal-delay": "700ms" } as React.CSSProperties}
          >
            {persona.claim}
          </p>

          <div
            className="flex flex-wrap items-center gap-3 md:justify-end"
            data-reveal
            style={{ "--reveal-delay": "820ms" } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => scrollTo("#progetti")}
              className="group relative overflow-hidden rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
            >
              <span className="relative z-10">Guarda i progetti</span>
              <span
                className="absolute inset-y-0 -left-full w-1/2 bg-white/50 blur-md transition-none group-hover:[animation:sweep_0.9s_var(--ease-out-expo)]"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#contatti")}
              className="glass rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-line-strong hover:bg-white/[0.06]"
            >
              Contattami
            </button>
          </div>
        </div>
      </div>

      {/* Indicatore di scroll */}
      <div
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        data-reveal
        style={{ "--reveal-delay": "1100ms" } as React.CSSProperties}
      >
        <span className="eyebrow text-[0.6rem]">Scorri</span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <span
            className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-transparent to-ciano"
            style={{ animation: "float-y 2.4s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}

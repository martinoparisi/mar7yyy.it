import { useReveal, useSectionProgress } from "../lib/hooks";
import { Finestra, Pill, Shot, Telefono } from "./ui";
import type { Progetto } from "../data/content";

/**
 * Sezione prodotto in stile pagina Apple: il palco resta fermo (sticky)
 * mentre lo scroll fa girare il telefono in 3D e avanza i punti uno a uno.
 */
export default function ProgettoSezione({
  progetto,
  indice,
}: {
  progetto: Progetto;
  indice: number;
}) {
  const [ref, p] = useSectionProgress<HTMLDivElement>();
  const revealRef = useReveal<HTMLDivElement>();

  const n = progetto.punti.length;
  // Il primo 15% e l'ultimo 15% dello scroll servono a entrare e uscire.
  const t = Math.max(0, Math.min(1, (p - 0.15) / 0.7));
  const attivo = Math.min(n - 1, Math.floor(t * n));

  const accento = progetto.accento === "viola" ? "var(--color-viola)" : "var(--color-ciano)";
  const invertito = indice % 2 === 1;

  // Lo scatto di sfondo: verticale -> secondo telefono, orizzontale -> browser.
  const dietro = progetto.shot[1];
  const [rw, rh] = dietro.ratio.split("/").map((n) => parseFloat(n));
  const dietroVerticale = rw / rh < 1;
  const opacitaDietro = Math.max(0, (t - 0.3) / 0.7);
  const dominio = progetto.href
    ? new URL(progetto.href).hostname.replace(/^www\./, "")
    : "";

  return (
    <div ref={ref} className="relative" style={{ height: `${140 + n * 55}vh` }}>
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden px-6 py-24 md:px-12">
        <div
          ref={revealRef}
          className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20"
        >
          {/* ------------------------------- testo ------------------------------ */}
          <div className={invertito ? "lg:order-2" : ""}>
            <div className="mb-5 flex flex-wrap items-center gap-3" data-reveal>
              <span
                className="rounded-full px-3 py-1 font-mono text-[0.68rem]"
                style={{
                  color: accento,
                  background: `color-mix(in oklab, ${accento} 14%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${accento} 30%, transparent)`,
                }}
              >
                {progetto.stato}
              </span>
              <span className="eyebrow">{progetto.anno}</span>
            </div>

            <h3
              className="display mb-5 text-[clamp(2.8rem,8vw,6rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              {progetto.nome}
            </h3>

            <p
              className="mb-6 max-w-lg text-balance text-xl leading-snug md:text-2xl"
              style={{ color: accento, "--reveal-delay": "120ms" } as React.CSSProperties}
              data-reveal
            >
              {progetto.tagline}
            </p>

            <p
              className="mb-10 max-w-xl leading-relaxed text-ink-dim"
              data-reveal
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            >
              {progetto.descrizione}
            </p>

            {/* I punti: quello attivo si accende, gli altri restano leggibili ma spenti. */}
            <ul className="mb-10 space-y-1">
              {progetto.punti.map((punto, i) => {
                const on = i === attivo;
                return (
                  <li
                    key={punto.titolo}
                    className="relative border-l pl-5 transition-all duration-700 ease-[var(--ease-out-expo)]"
                    style={{
                      borderColor: on ? accento : "var(--color-line)",
                      paddingTop: on ? "0.9rem" : "0.55rem",
                      paddingBottom: on ? "0.9rem" : "0.55rem",
                      opacity: on ? 1 : 0.4,
                    }}
                  >
                    <h4 className="text-[0.95rem] font-medium">{punto.titolo}</h4>
                    <div
                      className="grid transition-all duration-700 ease-[var(--ease-out-expo)]"
                      style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-ink-dim">
                        <span className="block pt-2">{punto.testo}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mb-9 flex flex-wrap gap-2" data-reveal>
              {progetto.stack.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>

            <div className="flex flex-wrap gap-3" data-reveal>
              {progetto.href && (
                <a
                  href={progetto.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-void transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                  style={{ background: accento }}
                >
                  {progetto.hrefLabel}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
              {progetto.repo && (
                <a
                  href={progetto.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-line-strong hover:bg-black/[0.04]"
                >
                  {progetto.repoLabel}
                </a>
              )}
            </div>
          </div>

          {/* ------------------------------ il palco ---------------------------- */}
          <div
            className={`scene-3d relative ${invertito ? "lg:order-1" : ""}`}
            style={{ perspective: "1400px" }}
          >
            {/* alone dietro, colore del progetto */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 blur-[90px]"
              style={{
                background: `radial-gradient(closest-side, color-mix(in oklab, ${accento} 40%, transparent), transparent)`,
                opacity: 0.35 + t * 0.35,
                transform: `scale(${0.8 + t * 0.35})`,
              }}
            />

            {/* Lo scatto di sfondo entra nella seconda metà dello scroll,
                sfalsato in profondità sull'asse Z. */}
            {dietroVerticale ? (
              <Telefono
                className="absolute top-1/2 -z-[5] hidden w-[min(52%,13rem)] md:block"
                style={
                  {
                    [invertito ? "right" : "left"]: "-4%",
                    transform: `translateY(-46%) translateZ(-260px)`,
                    opacity: opacitaDietro,
                    transition: "opacity 0.4s linear",
                    "--phone-y": `${invertito ? -30 : 30}deg`,
                    "--phone-x": "5deg",
                  } as React.CSSProperties
                }
              >
                <Shot {...dietro} />
              </Telefono>
            ) : (
              <Finestra
                url={dominio}
                className="absolute inset-x-0 top-1/2 -z-[5] hidden md:block"
                style={{
                  transform: `translateY(-50%) translateX(${invertito ? -8 : 8}%) translateZ(-240px) rotateY(${
                    invertito ? 18 : -18
                  }deg)`,
                  opacity: opacitaDietro,
                  transition: "opacity 0.4s linear",
                }}
              >
                <Shot {...dietro} />
              </Finestra>
            )}

            <Telefono
              className="mx-auto w-[min(78%,19rem)]"
              style={
                {
                  // lo scroll fa girare il telefono: da tre quarti a quasi frontale
                  "--phone-y": `${(invertito ? 26 : -26) + t * (invertito ? -34 : 34)}deg`,
                  "--phone-x": `${8 - t * 9}deg`,
                } as React.CSSProperties
              }
            >
              <Shot {...progetto.shot[0]} />
            </Telefono>

            {/* numeri: fuori dal telefono, spinti avanti sull'asse Z */}
            <div
              className="mt-10 grid grid-cols-3 gap-4"
              style={{ transform: "translateZ(60px)" }}
            >
              {progetto.numeri.map((num, i) => (
                <div
                  key={num.etichetta}
                  className="text-center transition-all duration-700 ease-[var(--ease-out-expo)]"
                  style={{
                    opacity: t > i * 0.22 ? 1 : 0.15,
                    transform: `translateY(${t > i * 0.22 ? 0 : 12}px)`,
                  }}
                >
                  <div
                    className="display text-3xl md:text-4xl"
                    style={{ color: accento }}
                  >
                    {num.valore}
                  </div>
                  <div className="mt-1.5 text-[0.7rem] leading-tight text-ink-faint">
                    {num.etichetta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* barra di avanzamento della sezione */}
      <div className="sticky bottom-0 z-10 h-px w-full bg-line">
        <div
          className="h-full origin-left"
          style={{ background: accento, transform: `scaleX(${p})` }}
        />
      </div>
    </div>
  );
}

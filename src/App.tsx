import { Suspense, lazy, useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Chi from "./components/Chi";
import ProgettoSezione from "./components/Progetto";
import Altri from "./components/Altri";
import Contatti from "./components/Contatti";
import { TitoloSezione } from "./components/ui";
import { progetti, persona, links } from "./data/content";
import { initScroll } from "./lib/scroll";
import { useQualita, useReveal } from "./lib/hooks";

// La scena WebGL non deve ritardare il primo disegno: arriva dopo.
const Scene = lazy(() => import("./scene/Scene"));

export default function App() {
  const alta = useQualita();
  const testataProgetti = useReveal<HTMLDivElement>();

  useEffect(() => {
    initScroll();
  }, []);

  return (
    <div className="grain relative min-h-screen">
      {/* Strato 3D: fisso dietro tutto, non intercetta i click. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Suspense fallback={null}>
          <Scene alta={alta} />
        </Suspense>
        {/* Velo: senza, il testo sopra il cromo non si legge. Su fondo crema
            deve annacquare anche il centro, non solo i bordi — un oggetto
            scuro dietro a testo scuro non lo salvano i soli bordi sfumati. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, color-mix(in oklab, var(--color-void) 58%, transparent) 0%, color-mix(in oklab, var(--color-void) 86%, transparent) 62%, var(--color-void) 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Nav />

        <main>
          <Hero />
          <Chi />

          <section id="progetti" className="relative">
            <div
              ref={testataProgetti}
              className="mx-auto max-w-7xl px-6 pb-4 pt-20 md:px-12 md:pt-32"
            >
              <TitoloSezione
                numero="02"
                occhiello="Progetti principali"
                titolo={
                  <>
                    Due prodotti veri,
                    <br />
                    <span className="text-gradient">online adesso.</span>
                  </>
                }
              />
            </div>

            {progetti.map((p, i) => (
              <ProgettoSezione key={p.id} progetto={p} indice={i} />
            ))}
          </section>

          <Altri />
          <Contatti />
        </main>

        <footer className="border-t border-line px-6 py-12 md:px-12">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-5">
              <p className="font-mono text-xs text-ink-faint">
                © {new Date().getFullYear()} {persona.nome} — {persona.luogo}
              </p>
              {/* pagina a se', fuori dalla SPA: link vero, non scrollTo */}
              <a
                href="/identity"
                className="rounded-full border border-line px-4 py-1.5 font-mono text-[0.68rem] text-ink-dim transition-colors duration-300 hover:border-line-strong hover:text-ciano"
              >
                Brand identity ↗
              </a>
            </div>
            <ul className="flex flex-wrap gap-5">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    target={l.id === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-xs text-ink-faint transition-colors duration-300 hover:text-ciano"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useReveal } from "../lib/hooks";
import { links, persona } from "../data/content";
import { TitoloSezione } from "./ui";

export default function Contatti() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="contatti"
      className="relative px-6 py-28 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <TitoloSezione
          numero="04"
          occhiello="Contatti"
          titolo={
            <>
              Parliamone.
              <br />
              <span className="text-gradient">Rispondo davvero.</span>
            </>
          }
        />

        <div className="scene-3d">
          <ul className="border-t border-line">
            {links.map((link, i) => (
              <li
                key={link.id}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <a
                  href={link.href}
                  target={link.id === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group relative flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line py-7 transition-colors duration-500 hover:border-line-strong md:py-9"
                >
                  {/* riempimento che sale da sinistra all'hover */}
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-2rem] right-[-2rem] -z-10 origin-left scale-x-0 rounded-2xl bg-gradient-to-r from-viola/12 to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-ink-faint">
                      0{i + 1}
                    </span>
                    <span className="display text-[clamp(1.8rem,5vw,3.4rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                      {link.label}
                    </span>
                  </span>

                  <span className="flex items-center gap-6">
                    <span className="hidden text-sm text-ink-faint md:block">
                      {link.nota}
                    </span>
                    <span className="font-mono text-sm text-ink-dim transition-colors duration-500 group-hover:text-ciano">
                      {link.value}
                    </span>
                    <span
                      className="text-lg text-ink-faint transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ciano"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-14 max-w-lg text-sm leading-relaxed text-ink-faint"
          data-reveal
        >
          {persona.luogo}, Italia. Su Discord e per email sono il posto giusto per
          le cose di lavoro; su Instagram, per tutto il resto.
        </p>
      </div>
    </section>
  );
}

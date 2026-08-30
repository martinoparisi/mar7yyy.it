import { useState, type ReactNode } from "react";
import { useTilt } from "../lib/hooks";

/**
 * Immagine con segnaposto. Finché il file non esiste in /public/img
 * mostra un riquadro etichettato con quello che ci va messo: appena
 * il file c'è, l'immagine compare da sola senza toccare il codice.
 */
export function Shot({
  src,
  alt,
  nota,
  ratio = "16 / 10",
  className = "",
}: {
  src: string;
  alt: string;
  nota: string;
  ratio?: string;
  className?: string;
}) {
  const [mancante, setMancante] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-abyss ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {!mancante && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setMancante(true)}
          className="h-full w-full object-cover"
        />
      )}

      {mancante && (
        <div
          className="absolute inset-0 grid place-content-center gap-2 p-6 text-center"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#ffffff08 0 1px,transparent 1px 11px)",
          }}
          aria-label={alt}
        >
          <span className="eyebrow text-ink-faint">Segnaposto</span>
          <span className="font-mono text-[0.7rem] text-ciano/80">{src}</span>
          <span className="max-w-64 text-sm leading-snug text-ink-dim">{nota}</span>
        </div>
      )}
    </div>
  );
}

/** Cornice telefono in 3D vero: strati separati su translateZ. */
export function Telefono({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`scene-3d ${className}`} style={style}>
      <div
        className="relative rounded-[2.4rem] border border-line-strong bg-[#0c0c16] p-[0.55rem] shadow-[0_50px_120px_-30px_#000,0_0_80px_-40px_var(--color-viola)]"
        style={{
          transform:
            "rotateY(var(--phone-y,-16deg)) rotateX(var(--phone-x,6deg)) translateZ(0)",
          transformStyle: "preserve-3d",
          transition: "transform 1.2s var(--ease-out-expo)",
        }}
      >
        {/* riflesso di vetro, sta sopra allo schermo */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-[2.4rem] opacity-60"
          style={{
            background:
              "linear-gradient(115deg,#ffffff26 0%,transparent 28%,transparent 72%,#ffffff12 100%)",
          }}
        />
        <div className="relative overflow-hidden rounded-[1.95rem]">
          {children}
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/** Cornice da browser, per le schermate desktop. */
export function Finestra({
  children,
  url,
  className = "",
  style,
}: {
  children: ReactNode;
  url: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line-strong bg-[#0c0c16] shadow-[0_40px_120px_-40px_#000] ${className}`}
      style={style}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-2 py-1 text-center font-mono text-[0.6rem] text-ink-faint">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Card con tilt 3D e alone che segue il puntatore. */
export function Card({
  children,
  className = "",
  tilt = 8,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
}) {
  const ref = useTilt<HTMLDivElement>(tilt);

  return (
    <div className="scene-3d h-full">
      <div
        ref={ref}
        className={`glass edge-glow group relative h-full overflow-hidden rounded-3xl transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:border-line-strong hover:shadow-[0_40px_90px_-40px_var(--color-viola)] hover:[&::after]:opacity-100 ${className}`}
        style={{
          transform:
            "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--color-viola) 16%, transparent), transparent 65%)",
          }}
        />
        <div className="relative h-full" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[0.68rem] text-ink-dim">
      {children}
    </span>
  );
}

/** Titolo di sezione con numero e filo luminoso. */
export function TitoloSezione({
  numero,
  occhiello,
  titolo,
}: {
  numero: string;
  occhiello: string;
  titolo: ReactNode;
}) {
  return (
    <header className="mb-16 md:mb-24">
      <div className="mb-6 flex items-center gap-4" data-reveal>
        <span className="font-mono text-xs text-viola">{numero}</span>
        <span className="eyebrow">{occhiello}</span>
        <span
          className="h-px flex-1 bg-gradient-to-r from-viola/60 to-transparent"
          style={{ animation: "pulse-line 4s ease-in-out infinite" }}
        />
      </div>
      <h2
        className="display max-w-4xl text-[clamp(2.4rem,6vw,4.6rem)]"
        data-reveal
        style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
      >
        {titolo}
      </h2>
    </header>
  );
}

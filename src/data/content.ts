/**
 * Tutti i testi del sito stanno qui. I componenti non contengono copy:
 * cambiare una frase non deve voler dire aprire un file di layout.
 */

export const persona = {
  nome: "Martino Parisi",
  handle: "mar7yyy",
  ruolo: "Sviluppatore full stack",
  luogo: "Rovereto, Trentino",
  claim: "Costruisco cose che funzionano anche quando nessuno guarda.",
  bio: [
    "Scrivo software full stack: web, mobile e la parte noiosa sotto, quella che tiene su tutto.",
    "Mi interessano i progetti dove le regole sono scritte e non cambiano di nascosto — nei prodotti che faccio, la logica è leggibile e i conti tornano.",
  ],
};

export const links = [
  {
    id: "email",
    label: "Email",
    value: "parisimartino07@gmail.com",
    href: "mailto:parisimartino07@gmail.com",
    nota: "Il modo più veloce per parlarmi",
  },
  {
    id: "github",
    label: "GitHub",
    value: "@martinoparisi",
    href: "https://github.com/martinoparisi",
    nota: "Codice, quasi tutto in TypeScript",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@martinoparisi_",
    href: "https://instagram.com/martinoparisi_",
    nota: "La parte non tecnica",
  },
  {
    id: "discord",
    label: "Discord",
    value: "mar7yyy",
    href: "https://discordapp.com/users/730430436035133450",
    nota: "Per le cose che si spiegano meglio a voce",
  },
] as const;

export type Progetto = {
  id: string;
  nome: string;
  tagline: string;
  descrizione: string;
  anno: string;
  stato: string;
  href?: string;
  hrefLabel?: string;
  repo?: string;
  repoLabel?: string;
  accento: "viola" | "ciano";
  stack: string[];
  punti: { titolo: string; testo: string }[];
  numeri: { valore: string; etichetta: string }[];
  /**
   * shot[0] sta nel telefono in primo piano. shot[1] sta dietro: se è
   * verticale diventa un secondo telefono, se è orizzontale una finestra
   * di browser. Decide il rapporto, non un flag.
   */
  shot: { src: string; alt: string; nota: string; ratio: string }[];
};

export const progetti: Progetto[] = [
  {
    id: "rabar",
    nome: "RaBar",
    tagline: "La mappa dei bar, votata da chi ci va davvero.",
    descrizione:
      "Una mappa interattiva dove ogni bar viene giudicato su cinque cose che contano: quanto costa, quanto sono buoni i drink, quanta scelta c'è, quanto ci si sta bene e se gli orari sono quelli giusti. Nessun punteggio calato dall'alto: il voto è della comunità. Stesso account e stessi dati su web, Android e iPhone.",
    anno: "2026",
    stato: "In sviluppo attivo",
    href: "https://rabar.up.railway.app",
    hrefLabel: "Apri RaBar",
    repo: "https://github.com/orgs/barscore/",
    repoLabel: "Organizzazione GitHub",
    accento: "ciano",
    stack: [
      "React",
      "Vite",
      "Tailwind",
      "react-leaflet",
      "Hono.js",
      "Supabase",
      "PostGIS",
      "Kotlin",
      "SwiftUI",
      "Docker",
    ],
    punti: [
      {
        titolo: "Cinque voti, non una stella sola",
        testo:
          "Prezzo, qualità dei drink, varietà, socialità e orari restano cinque numeri separati. Un posto può essere economico e triste, o caro e bellissimo, o perfetto ma sempre chiuso quando ti serve: una media unica cancellerebbe proprio l'informazione utile.",
      },
      {
        titolo: "Nativa su tre piattaforme",
        testo:
          "Webapp installabile come PWA, client Android in Kotlin e client iOS in SwiftUI. Tre interfacce vere, un solo backend Hono e un solo database.",
      },
      {
        titolo: "Zero API a pagamento",
        testo:
          "Mappa, ricerca dei locali e geocoding girano su OpenStreetMap — tile OSM, Overpass, Nominatim. Nessuna chiave, nessun costo per utente, nessun fornitore che può cambiare i prezzi domani.",
      },
      {
        titolo: "Dati geografici seri",
        testo:
          "PostGIS su Postgres: le query per raggio e le classifiche di zona le fa il database, non il telefono. La mappa resta fluida anche con migliaia di locali caricati.",
      },
    ],
    numeri: [
      { valore: "3", etichetta: "Piattaforme native" },
      { valore: "5", etichetta: "Assi di voto" },
      { valore: "0", etichetta: "API a pagamento" },
    ],
    shot: [
      {
        src: "/img/rabar-mappa.webp",
        alt: "RaBar: la mappa con i locali e i pin dei punteggi",
        nota: "Screenshot mobile della mappa con i pin",
        ratio: "9 / 19.5",
      },
      {
        src: "/img/rabar-scheda.webp",
        alt: "RaBar: la scheda di un locale con il grafico dei cinque punteggi",
        nota: "Scheda locale con il grafico dei cinque punteggi",
        ratio: "9 / 19.5",
      },
    ],
  },
  {
    id: "mart",
    nome: "MART",
    tagline: "Video e live, dalla parte di chi li fa.",
    descrizione:
      "Piattaforma di video e live streaming costruita su un patto semplice con i creator: le regole stanno scritte, e non cambiano di nascosto. Percentuali dichiarate, soglie pubbliche, moderazione fatta da persone. Vive su watchmart.it, ma il progetto si chiama MART.",
    anno: "2026",
    stato: "Online",
    href: "https://watchmart.it/landing",
    hrefLabel: "Apri MART",
    accento: "viola",
    stack: [
      "React",
      "TypeScript",
      "Streaming live",
      "OAuth",
      "TOTP 2FA",
      "Stripe",
      "Postgres",
    ],
    punti: [
      {
        titolo: "Nessuno strike automatico",
        testo:
          "Le segnalazioni entrano in una coda che legge una persona. Anche il copyright viene esaminato a mano prima che qualcosa sparisca: un bot non chiude un canale mentre dormi.",
      },
      {
        titolo: "Percentuali scritte in chiaro",
        testo:
          "Creator verificati: 75% degli abbonamenti, 90% delle donazioni, 50% della pubblicità. Abbonamento canale a 4,99 € al mese, prelievo da 100 €. Numeri sulla pagina, non nascosti in un contratto.",
      },
      {
        titolo: "Soglie pubbliche",
        testo:
          "500 follower, 5.000 ore guardate e 30 video in 90 giorni. Sai in anticipo cosa serve per essere verificato, e un registro tiene traccia di acquisti e conversioni.",
      },
      {
        titolo: "Il tuo spazio, davvero tuo",
        testo:
          "Profilo componibile a riquadri con drag-and-drop, HTML in sandbox, colori e caratteri scelti da te. Catalogo senza algoritmo che decide al posto tuo.",
      },
    ],
    numeri: [
      { valore: "75%", etichetta: "Sugli abbonamenti" },
      { valore: "90%", etichetta: "Sulle donazioni" },
      { valore: "0", etichetta: "Strike automatici" },
    ],
    shot: [
      {
        src: "/img/mart-live.webp",
        alt: "MART: una diretta con la chat a lato",
        nota: "Diretta con chat a lato, vista mobile",
        ratio: "9 / 19.5",
      },
      {
        src: "/img/mart-home.webp",
        alt: "MART: la home con il catalogo dei video",
        nota: "Home desktop con il catalogo video",
        ratio: "16 / 9",
      },
    ],
  },
];

/** Sezione "altri progetti": si raccontano, non si linkano. */
export const altriProgetti = [
  {
    id: "gestionesoldi",
    nome: "GestioneSoldi",
    tipo: "PWA finanze personali",
    testo:
      "App per tenere i conti che non parla con nessuno: nessun account, nessun backend, nessuna chiamata di rete mentre la usi. Conti, movimenti e categorie vivono in IndexedDB sul dispositivo e funzionano offline. Tema e colore d'accento si scelgono a mano e vengono applicati prima del primo disegno della pagina, così non c'è il lampo bianco all'apertura.",
    stack: ["React", "Dexie", "Zustand", "Recharts", "Service Worker"],
  },
  {
    id: "schedinalab",
    nome: "SchedinaLab",
    tipo: "Analisi statistica sul calcio",
    testo:
      "Guarda come sono andate le partite passate e da lì calcola quanto è probabile ogni risultato. Poi mette la sua stima accanto alla quota del bookmaker e dice dove le due cose non coincidono: è lì che una giocata vale qualcosa. Suggerisce anche quanto puntare, tenendo bassa la parte di soldi a rischio. Alla fine rigioca tutto sulle stagioni vecchie per far vedere quante volte ci avrebbe preso davvero. È uno strumento di statistica, non una promessa di vincita.",
    stack: ["Next.js", "TypeScript", "Prisma", "Postgres", "Vitest"],
  },
  {
    id: "bot_investimenti",
    nome: "Analisi Mercati",
    tipo: "Analisi quantitativa di borsa",
    testo:
      "Guarda FTSE MIB, FTSE 100, NASDAQ 100 e S&P 500 e calcola con metodi statistici la probabilità che un titolo salga o scenda sull'orizzonte scelto. Classifiche dei dieci migliori e dei dieci peggiori, grafici aggiornati, watchlist salvata nel browser e un portafoglio che calcola le plusvalenze. Nessuna API a pagamento e nessun account. Non è consulenza finanziaria: il passato non decide il futuro.",
    stack: ["Next.js", "TypeScript", "Neon", "Vercel Cron"],
  },
  {
    id: "convertimelo",
    nome: "Convertimelo",
    tipo: "Convertitore tutto-in-uno — archiviato",
    testo:
      "Convertitore di file, unità, valute e testo che girava interamente nel browser: FFmpeg compilato in WebAssembly per audio e video, e Pyodide per eseguire davvero la libreria Python pint sulle unità di misura. I file non lasciavano mai il dispositivo. Progetto chiuso per problemi strutturali sul database, ma è quello che mi ha insegnato di più su cosa può fare il browser da solo.",
    stack: ["FFmpeg.wasm", "Pyodide", "jsPDF", "TypeScript"],
  },
] as const;

export const sezioni = [
  { id: "home", label: "Inizio" },
  { id: "progetti", label: "Progetti" },
  { id: "altro", label: "Altro" },
  { id: "contatti", label: "Contatti" },
] as const;

# Immagini

**Non modificare i file in `public/img/` a mano.** Sono generati da
`scripts/prepara-immagini.py` a partire dai file grezzi che stanno qui in
`img/`, fuori da `public/`, e quindi non finiscono nel sito pubblicato.

```bash
python3 scripts/prepara-immagini.py
```

Lo script: toglie la cornice del mockup dagli screenshot di telefono, arrotonda
gli angoli, ritaglia al rapporto giusto, converte in WebP e genera da solo
`og-image.png` e `apple-touch-icon.png`.

Per una **nuova** immagine di telefono va aggiunta una riga in `RITAGLI` con le
coordinate dello schermo dentro il mockup: si misurano una volta e restano.

## Cosa serve qui in `img/`

Finché un file manca, il sito mostra un riquadro segnaposto con dentro il
percorso e la descrizione. Appena il file esiste, l'immagine prende il suo
posto: non serve toccare il codice.

| File | Dove si vede | Cosa mettere | Formato consigliato |
|---|---|---|---|
| `ritratto.jpg` → `ritratto.webp` | Sezione "Chi sono" | Tua foto verticale, luce fredda o comunque scura, sfondo pulito | 4:5 — 1200x1500 px |
| `rabar-mappa.png` → `.webp` | Telefono di RaBar | Screenshot mobile della mappa con i pin dei locali | 9:19.5 — 1170x2532 px |
| `rabar-scheda.png` → `.webp` | Secondo telefono, dietro RaBar | Scheda di un locale col grafico dei cinque punteggi | verticale — 1179x2556 px |
| `mart-live.png` → `.webp` | Telefono di MART | Una diretta con la chat a lato, vista mobile | 9:19.5 — 1170x2532 px |
| `mart-home.png` → `.webp` | Finestra browser, dietro MART | Home desktop con il catalogo dei video | orizzontale — 1920x1080 px |
| `og-image.png` | Anteprima quando linki il sito | **Generata dallo script**, non serve fornirla | 1200x630 px |
| `apple-touch-icon.png` | Icona su iOS | **Generata dallo script**, non serve fornirla | 180x180 px |

Note:
- Gli screenshot mobile possono arrivare **con** il mockup del telefono: lo
  script lo scontorna. La cornice gliela mette poi il sito.
- Lo scatto di sfondo di un progetto cambia forma da solo in base al suo
  rapporto: **verticale** diventa un secondo telefono a fianco, **orizzontale**
  una finestra di browser. Il rapporto va dichiarato in `shot[1].ratio` dentro
  `src/data/content.ts`.
- Tieni gli screenshot in **tema scuro**, altrimenti stonano col resto.
- PNG per le interfacce, JPG per la foto.

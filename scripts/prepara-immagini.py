#!/usr/bin/env python3
"""
Prepara le immagini per il sito: taglia le cornici dei mockup, ridimensiona
e comprime, e genera og-image e apple-touch-icon.

    python3 scripts/prepara-immagini.py

Sorgenti in  img/   (file grezzi, non finiscono nel deploy)
Uscite in    public/img/

Gli screenshot arrivano dentro un mockup di telefono: quella cornice va tolta,
perché il sito ne disegna già una sua e due cornici una dentro l'altra fanno
schifo. RITAGLI tiene le coordinate dello schermo dentro ogni sorgente: sono
misurate a mano, un'immagine nuova va aggiunta qui.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

RADICE = Path(__file__).resolve().parent.parent
SORGENTI = RADICE / "img"
USCITA = RADICE / "public" / "img"

# nome sorgente -> (riquadro dello schermo, larghezza finale, nome in uscita)
RITAGLI = {
    "rabar-mappa.png": ((44, 38, 867, 1835), 700, "rabar-mappa.webp"),
    "mart-live.png": ((50, 47, 887, 1874), 700, "mart-live.webp"),
    # Senza mockup, ma con la barra di scorrimento sul bordo destro da togliere.
    "rabar-scheda.png": ((0, 0, 1162, 2556), 620, "rabar-scheda.webp"),
}

# Immagini senza cornice. rapporto None = tieni quello che ha: tagliare una
# schermata desktop sui lati vuol dire perdere il logo e il menu.
SEMPLICI = {
    "ritratto.jpg": (4 / 5, 1000, "ritratto.webp"),
    "mart-home.png": (None, 1600, "mart-home.webp"),
}

# Palette della brand identity (vedi /identity e src/index.css).
SLATE = (83, 70, 102)
TERRA = (220, 134, 101)
CREMA = (255, 239, 218)
INCHIOSTRO = (29, 27, 29)
GRIGIO = (73, 69, 77)
FONT_DIR = Path("/usr/share/fonts/truetype")

# Il marchio: "7" e "y" incastrati. Sorgente unica di favicon, icona iOS,
# logo del sito e anteprima social.
MARCHIO = "logo.png"


def font(nome: str, dim: int):
    for p in (
        FONT_DIR / "inter-zorin-os" / nome,
        FONT_DIR / "dejavu" / "DejaVuSans-Bold.ttf",
    ):
        if p.exists():
            return ImageFont.truetype(str(p), dim)
    return ImageFont.load_default()


def angoli_arrotondati(im: Image.Image, raggio_rel: float = 0.105) -> Image.Image:
    """
    Rende trasparenti gli angoli. Il ritaglio è rettangolare ma lo schermo è
    stondato: senza questo restano dentro quattro schegge di cornice.
    """
    im = im.convert("RGBA")
    w, h = im.size
    r = int(w * raggio_rel)
    maschera = Image.new("L", (w, h), 0)
    ImageDraw.Draw(maschera).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    im.putalpha(maschera)
    return im


def ritaglia_al_rapporto(im: Image.Image, rapporto: float) -> Image.Image:
    """Taglia il di più dal centro, senza mai deformare."""
    w, h = im.size
    if w / h > rapporto:
        nuovo_w = int(h * rapporto)
        x = (w - nuovo_w) // 2
        return im.crop((x, 0, x + nuovo_w, h))
    nuovo_h = int(w / rapporto)
    # Sui ritratti il soggetto sta in alto: taglio un terzo sopra, due sotto.
    y = (h - nuovo_h) // 3
    return im.crop((0, y, w, y + nuovo_h))


def trova(nome: str) -> Path | None:
    """
    Il sorgente puo' arrivare con un'altra estensione — l'iPhone esporta
    `.jpeg`, non `.jpg`. Cerchiamo per nome, non per nome esatto: altrimenti
    lo script stampa "manca" e tira dritto, e il sito resta con la vecchia foto.
    """
    esatto = SORGENTI / nome
    if esatto.exists():
        return esatto
    for alt in sorted(SORGENTI.glob(f"{Path(nome).stem}.*")):
        if alt.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            return alt
    return None


def scala(im: Image.Image, larghezza: int) -> Image.Image:
    if im.width <= larghezza:
        return im
    h = round(im.height * larghezza / im.width)
    return im.resize((larghezza, h), Image.LANCZOS)


def salva(im: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    suf = dest.suffix.lower()
    if suf == ".webp":
        # Lossy con alpha: gli screenshot in PNG pesavano 700 kB l'uno.
        im.save(dest, quality=80, method=6)
    elif suf in (".jpg", ".jpeg"):
        im.convert("RGB").save(dest, quality=82, optimize=True, progressive=True)
    else:
        im.save(dest, optimize=True)
    print(f"  {dest.relative_to(RADICE)}  {im.size[0]}x{im.size[1]}  "
          f"{dest.stat().st_size // 1024} kB")


def fondo(w: int, h: int) -> Image.Image:
    """
    Lo sfondo del sito: crema con la griglia da 24px. La griglia e' l'unico
    ornamento del design system, e regge anche a 1200x630.
    """
    im = Image.new("RGB", (w, h), CREMA)
    d = ImageDraw.Draw(im)
    passo = 24
    riga = tuple(round(c * 0.96 + s * 0.04) for c, s in zip(CREMA, SLATE))
    for x in range(0, w, passo):
        d.line((x, 0, x, h), fill=riga)
    for y in range(0, h, passo):
        d.line((0, y, w, y), fill=riga)
    return im


def carica_marchio() -> Image.Image:
    """
    Ritaglia il marchio dal suo sfondo e lo restituisce in RGBA con lo sfondo
    trasparente. L'alfa viene dalla distanza dal colore d'angolo: cosi' i bordi
    antialiasati restano morbidi invece di sgranarsi.
    """
    import numpy as np

    a = np.asarray(Image.open(trova(MARCHIO)).convert("RGB")).astype(np.int16)
    distanza = np.abs(a - a[4, 4]).sum(2)
    alfa = np.clip(distanza / 60, 0, 1)

    ys, xs = np.where(distanza > 40)
    riquadro = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)

    im = Image.fromarray(a.astype(np.uint8), "RGB")
    im.putalpha(Image.fromarray((alfa * 255).astype(np.uint8), "L"))
    return im.crop(riquadro)


def marchio_quadrato(lato: int, margine: float, fondo=None) -> Image.Image:
    """Marchio centrato in un quadrato. `margine` e' la quota di vuoto per lato."""
    m = carica_marchio()
    utile = int(lato * (1 - 2 * margine))
    scala_ = utile / max(m.size)
    m = m.resize((max(1, round(m.width * scala_)), max(1, round(m.height * scala_))),
                 Image.LANCZOS)
    tela = Image.new("RGBA", (lato, lato), (*fondo, 255) if fondo else (0, 0, 0, 0))
    tela.alpha_composite(m, ((lato - m.width) // 2, (lato - m.height) // 2))
    return tela


def genera_icone() -> None:
    """
    iOS non gestisce la trasparenza nell'icona di home: quella va piena, con
    un margine piu' largo perche' il sistema le arrotonda gli angoli da solo.
    """
    # Arte piatta: 64 colori bastano e il PNG passa da 137 kB a pochi kB.
    salva(marchio_quadrato(180, 0.16, CREMA).convert("RGB").quantize(64),
          USCITA / "apple-touch-icon.png")

    for lato in (32, 192, 512):
        salva(marchio_quadrato(lato, 0.08, CREMA).convert("RGB").quantize(64),
              USCITA / f"favicon-{lato}.png")

    # Logo in pagina: sfondo trasparente, si posa sulla crema del sito.
    # 256 basta: il posto piu' grande dove compare e' la card di /identity.
    salva(marchio_quadrato(256, 0.02).quantize(64).convert("RGBA"),
          USCITA / "logo.webp")

    # /favicon.ico lo chiedono ancora crawler e vecchi browser.
    ico = USCITA.parent / "favicon.ico"
    marchio_quadrato(64, 0.08, CREMA).convert("RGB").save(
        ico, sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"  {ico.relative_to(RADICE)}  16/32/48  {ico.stat().st_size // 1024} kB")


def genera_og() -> None:
    """Anteprima social: marchio a sinistra, nome e riga di servizio a destra."""
    w, h = 1200, 630
    im = fondo(w, h)

    marchio = marchio_quadrato(300, 0.02)
    im.paste(marchio, (90, (h - 300) // 2), marchio)

    d = ImageDraw.Draw(im)
    d.text((450, 214), "Martino Parisi", font=font("Inter-Bold.ttf", 82), fill=SLATE)
    d.text((450, 318), "Sviluppatore full stack — Rovereto, Trentino",
           font=font("Inter-Medium.ttf", 30), fill=GRIGIO)
    d.text((450, 372), "mar7yyy.it", font=font("Inter-SemiBold.ttf", 30), fill=TERRA)
    d.rectangle((450, 180, 610, 184), fill=TERRA)

    salva(im, USCITA / "og-image.png")


def verifica() -> None:
    """
    Ogni /img/... citato nel codice deve esistere davvero. È l'unico controllo
    che serve: un percorso sbagliato qui si vede solo come riquadro grigio in
    pagina, e nessun build lo segnala.
    """
    import re

    citati = set()
    sorgenti = list((RADICE / "src").rglob("*.ts*")) + list(RADICE.glob("*.html"))
    for f in sorgenti:
        citati |= set(re.findall(r"/img/[\w.-]+", f.read_text()))
    mancanti = sorted(c for c in citati if not (RADICE / "public" / c[1:]).exists())
    print("Controllo percorsi:")
    for c in sorted(citati):
        print(f"  {'OK ' if c not in mancanti else 'MANCA'} {c}")
    assert not mancanti, f"immagini citate ma assenti: {mancanti}"


def main() -> None:
    print("Mockup da scontornare:")
    for nome, (riquadro, larghezza, uscita) in RITAGLI.items():
        src = trova(nome)
        if src is None:
            print(f"  (manca {nome})")
            continue
        im = Image.open(src).convert("RGB").crop(riquadro)
        salva(scala(angoli_arrotondati(im), larghezza), USCITA / uscita)

    print("Immagini semplici:")
    for nome, (rapporto, larghezza, uscita) in SEMPLICI.items():
        src = trova(nome)
        if src is None:
            print(f"  (manca {nome})")
            continue
        im = Image.open(src).convert("RGB")
        if rapporto is not None:
            im = ritaglia_al_rapporto(im, rapporto)
        salva(scala(im, larghezza), USCITA / uscita)

    print("Generate:")
    genera_icone()
    genera_og()

    verifica()


if __name__ == "__main__":
    main()

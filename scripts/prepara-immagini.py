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

VIOLA = (139, 92, 246)
CIANO = (34, 211, 238)
VUOTO = (5, 5, 11)
FONT_DIR = Path("/usr/share/fonts/truetype")


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


def gradiente(w: int, h: int) -> Image.Image:
    """
    Lo sfondo del sito: quasi nero con due aloni, viola in alto a sinistra e
    ciano in basso a destra. Falloff morbido, altrimenti si vede il bordo
    dell'alone come un'ellisse stampata sopra.
    """
    import numpy as np

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= w
    yy /= h

    def alone(cx, cy, raggio):
        d = np.sqrt(((xx - cx) * (w / h)) ** 2 + (yy - cy) ** 2) / raggio
        return np.clip(1 - d, 0, 1) ** 2.2

    a1 = alone(0.14, 0.02, 1.55) * 0.72
    a2 = alone(0.96, 1.06, 1.55) * 0.58

    fondo = np.zeros((h, w, 3), np.float32)
    for i in range(3):
        fondo[..., i] = VUOTO[i] + a1 * (VIOLA[i] - VUOTO[i]) + a2 * (CIANO[i] - VUOTO[i])

    # Griglia tenue: dà un appiglio all'occhio senza rubare la scena.
    passo = 60
    griglia = np.zeros((h, w), np.float32)
    griglia[::passo, :] = 1
    griglia[:, ::passo] = 1
    fondo += griglia[..., None] * 9

    return Image.fromarray(np.clip(fondo, 0, 255).astype(np.uint8), "RGB")


def genera_og() -> None:
    w, h = 1200, 630
    im = gradiente(w, h)
    d = ImageDraw.Draw(im)
    d.text((80, 190), "Martino Parisi", font=font("Inter-Bold.ttf", 96), fill="#f2f2f7")
    d.text((80, 310), "Sviluppatore full stack — Rovereto, Trentino",
           font=font("Inter-Medium.ttf", 34), fill="#a3a3b8")
    d.text((80, 380), "RaBar  ·  MART  ·  mar7yyy.it",
           font=font("Inter-SemiBold.ttf", 34), fill=CIANO)
    d.rectangle((80, 150, 340, 156), fill=VIOLA)
    salva(im, USCITA / "og-image.png")


def genera_icona() -> None:
    lato = 180
    grande = lato * 4
    im = Image.new("RGB", (grande, grande), VUOTO)
    px = im.load()
    for y in range(grande):
        for x in range(grande):
            t = (x + y) / (2 * grande)
            px[x, y] = (
                int(VIOLA[0] * (1 - t) + CIANO[0] * t),
                int(VIOLA[1] * (1 - t) + CIANO[1] * t),
                int(VIOLA[2] * (1 - t) + CIANO[2] * t),
            )
    d = ImageDraw.Draw(im)
    f = font("Inter-Black.ttf", int(grande * 0.62))
    riq = d.textbbox((0, 0), "M", font=f)
    d.text(
        ((grande - riq[2] - riq[0]) / 2, (grande - riq[3] - riq[1]) / 2),
        "M",
        font=f,
        fill=VUOTO,
    )
    salva(im.resize((lato, lato), Image.LANCZOS), USCITA / "apple-touch-icon.png")


def verifica() -> None:
    """
    Ogni /img/... citato nel codice deve esistere davvero. È l'unico controllo
    che serve: un percorso sbagliato qui si vede solo come riquadro grigio in
    pagina, e nessun build lo segnala.
    """
    import re

    citati = set()
    for f in (RADICE / "src").rglob("*.ts*"):
        citati |= set(re.findall(r"/img/[\w.-]+", f.read_text()))
    mancanti = sorted(c for c in citati if not (RADICE / "public" / c[1:]).exists())
    print("Controllo percorsi:")
    for c in sorted(citati):
        print(f"  {'OK ' if c not in mancanti else 'MANCA'} {c}")
    assert not mancanti, f"immagini citate ma assenti: {mancanti}"


def main() -> None:
    print("Mockup da scontornare:")
    for nome, (riquadro, larghezza, uscita) in RITAGLI.items():
        src = SORGENTI / nome
        if not src.exists():
            print(f"  (manca {nome})")
            continue
        im = Image.open(src).convert("RGB").crop(riquadro)
        salva(scala(angoli_arrotondati(im), larghezza), USCITA / uscita)

    print("Immagini semplici:")
    for nome, (rapporto, larghezza, uscita) in SEMPLICI.items():
        src = SORGENTI / nome
        if not src.exists():
            print(f"  (manca {nome})")
            continue
        im = Image.open(src).convert("RGB")
        if rapporto is not None:
            im = ritaglia_al_rapporto(im, rapporto)
        salva(scala(im, larghezza), USCITA / uscita)

    print("Generate:")
    genera_og()
    genera_icona()

    verifica()


if __name__ == "__main__":
    main()

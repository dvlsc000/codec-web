"""
Generates original monogram icons for the reference clients (public/clients/*.svg).

These are NOT the clients' logos — they're neutral initials in Codec's own brand
style, so the client list looks consistent. To use a client's official logo
instead, replace that client's file with the official one (same file name).

Run from the project root:  python brand/client_icons.py
"""
import os
import re
import unicodedata

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "clients")
FONT = os.path.join(ROOT, "node_modules", "@fontsource-variable", "unbounded", "files", "unbounded-latin-wght-normal.woff2")

# Initials per client (as listed in content/projects.ts).
CLIENTS = {
    "Sheraton Zagreb": "SH",
    "Westin Zagreb": "W",
    "Four Points Panorama": "FP",
    "Hotel International": "HI",
    "Hotel Jadran": "J",
    "Hotel Astarea": "A",
    "Hotel Mlini": "M",
    "Regent Esplanade Zagreb": "RE",
    "Hotel Dubrovnik Zagreb": "HD",
    "Hoteli Sunčani Hvar": "SH",
    "Hotel Crystal Beograd": "C",
    "Hotel Evropa Beograd": "E",
    "Hotel Atlantico Habana": "AH",
    "Club Karey": "CK",
    "Hotel Trinidad del Mar": "TM",
    "Hotel Blau Colonial": "BC",
    "Hotel Kawama": "K",
    "Complejo Hotelero Atlántico": "CA",
    "Agrokor": "A",
    "Agroprerada": "AP",
    "Belje": "B",
    "Frikom Beograd": "F",
    "Jamnica": "J",
    "Konzum": "K",
    "Konzum Sarajevo": "KS",
    "Ledo": "L",
    "PIK Vrbovec": "PV",
    "Sojara Zadar": "SZ",
    "Zvijezda": "Z",
    "PharmaS": "PS",
    "KBC Zagreb": "KZ",
    "KBC Rijeka": "KR",
    "Zračna luka Split": "ZS",
    "Splitska banka": "SB",
    "HBOR": "HB",
    "VipNet": "VN",
    "Vatrogasna postaja Zagreb": "VZ",
}

SIZE = 64


def slug(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def main():
    font = TTFont(FONT)
    font = instantiateVariableFont(font, {"wght": 600})
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    os.makedirs(OUT, exist_ok=True)

    for name, text in CLIENTS.items():
        # Lay out the initials (font units), then centre them in the tile.
        size = 26 if len(text) == 1 else 21
        scale = size / upm
        track = -0.04 * upm
        x = 0.0
        layout = []
        for ch in text:
            g = cmap[ord(ch)]
            layout.append((g, x))
            x += gs[g].width + track
        width = (x - track) * scale

        bp = BoundsPen(gs)
        for g, gx in layout:
            gs[g].draw(TransformPen(bp, (1, 0, 0, 1, gx, 0)))
        xmin, ymin, xmax, ymax = bp.bounds
        h = (ymax - ymin) * scale
        ox = (SIZE - width) / 2 - xmin * scale
        oy = (SIZE + h) / 2 + ymin * scale  # baseline (y flipped below)

        pen = SVGPathPen(gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        for g, gx in layout:
            gs[g].draw(TransformPen(pen, (scale, 0, 0, -scale, ox + gx * scale, oy)))
        d = pen.getCommands()

        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" width="{SIZE}" height="{SIZE}" role="img" aria-label="{name}">'
            f"<title>{name}</title>"
            f'<rect x="0.5" y="0.5" width="63" height="63" rx="15" fill="#1C1E23" stroke="#D3D6DC" stroke-opacity=".16"/>'
            f'<path d="{d}" fill="#D3D6DC"/>'
            f'<rect x="50" y="8" width="6" height="6" rx="1" fill="#FF5A1F"/>'
            f"</svg>"
        )
        with open(os.path.join(OUT, slug(name) + ".svg"), "w", encoding="utf-8") as f:
            f.write(svg)
    print(f"{len(CLIENTS)} icons written to {OUT}")


if __name__ == "__main__":
    main()

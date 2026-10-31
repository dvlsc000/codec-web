"""Builds the Codec logo kit (vector + raster) from geometry.py."""
import io
import json
import os
import shutil
import sys

import cairosvg
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import geometry as g

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "out", "codec-logo-kit")

# ------------------------------------------------------------------ brand colours
INK = "#16171B"       # brand dark
CHARCOAL = "#3A3D46"  # logo on light
STEEL = "#D3D6DC"     # logo on dark (slightly brighter than the original #C9CCD4 for legibility)
ORANGE = "#FF5A1F"    # signal orange
WHITE = "#FFFFFF"
BLACK = "#000000"

COLORWAYS = {
    "color": {"body": CHARCOAL, "accent": ORANGE, "note": "Primary — on white and light backgrounds"},
    "reverse": {"body": STEEL, "accent": ORANGE, "note": "Primary — on dark backgrounds"},
    "black": {"body": BLACK, "accent": BLACK, "note": "One-colour black — stamps, fax, engraving, newspapers"},
    "white": {"body": WHITE, "accent": WHITE, "note": "One-colour white — on photos or strong colour"},
}


# ------------------------------------------------------------------ geometry → SVG
def rects_svg(pixels, fill):
    return "".join(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{w:g}" fill="{fill}"/>' for x, y, w in pixels)


def mark_svg_body(ox, oy, s, body, accent, pixels=3):
    c = g.mark_c(ox, oy, s)
    return f'<path d="{g.d_of(c)}" fill="{body}"/>' + rects_svg(g.mark_pixels(ox, oy, s, pixels), accent)


def word_svg_body(ox, oy, s, body, accent):
    letters, (dx, dy, dw), width = g.wordmark(ox, oy, s)
    return f'<path d="{g.d_of(letters)}" fill="{body}"/>' + rects_svg([(dx, dy, dw)], accent), width


def svg_doc(w, h, inner, title="Codec", bg=None):
    bgrect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{bgrect}{inner}</svg>"
    )


WORD_W = g.wordmark()[2]


def lockup_horizontal(cw):
    gap = 44
    word_y = (120 - g.H) / 2
    inner = mark_svg_body(0, 0, 1, cw["body"], cw["accent"])
    w_inner, ww = word_svg_body(120 + gap, word_y, 1, cw["body"], cw["accent"])
    return svg_doc(120 + gap + ww, 120, inner + w_inner, "Codec")


def lockup_stacked(cw):
    gap = 40
    s = 1.0
    total_w = WORD_W
    mark_x = (total_w - 120) / 2
    inner = mark_svg_body(mark_x, 0, 1, cw["body"], cw["accent"])
    w_inner, ww = word_svg_body(0, 120 + gap, s, cw["body"], cw["accent"])
    return svg_doc(total_w, 120 + gap + g.H, inner + w_inner, "Codec")


def mark_only(cw, pixels=3):
    return svg_doc(120, 120, mark_svg_body(0, 0, 1, cw["body"], cw["accent"], pixels), "Codec")


def wordmark_only(cw):
    inner, ww = word_svg_body(0, 0, 1, cw["body"], cw["accent"])
    return svg_doc(ww, g.H, inner, "Codec")


def app_icon(size=1024, bg=INK, body=STEEL, accent=ORANGE, scale=0.54, radius=0.225, pixels=3, maskable=False):
    """Mark centred on a rounded (or full-bleed for maskable) square."""
    s = size * scale / 120
    off = (size - 120 * s) / 2
    if maskable:
        bgel = f'<rect width="{size}" height="{size}" fill="{bg}"/>'
    else:
        bgel = f'<rect width="{size}" height="{size}" rx="{size * radius:g}" fill="{bg}"/>'
    return svg_doc(size, size, bgel + mark_svg_body(off, off, s, body, accent, pixels), "Codec")


# ------------------------------------------------------------------ writers
def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def png(svg, path, width=None, height=None, bg=None):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=path, output_width=width, output_height=height, background_color=bg)


def pdf(svg, path):
    cairosvg.svg2pdf(bytestring=svg.encode(), write_to=path)


def eps(svg, path):
    cairosvg.svg2eps(bytestring=svg.encode(), write_to=path)


def export_set(folder, name, svg_fn, png_widths):
    for cw_name, cw in COLORWAYS.items():
        svg = svg_fn(cw)
        base = f"{OUT}/{folder}/{cw_name}/codec-{name}-{cw_name}"
        write(base + ".svg", svg)
        pdf(svg, base + ".pdf")
        eps(svg, base + ".eps")
        for w in png_widths:
            png(svg, f"{base}-{w}px.png", width=w)


def main():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    export_set("01-horizontal", "logo-horizontal", lockup_horizontal, [600, 1200, 2400, 4800])
    export_set("02-stacked", "logo-stacked", lockup_stacked, [500, 1000, 2000, 4000])
    export_set("03-mark", "mark", mark_only, [64, 256, 512, 1024, 2048])
    export_set("04-wordmark", "wordmark", wordmark_only, [600, 1200, 2400])

    # App icons
    d = f"{OUT}/05-app-icon"
    for variant, kw in {
        "dark": dict(bg=INK, body=STEEL, accent=ORANGE),
        "light": dict(bg="#F4F5F7", body=CHARCOAL, accent=ORANGE),
    }.items():
        svg = app_icon(1024, **kw)
        write(f"{d}/codec-app-icon-{variant}.svg", svg)
        for s in (1024, 512, 256, 180, 128):
            png(svg, f"{d}/codec-app-icon-{variant}-{s}px.png", width=s)

    # Favicons (web)
    d = f"{OUT}/06-favicon"
    fav_svg = app_icon(64, bg=INK, body=STEEL, accent=ORANGE, scale=0.62, radius=0.22, pixels=2)
    write(f"{d}/favicon.svg", fav_svg)
    for s in (16, 32, 48):
        png(fav_svg, f"{d}/favicon-{s}x{s}.png", width=s)
    imgs = [Image.open(f"{d}/favicon-{s}x{s}.png") for s in (16, 32, 48)]
    imgs[2].save(f"{d}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:2])
    full = app_icon(512, bg=INK, body=STEEL, accent=ORANGE, scale=0.56, radius=0.0)
    png(full, f"{d}/apple-touch-icon.png", width=180)
    png(app_icon(512, bg=INK, body=STEEL, accent=ORANGE, scale=0.56), f"{d}/android-chrome-192x192.png", width=192)
    png(app_icon(512, bg=INK, body=STEEL, accent=ORANGE, scale=0.56), f"{d}/android-chrome-512x512.png", width=512)
    png(app_icon(512, bg=INK, body=STEEL, accent=ORANGE, scale=0.44, maskable=True), f"{d}/maskable-512x512.png", width=512)
    write(
        f"{d}/site.webmanifest",
        json.dumps(
            {
                "name": "Codec informatika",
                "short_name": "Codec",
                "icons": [
                    {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
                    {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
                    {"src": "/maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
                ],
                "theme_color": INK,
                "background_color": INK,
                "display": "standalone",
            },
            indent=2,
        ),
    )

    # Paths for the website's React logo component
    c = g.mark_c()
    letters, dot, ww = g.wordmark()
    ts = [
        "// Generated by codec-brand/build.py from geometry.py — do not edit by hand.",
        f'export const MARK_C = "{g.d_of(c)}";',
        "export const MARK_PIXELS = " + json.dumps([{"x": x, "y": y, "s": w} for x, y, w in g.mark_pixels()]) + " as const;",
        f'export const WORDMARK = "{g.d_of(letters)}";',
        "export const WORDMARK_DOT = " + json.dumps({"x": round(dot[0], 2), "y": round(dot[1], 2), "s": dot[2]}) + " as const;",
        f"export const WORDMARK_WIDTH = {round(ww, 2)};",
        f"export const WORDMARK_HEIGHT = {g.H};",
        "",
    ]
    write(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "components", "brand", "logo-paths.ts"), "\n".join(ts))
    print("kit written to", OUT, "wordmark width", ww)


if __name__ == "__main__":
    main()

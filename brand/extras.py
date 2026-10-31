"""Social covers, email signature, animated SVGs and the brand guidelines PDF."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import geometry as g
import build as b
from playwright.sync_api import sync_playwright

OUT = b.OUT
HERE = os.path.dirname(os.path.abspath(__file__))


import base64
def _font(name):
    with open(os.path.join(HERE, "..", "node_modules", "@fontsource-variable", name.split("-")[0], "files", name), "rb") as f:
        return "data:font/woff2;base64," + base64.b64encode(f.read()).decode()

FONT_CSS = f"""
@font-face {{ font-family: Unbounded; src: url({_font('unbounded-latin-wght-normal.woff2')}) format('woff2'); font-weight: 200 900; }}
@font-face {{ font-family: Unbounded; src: url({_font('unbounded-latin-ext-wght-normal.woff2')}) format('woff2'); font-weight: 200 900; unicode-range: U+0100-024F; }}
@font-face {{ font-family: Inter; src: url({_font('inter-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url({_font('inter-latin-ext-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; unicode-range: U+0100-024F; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }}
"""

def svg_inline(fn, cw):
    s = fn(cw)
    return s.replace('<svg ', '<svg style="display:block;width:100%;height:auto" ', 1)

REV = b.COLORWAYS["reverse"]
COL = b.COLORWAYS["color"]

# ------------------------------------------------------------------ social / email
def cover_html(w, h, lockup_h, tagline=True):
    logo = svg_inline(b.lockup_horizontal, REV)
    lw = lockup_h * (120 + 44 + b.WORD_W) / 120
    tag = """<div class="tag"><span></span>AI glasovni agenti · Automatizacija i baze podataka · Web razvoj</div>""" if tagline else ""
    return f"""<html><head><style>{FONT_CSS}
    body {{ width:{w}px; height:{h}px; overflow:hidden; background:#111215; position:relative; }}
    .grid {{ position:absolute; inset:0; background-image:linear-gradient(rgba(211,214,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(211,214,220,.05) 1px,transparent 1px); background-size:{h/8:.0f}px {h/8:.0f}px; -webkit-mask-image:radial-gradient(ellipse 70% 90% at 75% 40%,#000,transparent); }}
    .glow {{ position:absolute; right:-10%; top:-60%; width:70%; height:180%; background:radial-gradient(closest-side,rgba(255,90,31,.28),transparent); }}
    .logo {{ position:absolute; left:{h*0.16:.0f}px; top:50%; transform:translateY(-50%); width:{lw:.0f}px; }}
    .tag {{ position:absolute; right:{h*0.16:.0f}px; bottom:{h*0.16:.0f}px; color:#a3a7b0; font-size:{max(14,h*0.045):.0f}px; display:flex; align-items:center; gap:12px; letter-spacing:.01em; }}
    .tag span {{ width:{max(8,h*0.025):.0f}px; height:{max(8,h*0.025):.0f}px; background:#FF5A1F; border-radius:2px; }}
    .px {{ position:absolute; background:#FF5A1F; border-radius:3px; }}
    </style></head><body><div class="glow"></div><div class="grid"></div>
    <div class="px" style="right:{h*0.42:.0f}px;top:{h*0.14:.0f}px;width:{h*0.11:.0f}px;height:{h*0.11:.0f}px;opacity:.9"></div>
    <div class="px" style="right:{h*0.42+h*0.17:.0f}px;top:{h*0.14+h*0.15:.0f}px;width:{h*0.065:.0f}px;height:{h*0.065:.0f}px;opacity:.7"></div>
    <div class="px" style="right:{h*0.42+h*0.28:.0f}px;top:{h*0.14+h*0.26:.0f}px;width:{h*0.04:.0f}px;height:{h*0.04:.0f}px;opacity:.5"></div>
    <div class="logo">{logo}</div>{tag}</body></html>"""

def profile_html(size):
    mark = svg_inline(b.mark_only, REV)
    return f"""<html><head><style>{FONT_CSS} body {{ width:{size}px;height:{size}px;background:#16171B;display:grid;place-items:center; }} .m {{ width:{size*0.5:.0f}px; }}</style></head><body><div class="m">{mark}</div></body></html>"""

# ------------------------------------------------------------------ animated SVGs
def animated_mark(with_word=False):
    c = g.mark_c()
    px = g.mark_pixels()
    word = ""
    width = 120
    if with_word:
        letters, (dx, dy, dw), ww = g.wordmark(164, 35)
        word = f'<g class="w"><path d="{g.d_of(letters)}" fill="#D3D6DC"/><rect class="dot" x="{dx:g}" y="{dy:g}" width="{dw:g}" height="{dw:g}" fill="#FF5A1F"/></g>'
        width = 164 + ww
    rects = "".join(
        f'<rect class="p p{i}" x="{x:g}" y="{y:g}" width="{s:g}" height="{s:g}" fill="#FF5A1F"/>' for i, (x, y, s) in enumerate(px)
    )
    css = """
    .c{animation:c 900ms cubic-bezier(.16,1,.3,1) both}
    .p{transform-box:fill-box;transform-origin:center;animation:pop 600ms cubic-bezier(.34,1.56,.64,1) both, tx 3.6s ease-in-out 2s infinite}
    .p0{animation-delay:350ms,2s}.p1{animation-delay:470ms,2.12s}.p2{animation-delay:590ms,2.24s}
    .w{animation:c 900ms cubic-bezier(.16,1,.3,1) 200ms both}
    .dot{animation:blink 1.2s steps(2,jump-none) 1.4s infinite}
    @keyframes c{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
    @keyframes pop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
    @keyframes tx{0%,70%,100%{translate:0 0}80%{translate:6px -6px}}
    @keyframes blink{50%{opacity:0}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}
    """
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:g} 120" role="img" aria-label="Codec"><title>Codec</title>'
        f"<style>{css}</style><path class=\"c\" d=\"{g.d_of(c)}\" fill=\"#D3D6DC\"/>{rects}{word}</svg>"
    )

# ------------------------------------------------------------------ guidelines
def guide_html():
    import colorsys
    def cmyk(hexc):
        r, gg, bb = [int(hexc[i:i+2], 16) / 255 for i in (1, 3, 5)]
        k = 1 - max(r, gg, bb)
        if k == 1: return "0 0 0 100"
        c = (1 - r - k) / (1 - k); m = (1 - gg - k) / (1 - k); y = (1 - bb - k) / (1 - k)
        return " ".join(str(round(v * 100)) for v in (c, m, y, k))
    def rgb(hexc): return " ".join(str(int(hexc[i:i+2], 16)) for i in (1, 3, 5))

    hz_col = svg_inline(b.lockup_horizontal, COL); hz_rev = svg_inline(b.lockup_horizontal, REV)
    st_col = svg_inline(b.lockup_stacked, COL); st_rev = svg_inline(b.lockup_stacked, REV)
    mk_col = svg_inline(b.mark_only, COL); mk_rev = svg_inline(b.mark_only, REV)
    wm_col = svg_inline(b.wordmark_only, COL)
    hz_blk = svg_inline(b.lockup_horizontal, b.COLORWAYS["black"]); hz_wht = svg_inline(b.lockup_horizontal, b.COLORWAYS["white"])

    # construction drawing
    c = g.mark_c()
    px = g.mark_pixels()
    grid_lines = "".join(f'<line x1="{i*10}" y1="-10" x2="{i*10}" y2="130" stroke="#FF5A1F" stroke-opacity=".12" stroke-width=".4"/>' for i in range(0, 13)) + \
                 "".join(f'<line x1="-10" y1="{i*10}" x2="130" y2="{i*10}" stroke="#FF5A1F" stroke-opacity=".12" stroke-width=".4"/>' for i in range(0, 13))
    construction = f'''<svg viewBox="-24 -24 180 172" style="width:100%;height:auto;display:block">{grid_lines}
      <path d="{g.d_of(c)}" fill="#3A3D46" fill-opacity=".9"/>
      {"".join(f'<rect x="{x:g}" y="{y:g}" width="{s:g}" height="{s:g}" fill="#FF5A1F"/>' for x,y,s in px)}
      <line x1="105" y1="15" x2="45" y2="75" stroke="#16171B" stroke-dasharray="2 2" stroke-width=".6"/>
      <g font-family="Inter" font-size="5" fill="#16171B">
        <text x="-20" y="18">t</text><line x1="-14" y1="0" x2="-14" y2="30" stroke="#16171B" stroke-width=".5"/>
        <text x="122" y="-14">x = 30</text><line x1="90" y1="-10" x2="120" y2="-10" stroke="#16171B" stroke-width=".5"/>
        <text x="80" y="54">18</text><text x="52" y="90" >11</text>
        <text x="0" y="140">120 × 120 · t = 30 · pixels 30 / 18 / 11 on a 45° axis</text>
      </g></svg>'''

    colours = [
        ("Signal Orange", "#FF5A1F", "The pixels. Accents, calls to action, highlights.", "Closest Pantone 1655 C — confirm with a print proof"),
        ("Charcoal", "#3A3D46", "Logo on light backgrounds, dark text in print.", "Closest Pantone 432 C"),
        ("Steel", "#D3D6DC", "Logo on dark backgrounds, light UI text.", "Closest Pantone Cool Gray 1 C"),
        ("Ink", "#16171B", "Brand background for digital and dark print.", "Closest Pantone Black 6 C"),
    ]
    swatches = "".join(f'''<div class="sw"><div class="chip" style="background:{h}"></div><h4>{n}</h4><p class="muted">{d}</p>
      <dl><dt>HEX</dt><dd>{h}</dd><dt>RGB</dt><dd>{rgb(h)}</dd><dt>CMYK*</dt><dd>{cmyk(h)}</dd><dt>Print</dt><dd>{pms}</dd></dl></div>''' for n, h, d, pms in colours)

    def dont(label, style, inner=hz_col):
        return f'<div class="dont"><div class="dbox"><div style="width:72%;{style}">{inner}</div></div><p><b>✕</b> {label}</p></div>'
    recolored = b.lockup_horizontal({"body": "#3A3D46", "accent": "#2E7DF6"}).replace('<svg ', '<svg style="display:block;width:100%;height:auto" ', 1)
    rearr = b.svg_doc(120, 120, f'<path d="{g.d_of(g.mark_c())}" fill="#3A3D46"/>' + b.rects_svg([(10, 100, 11), (60, 60, 18), (80, 20, 30)], "#FF5A1F")).replace('<svg ', '<svg style="display:block;width:40%;height:auto;margin:auto" ', 1)
    donts = "".join([
        dont("Don't stretch or squash", "transform:scaleX(1.3);width:58%"),
        dont("Don't recolour the pixels", "", recolored),
        dont("Don't rotate", "transform:rotate(-12deg)"),
        dont("Don't add shadows or effects", "filter:drop-shadow(4px 6px 2px rgba(0,0,0,.55)) blur(.3px)"),
        dont("Don't rearrange the pixels", "", rearr),
        dont("Don't place on busy backgrounds", "background:repeating-linear-gradient(45deg,#ffb547 0 10px,#ff5a1f 10px 20px);padding:8px"),
    ])

    files = [
        ("Website header, presentations on light slides", "01-horizontal/color/…svg or …png"),
        ("Website / app on dark backgrounds", "01-horizontal/reverse/…svg"),
        ("Square spaces: signage, merchandise, social posts", "02-stacked/…"),
        ("Small spaces, profile pictures, app icons", "03-mark/… · 05-app-icon/…"),
        ("Browser tab icon and home-screen icons", "06-favicon/ (ready for the web)"),
        ("Printing: letterhead, business cards, banners", "…pdf or …eps (vector)"),
        ("One-colour printing, engraving, stamps", "…/black/ or …/white/"),
        ("LinkedIn, Facebook, X, Instagram", "07-social/"),
        ("Email signature", "08-email/ (insert at half its pixel width)"),
        ("Animated logo for web, video intros", "09-animated/"),
    ]
    files_rows = "".join(f"<tr><td>{a}</td><td><code>{p}</code></td></tr>" for a, p in files)

    page = lambda inner, cls="": f'<section class="page {cls}">{inner}<footer><span>Codec — Brand guidelines</span><span class="pg"></span></footer></section>'
    css = FONT_CSS + """
    @page { size: 297mm 210mm; margin: 0; }
    body { color:#16171B; background:#fff; counter-reset: pg; }
    .page { width:297mm; height:210mm; padding:18mm 20mm 16mm; position:relative; page-break-after:always; overflow:hidden; counter-increment: pg; }
    .page.dark { background:#111215; color:#F1F2F4; }
    footer { position:absolute; left:20mm; right:20mm; bottom:9mm; display:flex; justify-content:space-between; font-size:8pt; color:#8A8E98; }
    .pg::after { content: counter(pg, decimal-leading-zero); }
    h1,h2,h3,h4 { font-family:Unbounded; font-weight:500; letter-spacing:-.03em; }
    h1 { font-size:40pt; line-height:1.02; }
    h2 { font-size:24pt; margin-bottom:8mm; }
    h3 { font-size:11pt; margin-bottom:3mm; }
    h4 { font-size:10pt; margin:4mm 0 1.5mm; }
    p { font-size:10pt; line-height:1.55; max-width:120mm; }
    .muted { color:#6C707A; } .dark .muted { color:#A3A7B0; }
    .label { font-size:8pt; color:#8A8E98; margin-bottom:3mm; }
    .row { display:grid; gap:10mm; }
    .box { border:1px solid #E4E6EA; border-radius:4mm; padding:10mm; display:grid; place-items:center; }
    .box.ink { background:#16171B; border-color:#16171B; }
    .sw .chip { height:34mm; border-radius:3mm; border:1px solid rgba(0,0,0,.08); }
    dl { display:grid; grid-template-columns:16mm 1fr; font-size:8.5pt; row-gap:1mm; margin-top:3mm; }
    dt { color:#8A8E98; } dd { font-variant-numeric:tabular-nums; }
    .dont .dbox { height:30mm; border:1px solid #E4E6EA; border-radius:3mm; display:grid; place-items:center; overflow:hidden; }
    .dont p { font-size:8.5pt; margin-top:2mm; } .dont b { color:#E5484D; }
    table { width:100%; border-collapse:collapse; font-size:9.5pt; }
    td { padding:2.6mm 0; border-bottom:1px solid #E4E6EA; vertical-align:top; } td:first-child { width:55%; }
    code { font-family:Inter; font-size:8.5pt; color:#3A3D46; background:#F2F3F5; padding:.5mm 1.5mm; border-radius:1mm; }
    .clear { position:relative; padding:14mm; border:1px dashed #FF5A1F; display:inline-block; }
    .clear::before { content:'x'; position:absolute; left:4mm; top:3mm; font-size:8pt; color:#FF5A1F; }
    .type-sample { font-family:Unbounded; font-size:30pt; letter-spacing:-.04em; line-height:1.05; }
    """
    pages = []
    pages.append(page(f'''
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 85% 10%,rgba(255,90,31,.28),transparent 45%)"></div>
      <div style="position:relative;width:120mm;margin-top:20mm">{hz_rev}</div>
      <div style="position:absolute;left:20mm;bottom:30mm">
        <p class="label" style="color:#A3A7B0">Codec informatika d.o.o. · Zagreb</p>
        <h1>Brand guidelines</h1>
        <p class="muted" style="margin-top:4mm">Logo, colour and typography — version 2.0, October 2026</p>
      </div>''', "dark"))
    pages.append(page(f'''
      <h2>The logo</h2>
      <div class="row" style="grid-template-columns:1fr 1fr;align-items:start">
        <div>
          <p>A codec turns a signal into data. The mark shows exactly that: a solid <b>C</b> releasing three pixels of Signal Orange that step outward along a 45° line, shrinking as they go — information leaving the system, encoded.</p>
          <p style="margin-top:4mm">Version 2.0 redraws the original logo on a strict grid. The C stroke is a quarter of the mark; the pixels shrink by a factor of about 0.6 and sit on one diagonal. The medium pixel aligns with the end of the top arm, and the smallest pixel keeps equal distance from both inner edges of the C. The custom wordmark uses the same rounded-corner system, with a pixel as its full stop.</p>
          <div style="width:110mm;margin-top:10mm">{hz_col}</div>
        </div>
        <div style="width:118mm;justify-self:end">{construction}</div>
      </div>'''))
    pages.append(page(f'''
      <h2>Logo versions</h2>
      <div class="row" style="grid-template-columns:1.4fr 1fr 0.7fr;gap:6mm">
        <div><p class="label">Horizontal — primary</p><div class="box" style="height:38mm"><div style="width:85%">{hz_col}</div></div></div>
        <div><p class="label">Stacked</p><div class="box" style="height:38mm"><div style="width:62%">{st_col}</div></div></div>
        <div><p class="label">Mark</p><div class="box" style="height:38mm"><div style="width:44%">{mk_col}</div></div></div>
        <div><div class="box ink" style="height:38mm"><div style="width:85%">{hz_rev}</div></div></div>
        <div><div class="box ink" style="height:38mm"><div style="width:62%">{st_rev}</div></div></div>
        <div><div class="box ink" style="height:38mm"><div style="width:44%">{mk_rev}</div></div></div>
      </div>
      <div class="row" style="grid-template-columns:1fr 1fr 1fr;gap:6mm;margin-top:6mm">
        <div><p class="label">Wordmark</p><div class="box" style="height:24mm"><div style="width:70%">{wm_col}</div></div></div>
        <div><p class="label">One colour — black</p><div class="box" style="height:24mm"><div style="width:80%">{hz_blk}</div></div></div>
        <div><p class="label">One colour — white</p><div class="box" style="height:24mm;background:#FF5A1F;border-color:#FF5A1F"><div style="width:80%">{hz_wht}</div></div></div>
      </div>'''))
    pages.append(page(f'''
      <h2>Clear space and minimum size</h2>
      <div class="row" style="grid-template-columns:1.3fr 1fr;align-items:center">
        <div><div class="clear"><div style="width:110mm">{hz_col}</div></div></div>
        <div>
          <h3>Clear space</h3>
          <p class="muted">Keep free space around the logo equal to <b>x</b> — the size of the largest pixel (a quarter of the mark's height). Nothing else may enter this area.</p>
          <h3 style="margin-top:8mm">Minimum size</h3>
          <p class="muted">Horizontal logo: 120 px wide on screen, 30 mm in print.<br>Stacked logo: 80 px / 20 mm.<br>Mark: 24 px / 8 mm. Below 24 px use the favicon files, which drop the smallest pixel for clarity.</p>
          <div style="display:flex;gap:8mm;align-items:end;margin-top:8mm">
            <div style="width:30mm">{hz_col}</div><div style="width:8mm">{mk_col}</div>
          </div>
        </div>
      </div>'''))
    pages.append(page(f'''<h2>Colour</h2><div class="row" style="grid-template-columns:repeat(4,1fr);gap:7mm">{swatches}</div>
      <p class="muted" style="margin-top:8mm;font-size:8pt;max-width:none">* CMYK values are mathematical conversions. For printed matter, always confirm the orange against a press proof or the closest Pantone reference.</p>'''))
    pages.append(page(f'''
      <h2>Typography</h2>
      <div class="row" style="grid-template-columns:1fr 1fr;gap:14mm">
        <div><p class="label">Display — Unbounded (Google Fonts, free)</p>
          <div class="type-sample">Svaki poziv odgovoren.</div>
          <p class="muted" style="margin-top:4mm">Headlines and large numbers. Medium weight (500), tight letter-spacing (−3 to −4%). Supports Croatian characters č ć đ š ž.</p></div>
        <div><p class="label">Text — Inter (Google Fonts, free)</p>
          <div style="font-size:15pt;line-height:1.45;max-width:110mm">Codec gradi AI glasovne agente, automatizaciju poslovanja, baze podataka i web rješenja za tvrtke koje žele raditi brže.</div>
          <p class="muted" style="margin-top:4mm">Body copy, interface text, documents and email. Regular (400) for text, Medium (500) for buttons and labels.</p></div>
      </div>
      <p class="label" style="margin-top:12mm">The logo's wordmark is custom-drawn and is not a font — always use the logo files.</p>'''))
    pages.append(page(f'''<h2>Please don't</h2><div class="row" style="grid-template-columns:repeat(3,1fr);gap:7mm">{donts}</div>'''))
    pages.append(page(f'''<h2>Which file to use</h2><table>{files_rows}</table>
      <p class="muted" style="margin-top:6mm">SVG, PDF and EPS are vector files: they scale to any size without losing quality — send these to printers and sign makers. PNG files are for screens and documents.</p>'''))
    return f"<html><head><meta charset='utf-8'><style>{css}</style></head><body>{''.join(pages)}</body></html>"


def main():
    social = {
        "codec-linkedin-cover-1584x396.png": (cover_html(1584, 396, 92), 1584, 396),
        "codec-facebook-cover-1640x624.png": (cover_html(1640, 624, 120), 1640, 624),
        "codec-x-header-1500x500.png": (cover_html(1500, 500, 104), 1500, 500),
        "codec-og-share-1200x630.png": (cover_html(1200, 630, 110), 1200, 630),
        "codec-profile-1080x1080.png": (profile_html(1080), 1080, 1080),
        "codec-profile-400x400.png": (profile_html(400), 400, 400),
    }
    os.makedirs(f"{OUT}/07-social", exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch()
        for name, (html, w, h) in social.items():
            pg = br.new_page(viewport={"width": w, "height": h})
            pg.set_content(html, wait_until="networkidle")
            pg.wait_for_timeout(200)
            pg.screenshot(path=f"{OUT}/07-social/{name}")
            pg.close()
        pg = br.new_page()
        pg.set_content(guide_html(), wait_until="networkidle")
        pg.wait_for_timeout(400)
        pg.pdf(path=f"{OUT}/Codec-Brand-Guidelines.pdf", width="297mm", height="210mm", print_background=True)
        br.close()

    # email signature (displayed at half the pixel width for retina sharpness)
    for cw in ("color", "reverse"):
        svg = b.lockup_horizontal(b.COLORWAYS[cw])
        b.png(svg, f"{OUT}/08-email/codec-email-signature-{cw}-440px.png", width=440)
    # animated
    b.write(f"{OUT}/09-animated/codec-mark-animated.svg", animated_mark(False))
    b.write(f"{OUT}/09-animated/codec-logo-animated.svg", animated_mark(True))
    print("extras done")

if __name__ == "__main__":
    main()

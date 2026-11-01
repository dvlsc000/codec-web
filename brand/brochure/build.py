"""Builds the Call Accounting Manager brochure (HR + EN) as A4 PDFs plus a
cover image for the website.

    python brand/brochure/build.py

Output: public/brochures/codec-call-accounting-manager-{hr,en}.{pdf,jpg}
Needs: pip install playwright && playwright install chromium.
Fonts come from public/fonts (see brand/fonts/subset.py).
"""
import base64, html, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from content import T, COMMON, LOGO  # noqa: E402

OUT = ROOT / "public" / "brochures"
FONTS = ROOT / "public" / "fonts"


def font(path: pathlib.Path, wght: int) -> str:
    """Static instance of a variable font, so the PDF embeds real outlines
    (variable fonts get embedded as heavy Type 3 fonts)."""
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    import io
    f = instancer.instantiateVariableFont(TTFont(path), {"wght": wght})
    f.flavor = None
    buf = io.BytesIO(); f.save(buf)
    return "data:font/ttf;base64," + base64.b64encode(buf.getvalue()).decode()


def e(s: str) -> str:
    return html.escape(s)


CSS = """
@font-face { font-family: Unbounded; font-weight: 500; src: url(%(unb500)s) format('truetype'); }
@font-face { font-family: Unbounded; font-weight: 500; src: url(%(unbx500)s) format('truetype'); unicode-range: U+0100-024F; }
@font-face { font-family: Inter; font-weight: 400; src: url(%(inter400)s) format('truetype'); }
@font-face { font-family: Inter; font-weight: 400; src: url(%(interx400)s) format('truetype'); unicode-range: U+0100-024F; }
@font-face { font-family: Inter; font-weight: 500; src: url(%(inter500)s) format('truetype'); }
@font-face { font-family: Inter; font-weight: 500; src: url(%(interx500)s) format('truetype'); unicode-range: U+0100-024F; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --night:#111215; --n2:#16171b; --n3:#1c1e23; --line:rgba(211,214,220,.1); --line2:rgba(211,214,220,.2);
  --fg:#f1f2f4; --muted:#a3a7b0; --subtle:#868b95; --ember:#ff5a1f; --amber:#ffb547; --steel:#d3d6dc; }
html, body { background: var(--night); color: var(--fg); font-family: Inter, sans-serif; font-feature-settings: "ss01","cv11";
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; padding: 18mm 18mm 16mm; display: flex; flex-direction: column;
  page-break-after: always; background: var(--night); }
.page:last-child { page-break-after: auto; }
.grid-bg { position:absolute; inset:0; background-image: linear-gradient(rgba(211,214,220,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(211,214,220,.045) 1px, transparent 1px);
  background-size: 10mm 10mm; }
.glow { position:absolute; background: radial-gradient(closest-side, rgba(255,90,31,.22), rgba(255,90,31,0)); }
h1, h2, h3, .display { font-family: Unbounded, sans-serif; font-weight: 500; letter-spacing: -.035em; }
.head { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
.head svg { height: 7mm; width:auto; }
.tag { font-size: 8pt; color: var(--subtle); letter-spacing: .02em; display:flex; align-items:center; gap: 2.2mm; }
.sq { display:inline-block; width:1.6mm; height:1.6mm; background:var(--ember); border-radius:.3mm; }
.foot { margin-top:auto; display:flex; justify-content:space-between; align-items:center; font-size:7.5pt; color:var(--subtle);
  border-top:1px solid var(--line); padding-top: 4mm; position:relative; z-index:2; }
.kicker { font-size: 9pt; color: var(--ember); font-weight: 500; display:flex; gap:2.5mm; align-items:center; }
.h2 { font-size: 22pt; line-height: 1.08; }
.lead { font-size: 11pt; line-height: 1.6; color: var(--muted); }

/* Cover */
.cover h1 { font-size: 46pt; line-height: .98; letter-spacing: -.05em; margin-top: 7mm; max-width: 150mm; }
.cover .tagline { font-size: 13pt; line-height: 1.5; color: var(--muted); margin-top: 8mm; max-width: 140mm; }
.chips { display:flex; gap: 2.5mm; margin-top: 9mm; }
.chip { border:1px solid var(--line2); border-radius: 99px; padding: 2mm 4.5mm; font-size: 9pt; color: var(--fg); display:flex; gap: 2mm; align-items:center; background: rgba(255,255,255,.02); }
.hero { position: relative; z-index:2; margin-top: auto; margin-bottom: 10mm; }

/* Flow diagram */
.flow { display:grid; grid-template-columns: repeat(4, 1fr); gap: 0; position:relative; }
.flow .rail { position:absolute; left: 6mm; right: 6mm; top: 6mm; height: 1px; background: linear-gradient(90deg, var(--ember), var(--amber) 60%%, rgba(255,181,71,.2)); }
.flow .node { position:relative; padding-right: 4mm; }
.flow .dot { width: 12mm; height: 12mm; border-radius: 3mm; border:1px solid rgba(255,90,31,.5); background: var(--n2); display:grid; place-items:center;
  font-family: Unbounded; font-size: 9pt; color: var(--ember); box-shadow: 0 0 0 2mm rgba(255,90,31,.06); position:relative; z-index:1; }
.flow .node:first-child .dot { background: var(--ember); color: var(--night); border-color: var(--ember); }
.flow b { display:block; margin-top: 5mm; font-family: Unbounded; font-weight:500; font-size: 9.5pt; letter-spacing: -.02em; }
.flow span.s { display:block; margin-top: 1.5mm; font-size: 8.5pt; color: var(--muted); line-height: 1.4; }

.panel { border:1px solid var(--line); background: linear-gradient(160deg, rgba(255,255,255,.035), rgba(255,255,255,.01)), var(--n2); border-radius: 5mm; position:relative; }
.edge { border-color: rgba(255,90,31,.38); background: linear-gradient(150deg, rgba(255,90,31,.10), rgba(255,90,31,.015) 45%%, rgba(255,255,255,.01)), var(--n2); }

/* Overview */
.summary { font-family: Unbounded; font-weight: 500; font-size: 15pt; line-height: 1.3; letter-spacing: -.025em; margin-top: 6mm; }
.cols2 { display:grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 7mm; }
.cols2 p { font-size: 10pt; line-height: 1.65; color: var(--muted); }
.features { display:grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; margin-top: 6mm; }
.feat { padding: 5.5mm 6mm; border-radius: 4mm; border: 1px solid var(--line); background: var(--n2); }
.feat .n { font-family: Unbounded; font-size: 8pt; color: var(--ember); }
.feat h3 { font-size: 10.5pt; margin-top: 3mm; letter-spacing: -.02em; line-height: 1.25; }
.feat p { font-size: 8.8pt; line-height: 1.55; color: var(--muted); margin-top: 1.8mm; }

/* Editions */
.eds { display:grid; gap: 4mm; margin-top: 9mm; }
.ed { display:grid; grid-template-columns: 52mm 1fr; gap: 8mm; padding: 7mm 7mm; }
.ed .num { font-family: Unbounded; font-size: 30pt; color: rgba(255,90,31,.85); letter-spacing: -.06em; line-height: 1; }
.ed h3 { font-size: 13pt; margin-top: 4mm; }
.ed .t { font-size: 9pt; line-height: 1.5; color: var(--muted); margin-top: 2mm; }
.ed ul { list-style: none; display:grid; gap: 2.4mm; align-content: start; padding-top: 1mm; }
.ed li { font-size: 9.6pt; line-height: 1.45; color: rgba(241,242,244,.88); display:flex; gap: 3mm; }
.ed li::before { content:""; flex: none; width: 1.5mm; height: 1.5mm; border-radius: .3mm; background: var(--ember); margin-top: 1.9mm; }

/* Specs */
table { width:100%%; border-collapse: collapse; margin-top: 7mm; }
td { padding: 4mm 5mm; font-size: 9.6pt; line-height: 1.5; border-top: 1px solid var(--line); vertical-align: top; }
tr:first-child td { border-top: 0; }
tr:nth-child(odd) td { background: var(--n2); }
td.k { width: 46mm; color: var(--subtle); font-size: 8.8pt; }
.specs { border:1px solid var(--line); border-radius: 4mm; overflow:hidden; margin-top: 7mm; }
.specs table { margin: 0; }
.exch { display:flex; flex-wrap:wrap; gap: 2.2mm; margin-top: 4mm; }
.exch span { border:1px solid var(--line2); border-radius: 2mm; padding: 2.2mm 4mm; font-size: 9.5pt; font-weight: 500; background: rgba(255,255,255,.02); }
.contact { margin-top: 9mm; padding: 9mm; display:grid; grid-template-columns: 1.1fr 1fr; gap: 8mm; overflow:hidden; }
.contact h2 { font-size: 17pt; line-height: 1.12; }
.contact p { font-size: 9.5pt; color: var(--muted); line-height: 1.55; margin-top: 3mm; }
.contact dl { display:grid; gap: 3mm; align-content:center; }
.contact dt { font-size: 7.5pt; color: var(--subtle); }
.contact dd { font-size: 10.5pt; font-weight: 500; margin-top: .6mm; }
"""

PIX = """<svg viewBox="0 0 120 120" width="%s" height="%s"><rect x="90" y="0" width="30" height="30" fill="#FF5A1F"/><rect x="60" y="42" width="18" height="18" fill="#FF5A1F" opacity=".9"/><rect x="39.5" y="69.5" width="11" height="11" fill="#FF5A1F" opacity=".75"/></svg>"""


def head(t, right):
    return f'<div class="head">{LOGO}<div class="tag"><span class="sq"></span>{e(right)}</div></div>'


def foot(t, n):
    return f'<div class="foot"><span>{e(t["company"])} · {COMMON["web"]}</span><span>{e(t["title"])} · {e(t["page"])} {n}/4</span></div>'


def build_html(t):
    flow = "".join(f'<div class="node"><div class="dot">{i+1:02d}</div><b>{e(a)}</b><span class="s">{e(b)}</span></div>' for i, (a, b) in enumerate(t["flow"]))
    feats = "".join(f'<div class="feat"><span class="n">{i+1:02d}</span><h3>{e(a)}</h3><p>{e(b)}</p></div>' for i, (a, b) in enumerate(t["features"]))
    eds = "".join(
        f'<div class="ed panel{" edge" if i == 1 else ""}"><div><div class="num">{i+1:02d}</div><h3>{e(a)}</h3><p class="t">{e(b)}</p></div>'
        f'<ul>{"".join(f"<li>{e(p)}</li>" for p in pts)}</ul></div>'
        for i, (a, b, pts) in enumerate(t["editions"])
    )
    specs = "".join(f'<tr><td class="k">{e(a)}</td><td>{e(b)}</td></tr>' for a, b in t["specs"])
    exch = "".join(f"<span>{x}</span>" for x in COMMON["exchanges"])
    chips = "".join(f'<span class="chip"><span class="sq"></span>{e(c)}</span>' for c in t["editionsShort"])
    L = t["labels"]
    return f"""<!doctype html><html lang="{t['lang']}"><head><meta charset="utf-8"><title>{e(t['title'])} — Codec</title><style>{CSS % FONTCSS}</style></head><body>

<section class="page cover">
  <div class="grid-bg" style="left:90mm; bottom:150mm; opacity:.8"></div>
  <div class="glow" style="width:170mm;height:170mm;right:-60mm;top:-40mm"></div>
  <div class="glow" style="width:120mm;height:120mm;left:-50mm;bottom:20mm;opacity:.5"></div>
  {head(t, COMMON['web'])}
  <div style="position:absolute; right: 18mm; top: 52mm; z-index:1; opacity:.95">{PIX % ('62mm','62mm')}</div>
  <div style="position:relative; z-index:2; margin-top: 70mm">
    <div class="kicker"><span class="sq"></span>{e(t['kicker'])}</div>
    <h1>{e(t['title'])}</h1>
    <p class="tagline">{e(t['tagline'])}</p>
    <div class="chips">{chips}</div>
  </div>
  <div class="hero">
    <div class="panel edge" style="padding: 8mm 8mm 9mm">
      <div class="tag" style="margin-bottom:6mm"><span class="sq"></span>{e(t['flowTitle'])}</div>
      <div class="flow"><div class="rail"></div>{flow}</div>
    </div>
  </div>
  {foot(t, 1)}
</section>

<section class="page">
  <div class="glow" style="width:140mm;height:140mm;right:-70mm;top:-50mm;opacity:.6"></div>
  {head(t, t['overviewTitle'])}
  <div style="margin-top: 14mm; position:relative">
    <div class="kicker"><span class="sq"></span>{e(t['overviewTitle'])}</div>
    <p class="summary">{e(t['summary'])}</p>
    <div class="cols2">{''.join(f'<p>{e(p)}</p>' for p in t['intro'])}</div>
  </div>
  <div style="margin-top: 11mm; position:relative">
    <h2 class="h2">{e(t['featuresTitle'])}</h2>
    <div class="features">{feats}</div>
  </div>
  {foot(t, 2)}
</section>

<section class="page">
  <div class="grid-bg" style="bottom:200mm; opacity:.7"></div>
  {head(t, t['editionsTitle'])}
  <div style="margin-top: 14mm; position:relative">
    <div class="kicker"><span class="sq"></span>{e(t['editionsTitle'])}</div>
    <h2 class="h2" style="margin-top:5mm; max-width:150mm">{e(t['editionsLead'])}</h2>
    <div class="eds">{eds}</div>
  </div>
  {foot(t, 3)}
</section>

<section class="page">
  <div class="glow" style="width:160mm;height:160mm;left:-80mm;bottom:-60mm;opacity:.55"></div>
  {head(t, t['specsTitle'])}
  <div style="margin-top: 14mm; position:relative">
    <div class="kicker"><span class="sq"></span>{e(t['specsTitle'])}</div>
    <div class="specs"><table>{specs}</table></div>
    <h3 style="font-size:11pt; margin-top: 9mm">{e(t['exchangesTitle'])}</h3>
    <div class="exch">{exch}</div>
  </div>
  <div class="contact panel edge" style="position:relative">
    <div class="glow" style="width:110mm;height:110mm;right:-40mm;top:-50mm;opacity:.7"></div>
    <div style="position:relative"><h2>{e(t['contactTitle'])}</h2><p>{e(t['contactText'])}</p>
      <p style="margin-top:6mm; font-size:8.5pt; color: var(--subtle)">{e(t['company'])}<br>{e(COMMON['address'])}</p></div>
    <dl style="position:relative">
      <div><dt>{e(L['phone'])}</dt><dd>{COMMON['phone']}</dd></div>
      <div><dt>{e(L['email'])}</dt><dd>{COMMON['email']}</dd></div>
      <div><dt>{e(L['support'])}</dt><dd>{COMMON['support']}</dd></div>
      <div><dt>{e(L['web'])}</dt><dd>{COMMON['web']}</dd></div>
    </dl>
  </div>
  {foot(t, 4)}
</section>
</body></html>"""


FONTCSS = {
    f"{key}{x}{w}": font(FONTS / f"{fam}-{part}.woff2", w)
    for fam, key, weights in (("unbounded", "unb", (500,)), ("inter", "inter", (400, 500)))
    for x, part in (("", "latin"), ("x", "hr"))
    for w in weights
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for lang, t in T.items():
            name = f"codec-call-accounting-manager-{lang}"
            doc = build_html(t)
            pg = b.new_page()
            pg.set_content(doc, wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.pdf(path=str(OUT / f"{name}.pdf"), format="A4", print_background=True, prefer_css_page_size=True)
            # Cover thumbnail for the website (first page only).
            pg.set_viewport_size({"width": 794, "height": 1123})
            pg.screenshot(path=str(OUT / f"{name}.jpg"), type="jpeg", quality=82, clip={"x": 0, "y": 0, "width": 794, "height": 1123})
            pg.close()
            print("built", name)
        b.close()

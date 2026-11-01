"""Builds the web fonts in public/fonts from the Fontsource variable files.

Only what the site uses is kept: the weight axis is limited to 400–600, and the
Latin Extended file is cut down to the Croatian letters (č ć đ š ž) plus a few
symbols. Run after `npm i -D @fontsource-variable/inter @fontsource-variable/unbounded`:

    python brand/fonts/subset.py
"""
import io, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "public" / "fonts"
HR = "ČčĆćĐđŠšŽž"
EXTRA_EXT = HR + "€"

def build(family, file, out, text=None, unicodes=None):
    f = TTFont(SRC / family / "files" / file)
    f = instancer.instantiateVariableFont(f, {"wght": (400, 600)})
    buf = io.BytesIO(); f.flavor = None; f.save(buf); buf.seek(0); f = TTFont(buf)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(text=text or "", unicodes=unicodes or [])
    s.subset(f)
    f.flavor = "woff2"
    f.save(OUT / out)
    print(out, (OUT / out).stat().st_size // 1024, "KB")

OUT.mkdir(parents=True, exist_ok=True)
latin = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x131, 0x152, 0x153, 0x2BB, 0x2BC, 0x2C6, 0x2DA, 0x2DC] + list(range(0x2000, 0x2070)) + [0x20AC, 0x2122, 0x2190, 0x2192, 0x2212, 0x2215]
for fam, pre in (("inter", "inter"), ("unbounded", "unbounded")):
    build(fam, f"{pre}-latin-wght-normal.woff2", f"{pre}-latin.woff2", unicodes=latin)
    build(fam, f"{pre}-latin-ext-wght-normal.woff2", f"{pre}-hr.woff2", text=EXTRA_EXT)

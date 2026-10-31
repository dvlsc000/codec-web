"""
Codec logo geometry — single source of truth for every logo file and the
website's React logo component.

Grid: the mark sits on a 120 x 120 unit square.
  * C stroke            t = 30   (1/4 of the square)
  * C corner radius     outer 32 / inner 2 (centerline radius 17)
  * Top arm ends at x = 78; gap to the first pixel = 12 (= gap between arm and pixel row)
  * Pixels shrink by ~0.6 and step along an exact 45° diagonal:
        30 x 30 at (90, 0)
        18 x 18 centred at (69, 51)  -> right edge aligns with the arm end (x = 78)
        11 x 11 centred at (45, 75)  -> equal 9.5 clearance to both inner edges of the C
Wordmark: cap height 50 (≈ 0.42 of the mark), stroke 9, centreline radius 9.5,
butt terminals, wide tracking; the full stop is an orange pixel echoing the mark.
"""
import math
import pathops
from fontTools.pens.svgPathPen import SVGPathPen

KAPPA = 0.5522847498  # cubic approximation of a 90° circular arc


def rounded_polyline(points, radius, closed=False, radii=None):
    """Centreline through points with circular (conic) corners."""
    p = pathops.Path()
    n = len(points)
    radii = radii or [radius] * n

    def corner(i):
        prev = points[(i - 1) % n]
        cur = points[i]
        nxt = points[(i + 1) % n]
        r = radii[i]
        if r == 0:
            return cur, cur, cur
        v1 = (prev[0] - cur[0], prev[1] - cur[1])
        v2 = (nxt[0] - cur[0], nxt[1] - cur[1])
        l1 = math.hypot(*v1)
        l2 = math.hypot(*v2)
        a = (cur[0] + v1[0] / l1 * r, cur[1] + v1[1] / l1 * r)
        b = (cur[0] + v2[0] / l2 * r, cur[1] + v2[1] / l2 * r)
        return a, cur, b

    if closed:
        a, c, b = corner(0)
        p.moveTo(*b)
        for i in list(range(1, n)) + [0]:
            a, c, b = corner(i)
            p.lineTo(*a)
            if a != b:
                arc(p, a, c, b)
        p.close()
    else:
        p.moveTo(*points[0])
        for i in range(1, n - 1):
            a, c, b = corner(i)
            p.lineTo(*a)
            if a != b:
                arc(p, a, c, b)
        p.lineTo(*points[-1])
    return p


def arc(p, a, c, b):
    """Quarter circle from a to b around corner c, as a cubic Bézier."""
    c1 = (a[0] + (c[0] - a[0]) * KAPPA, a[1] + (c[1] - a[1]) * KAPPA)
    c2 = (b[0] + (c[0] - b[0]) * KAPPA, b[1] + (c[1] - b[1]) * KAPPA)
    p.cubicTo(c1[0], c1[1], c2[0], c2[1], b[0], b[1])


def stroke(path, width, join=pathops.LineJoin.MITER_JOIN):
    path.stroke(width, pathops.LineCap.BUTT_CAP, join, 4)
    return path


def rect(x, y, w, h):
    p = pathops.Path()
    p.moveTo(x, y)
    p.lineTo(x + w, y)
    p.lineTo(x + w, y + h)
    p.lineTo(x, y + h)
    p.close()
    return p


def union(paths):
    builder = pathops.OpBuilder(fix_winding=True)
    for p in paths:
        builder.add(p, pathops.PathOp.UNION)
    return builder.resolve()


def d_of(path):
    pen = SVGPathPen(None, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
    path.draw(pen)
    return pen.getCommands()


# ---------------------------------------------------------------- mark
T = 30
RC = 17


def mark_c(ox=0.0, oy=0.0, s=1.0):
    h = T / 2
    pts = [(78, h), (h, h), (h, 120 - h), (120, 120 - h)]
    pts = [(ox + x * s, oy + y * s) for x, y in pts]
    path = rounded_polyline(pts, RC * s)
    return union([stroke(path, T * s)])


PIXELS = [  # x, y, size (in mark units)
    (90, 0, 30),
    (60, 42, 18),
    (39.5, 69.5, 11),
]


def mark_pixels(ox=0.0, oy=0.0, s=1.0, count=3):
    return [(ox + x * s, oy + y * s, w * s) for (x, y, w) in PIXELS[:count]]


# ---------------------------------------------------------------- wordmark
H = 50
SW = 10
RW = 9
TRACK = 24


def letter_C(x, y, w=56):
    h = SW / 2
    pts = [(x + w, y + h), (x + h, y + h), (x + h, y + H - h), (x + w, y + H - h)]
    return stroke(rounded_polyline(pts, RW), SW), w


def letter_O(x, y, w=60):
    h = SW / 2
    pts = [(x + h, y + h), (x + w - h, y + h), (x + w - h, y + H - h), (x + h, y + H - h)]
    return stroke(rounded_polyline(pts, RW, closed=True), SW), w


def letter_D(x, y, w=58):
    h = SW / 2
    pts = [(x + h, y + h), (x + w - h, y + h), (x + w - h, y + H - h), (x + h, y + H - h)]
    return stroke(rounded_polyline(pts, RW, closed=True, radii=[0, RW, RW, 0]), SW), w


def letter_E(x, y, w=50):
    c, _ = letter_C(x, y, w)
    h = SW / 2
    mid = pathops.Path()
    mid.moveTo(x + h, y + H / 2)
    mid.lineTo(x + w - 7, y + H / 2)
    return union([c, stroke(mid, SW)]), w


def wordmark(ox=0.0, oy=0.0, s=1.0):
    """Returns (letters_path, dot_rect, width) at scale s; letters drawn at unit scale then scaled."""
    x = 0.0
    parts = []
    for fn in (letter_C, letter_O, letter_D, letter_E, letter_C):
        p, w = fn(x, 0)
        parts.append(p)
        x += w + TRACK
    x -= TRACK
    dot_size = 10.5
    dot = (x + 11, H - dot_size, dot_size)
    width = dot[0] + dot_size
    letters = union(parts)
    if s != 1.0 or ox or oy:
        letters = transform(letters, s, ox, oy)
    dot = (ox + dot[0] * s, oy + dot[1] * s, dot[2] * s)
    return letters, dot, width * s


def transform(path, s, dx, dy):
    """Scale + translate a pathops Path by re-drawing it through a pen."""
    from fontTools.pens.transformPen import TransformPen
    from fontTools.pens.recordingPen import RecordingPen

    rec = RecordingPen()
    path.draw(rec)
    out = pathops.Path()
    pen = out.getPen()
    rec.replay(TransformPen(pen, (s, 0, 0, s, dx, dy)))
    return out

#!/usr/bin/env python3
"""
SURGICAL ARM GEOMETRY REPAIR — chinmai avatar (VectorImage.Svg)

Problem
-------
Each upper arm was a wedge whose top edge is a diagonal sitting BELOW the
shoulder pivot (right pivot: 266,352 — wedge tip only reaches y=369.3 and its
closing edge passes ~17px away from the pivot on the torso side). At rest the
shirt hides this. When the pose rig raises the arm (wave -148deg, pointUp
-158deg, happy -152deg...), the wedge rotates away from the shirt and exposes
a hollow background wedge between shoulder/upper-arm and the raised forearm.

Repair (geometry-only, both arms — same latent defect, mirrored)
----------------------------------------------------------------
Keep every existing command of the sleeve verbatim (outer edge, elbow-end
edge, inner elbow curve) and REPLACE only the straight closing diagonal with:
  1. an inner armhole seam curve rising from the elbow-end (253.7,444.3)
     up to (246.5,340) — tucked inside the shirt, clear of the collar,
  2. a shoulder-cap cubic hugging the shirt's shoulder line and passing
     ~2.3px ABOVE the shoulder pivot (266,352) so the sleeve always contains
     its own rotation pivot -> no rotation angle can open a hollow.
Left arm is the exact mirror (x -> 400 - x), keeping its own fill #946132.

Rest silhouette is preserved: the cap stays on/inside the shirt's shoulder
line (max deviation < 1.5 local px, sub-pixel on screen), so nothing moves
visually until the arm is rotated by the rig.

Everything else in the SVG is untouched: head, face, eyes, pupils, brows,
nose, mouth, hair, neck, shirt, collar, placket, pants, shoes, proportions,
scale, ids, hierarchy, z-order.
"""

SRC = "/home/z/my-project/upload/VectorImage.Svg"
OUT = "/home/z/my-project/download/chinmai-avatar-arm-repair.svg"

OLD_RIGHT = (
    '<path d="M278.3 369.3 C280.3 375.9 281.6 383.9 282 392.7 '
    'L284.6 456 L249.8 456 C250.5 452 252 448 253.7 444.3 Z" fill="#A56C38"/>'
)
NEW_RIGHT = (
    '<path d="M278.3 369.3 C280.3 375.9 281.6 383.9 282 392.7 '
    'L284.6 456 L249.8 456 C250.5 452 252 448 253.7 444.3 '
    'C250 410 247.5 375 246.5 340 C262 343.5 270 350.5 278.3 369.3 Z" fill="#A56C38"/>'
)

OLD_LEFT = (
    '<path d="M121.7 369.3 C119.7 375.9 118.4 383.9 118 392.7 '
    'L115.4 456 L150.2 456 C149.5 452 148 448 146.3 444.3 Z" fill="#946132"/>'
)
NEW_LEFT = (
    '<path d="M121.7 369.3 C119.7 375.9 118.4 383.9 118 392.7 '
    'L115.4 456 L150.2 456 C149.5 452 148 448 146.3 444.3 '
    'C150 410 152.5 375 153.5 340 C138 343.5 130 350.5 121.7 369.3 Z" fill="#946132"/>'
)

with open(SRC, encoding="utf-8") as f:
    svg = f.read()

assert svg.count(OLD_RIGHT) == 1, "right upper-arm path not found verbatim"
assert svg.count(OLD_LEFT) == 1, "left upper-arm path not found verbatim"

svg = svg.replace(OLD_RIGHT, NEW_RIGHT).replace(OLD_LEFT, NEW_LEFT)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(svg)

# sanity: report the diff footprint
print("repaired SVG written to", OUT)
print("right upper-arm: closing diagonal -> armhole seam + shoulder cap")
print("left  upper-arm: mirrored identical repair")

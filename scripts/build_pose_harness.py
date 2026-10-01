#!/usr/bin/env python3
"""Build a pose-test harness: repaired SVG + exact rig transforms per pose.
Used to visually verify the shoulder-cap repair under all raised-arm poses."""

SVG_PATH = "/home/z/my-project/download/chinmai-avatar-arm-repair.svg"
OUT = "/home/z/my-project/scripts/pose-test.html"

with open(SVG_PATH, encoding="utf-8") as f:
    svg = f.read()
# strip the xml declaration, drop fixed width/height so it scales in the page
svg = svg.replace('<?xml version="1.0" encoding="utf-8"?>', "")
svg = svg.replace(' width="125.873px" height="402.48px"', "")

# Pivots (character-local space): shoulder R (266,352), elbow R (266,440),
# shoulder L (134,352), elbow L (134,440).
POSES = {
    "idle":       "armRux:3, armRelbow:4, armLux:-3, armLelbow:-4",
    "wave":       "armRux:-148, armRelbow:-22",
    "pointUp":    "armRux:-158, armRelbow:-14",
    "pointRight": "armRux:-96, armRelbow:-10",
    "happy":      "armRux:-152, armRelbow:-12, armLux:152, armLelbow:12",
    "pointLeft":  "armLux:96, armLelbow:10",
    "think":      "armRux:-38, armRelbow:-122",
    "guide":      "armRux:-78, armRelbow:-38",
    "inspect":    "armRux:-30, armRelbow:-110",
}

buttons = "\n".join(
    f'<button data-pose="{name}" onclick="applyPose(this.dataset.pose)">{name}</button>'
    for name in POSES
)

html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ margin: 0; background: #F5F1E8; font-family: monospace; display: flex; }}
  .col {{ padding: 12px; }}
  .stage {{ width: 240px; background: #F5F1E8; outline: 1px dashed #c9c2b4; }}
  .stage svg {{ width: 100%; height: auto; display: block; }}
  .row {{ margin: 4px 0; }}
  button {{ margin: 2px; padding: 4px 8px; font-size: 12px; cursor: pointer; }}
  .label {{ font-size: 11px; color: #666; margin-top: 2px; }}
  h3 {{ font-size: 13px; margin: 8px 0 2px; }}
</style>
</head>
<body>
<div class="col">
  <h3>pose</h3>
  <div class="row">{buttons}</div>
  <div class="label" id="cur">idle</div>
</div>
<div class="stage">{svg}</div>
</body>
<script>
const POSES = {POSES!r};
function applyPose(name) {{
  const spec = POSES[name];
  const get = (k) => {{ const m = spec.split(',').find(s => s.trim().startsWith(k + ':')); return m ? parseFloat(m.split(':')[1]) : 0; }};
  const set = (id, a, cx, cy) => {{
    const el = document.getElementById(id);
    if (el) el.setAttribute('transform', 'rotate(' + a + ' ' + cx + ' ' + cy + ')');
  }};
  set('right-arm', get('armRux'), 266, 352);
  set('right-forearm', get('armRelbow'), 266, 440);
  set('left-arm', get('armLux'), 134, 352);
  set('left-forearm', get('armLelbow'), 134, 440);
  document.getElementById('cur').textContent = name + '  |  ' + spec;
}}
applyPose('idle');
</script>
</html>
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)
print("harness written:", OUT)

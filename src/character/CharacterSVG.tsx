/**
 * CHARACTER SVG — Chinmai's avatar as a single coherent 2D articulated rig.
 * Artwork unchanged: fair skin, brown long-sleeve shirt, black pants, dark
 * hair. What changed in THIS revision is the skeletal architecture only.
 *
 * RIG CONTRACT (parent → child; every rotating bone pivots at its joint):
 *   character (matrix)
 *   └── cj-root        jump / root tilt        pivot 200,754 (feet)
 *       ├── shadow     ground shadow scale     pivot 200,758
 *       └── cj-bob     breathing bob
 *           ├── legs (pelvis)
 *           │   ├── left-leg   hip  170,544
 *           │   │   └── left-shin  knee 170,650
 *           │   │       └── left-shoe  ankle 170,718
 *           │   └── right-leg  hip  230,544
 *           │       └── right-shin knee 230,650
 *           │           └── right-shoe ankle 230,718
 *           └── torso-rig      lean     pivot 200,552
 *               ├── neck       pivot 200,330
 *               ├── body > shirt
 *               ├── deltoid-left   STATIC shoulder cap (does NOT rotate)
 *               ├── left-arm       shoulder 134,352
 *               │   ├── left-upper-arm          capsule, hem hugs the elbow
 *               │   └── left-forearm   elbow 134,440
 *               │       └── left-hand wrist 134,552
 *               ├── deltoid-right  STATIC shoulder cap
 *               ├── right-arm      shoulder 266,352
 *               │   ├── right-upper-arm
 *               │   └── right-forearm  elbow 266,440
 *               │       └── right-hand wrist 266,552
 *               └── head           neck 200,276
 *                   ├── ears · face · hair
 *                   ├── left-eye  └── left-pupil   (child of the eye)
 *                   ├── right-eye └── right-pupil  (child of the eye)
 *                   └── mouth
 *
 * ARM GEOMETRY (replaces the previous cap-sleeve + seam patch):
 *   Each bone is a closed capsule. The upper arm is a shoulder ellipse
 *   (rx18 ry12) centered ON the shoulder pivot, tapering into a 15-radius
 *   hem arc centered ON the elbow pivot. The forearm is a 18.5-radius cap
 *   centered ON the elbow pivot — strictly larger than the hem it covers —
 *   so the elbow joint stays sealed at ANY shoulder × elbow angle pair.
 *   Two STATIC deltoid caps (torso layer, under the arms, sleeve-coloured)
 *   own the shoulder region: when a pose lifts the arm away, the cap — not
 *   background — fills the vacated armpit. No hollow shoulder, no floating
 *   forearm, no wedges.
 *
 * EYES: the pupils are now CHILDREN of their eyes inside the head group, so
 * they inherit head rotation/translation, torso lean and root tilt. The
 * former `group-1` pupil overlay (a world-space sibling of the torso that
 * let pupils drift off the face) is removed. Pupil ids left-pupil /
 * right-pupil replace the Figma group-26 / group-27 ids; rest coordinates
 * are converted from the overlay's translate(176.19008 -99.614404) space
 * into head-local coordinates (pixel-identical placement).
 */

export function CharacterSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="195.161 36.2549 125.8725 402.4796"
      className={className}
      role="img"
      aria-label="Illustrated guide character of Chinmai"
      // Raised poses (wave/point/happy) extend past the viewBox edges —
      // paint them instead of clipping hands/forearms at the viewport.
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="hair-clip">
          <path
            fill="#2A2430"
            stroke="#2A2430"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M 179.286 -100.77 L 173.6 -116.9 L 177.279 -124.38 L 172.262 -134.67 L 166.243 -118.83 L 168.584 -149.12 L 161.896 -161.07 L 177.613 -173.02 C 177.613 -173.02 151.863 -167.88 151.529 -156.48 C 151.529 -156.48 153.2 -172.32 174.268 -179.27 L 187.98 -191.49 L 205.036 -203.17 L 225.769 -210.39 L 262.221 -212.89 C 262.221 -212.89 270.916 -212.89 276.266 -208.45 C 281.617 -204 277.604 -213.73 277.604 -213.73 C 277.604 -213.73 291.316 -215.4 293.991 -205.67 L 307.033 -202.9 L 329.439 -190.39 C 329.439 -190.39 345.825 -173.15 341.143 -157.32 L 338.802 -162.88 C 338.802 -162.88 324.757 -159.82 344.822 -148.99 L 338.802 -133.97 L 333.117 -116.46 L 326.095 -102.3 L 322.081 -93.407 L 319.406 -90.35 L 315.727 -97.858 L 317.399 -108.98 L 310.378 -116.19 L 304.357 -127.87 L 292.653 -135.36 L 269.911 -135.92 L 242.155 -137.31 L 229.782 -132.58 L 213.395 -125.08 C 213.395 -125.08 204.032 -121.74 203.697 -121.47 C 203.363 -121.19 194.333 -109.8 194.333 -109.8 C 194.333 -109.8 193.999 -102.85 193.999 -102.57 C 193.999 -102.3 193.664 -86.459 193.664 -86.459 L 187.646 -86.459 L 179.286 -100.77 Z"
          />
        </clipPath>
      </defs>

      <g
        id="character"
        transform="matrix(0.5333579778671265, 0, 0, 0.5333579778671265, 151.42562979031823, 29.648969871170593)"
      >
        <g id="cj-root">
          {/* ground shadow — scales with jumps/breathing */}
          <g id="shadow">
            <ellipse cx="200" cy="758" rx="118" ry="9" fill="#000" opacity="0.12" />
          </g>

          <g id="cj-bob">
            {/* ---------------- LEGS (behind torso; hip→knee→ankle chain) ---------------- */}
            <g id="legs">
              <g id="left-leg">
                <path id="left-thigh" d="M138 536 L198 536 L196 650 L144 650 Z" fill="#25252C" />
                <path d="M138 536 L154 536 L150 650 L144 650 Z" fill="#17171C" />
                <g id="left-shin">
                  <circle id="left-knee" cx="170" cy="650" r="26" fill="#25252C" />
                  <path d="M144 650 L196 650 L192 722 L148 722 Z" fill="#25252C" />
                  <path d="M144 650 L158 650 L154 722 L148 722 Z" fill="#17171C" />
                  <g id="left-shoe">
                    <path
                      d="M144 714 L194 714 L198 738 Q200 750 186 750 L132 750 Q122 750 128 736 Z"
                      fill="#3A3B45"
                    />
                    <rect x="122" y="746" width="82" height="8" rx="4" fill="#EDEDED" />
                  </g>
                </g>
              </g>
              <g id="right-leg">
                <path id="right-thigh" d="M202 536 L262 536 L256 650 L204 650 Z" fill="#25252C" />
                <path d="M246 536 L262 536 L256 650 L250 650 Z" fill="#17171C" />
                <g id="right-shin">
                  <circle id="right-knee" cx="230" cy="650" r="26" fill="#25252C" />
                  <path d="M204 650 L256 650 L252 722 L208 722 Z" fill="#25252C" />
                  <path d="M242 650 L256 650 L252 722 L246 722 Z" fill="#17171C" />
                  <g id="right-shoe">
                    <path
                      d="M256 714 L206 714 L202 738 Q200 750 214 750 L268 750 Q278 750 272 736 Z"
                      fill="#3A3B45"
                    />
                    <rect x="196" y="746" width="82" height="8" rx="4" fill="#EDEDED" />
                  </g>
                </g>
              </g>
            </g>

            {/* ---------------- TORSO RIG ---------------- */}
            <g id="torso-rig">
              <g id="neck">
                <rect x="174" y="262" width="52" height="68" rx="10" fill="#FCDDB9" />
                <path
                  d="M 174 303.879 C 193.797 317.369 206.794 320.063 226 300.409 L 226 328 L 240.95 328.3 C 237.75 347.3 218.9 386.8 200 386.8 C 181.1 386.8 162.25 347.3 159.05 328.3 L 174 328 L 174 303.879 Z"
                  fill="#E8B98A"
                />
              </g>
              <g id="body">
                <g id="shirt">
                  <g transform="matrix(0.56 0 0 1.475 8.794 -281.75)">
                    <path
                      id="shirt-main"
                      fill="#C48C52"
                      d="M 429.439 565.244 L474.252 565.244 C 488.688 565.244 499.857 552.592 498.067 538.267 L 496.439 525.243 L 487.94 457.254 C 486.412 445.026 477.997 434.763 466.307 430.866 L 414.557 413.615 C 408.856 426.475 375.151 453.243 341.445 453.243 C 307.735 453.244 274.023 426.476 268.32 413.615 L 216.57 430.866 C 204.879 434.763 196.465 445.027 194.937 457.254 L 187.328 518.126 L 184.811 538.266 C 183.021 552.591 194.19 565.243 208.626 565.243 L 253.439 565.243 L 429.439 565.243 L 429.439 565.244 Z"
                    />
                    <polygon fill="#C48C52" points="333.439 429.243 341.439 453.243 314.974 453.864" />
                    <polygon fill="#C48C52" points="349.439 429.243 341.439 453.243 367.905 453.864" />
                    <path
                      id="collar-left"
                      fill="#946132"
                      d="M 333.439 429.243 L 314.973 453.864 C 312.052 457.759 306.359 458.163 302.916 454.721 L 261.439 413.243 L 280.273 394.409 C 283.199 391.483 287.873 391.271 291.051 393.92 L 333.439 429.243 Z"
                    />
                    <path
                      id="collar-right"
                      fill="#A56C38"
                      d="M 349.439 429.243 L 367.905 453.864 C 370.826 457.759 376.519 458.163 379.962 454.721 L 421.439 413.243 L 402.605 394.409 C 399.679 391.483 395.005 391.271 391.827 393.92 L 349.439 429.243 Z"
                    />
                    <polygon
                      id="placket"
                      fill="#A56C38"
                      points="349.439 429.243 341.439 453.243 333.439 429.243 333.439 565.244 349.439 565.244"
                    />
                    <path
                      fill="#946132"
                      d="M 201.607 441.411 C 198.055 445.908 195.677 451.341 194.938 457.254 L 184.812 538.266 C 183.021 552.591 194.191 565.243 208.627 565.243 L 253.439 565.243 L 253.439 513.176 C 253.439 505.479 250.665 498.041 245.626 492.223 L 201.607 441.411 Z"
                    />
                    <path
                      fill="#A56C38"
                      d="M 481.271 441.411 C 484.823 445.908 487.201 451.341 487.94 457.254 L 498.066 538.266 C 499.857 552.591 488.687 565.243 474.251 565.243 L 429.439 565.243 L 429.439 513.176 C 429.439 505.479 432.213 498.041 437.252 492.223 L 481.271 441.411 Z"
                    />
                  </g>
                </g>
              </g>

              {/* STATIC deltoid cap — owns the left shoulder region so raised
                  arms never reveal a background wedge at the armpit */}
              <path
                id="deltoid-left"
                fill="#946132"
                d="M 133 342 C 126 342.5 118.5 346 114.6 352.5 C 111.8 357.2 111.6 366 113.2 374.5 C 114.6 382.4 116.4 390.5 119.6 396.4 C 121.4 399.7 124.8 400.4 127 398.2 C 130.4 394.8 132.8 384 133.6 371 C 134.2 360.8 134 350 133 342 Z"
              />

              {/* ---------------- LEFT ARM (shoulder → elbow → wrist chain) ---------------- */}
              <g id="left-arm">
                <g id="left-upper-arm">
                  {/* capsule: shoulder ellipse contains pivot (134,352);
                      hem is a 15-radius arc centered on the elbow (134,440) */}
                  <path
                    d="M 116 352 A 18 12 0 0 1 152 352 L 149 440 A 15 15 0 0 1 119 440 Z"
                    fill="#946132"
                  />
                </g>
                <g id="left-forearm">
                  {/* 18.5-radius elbow cap always covers the upper-arm hem */}
                  <path
                    d="M 115.5 440 A 18.5 18.5 0 0 1 152.5 440 L 152.5 540 Q 152.5 552 140 552 L 128 552 Q 115.5 552 115.5 540 Z"
                    fill="#946132"
                  />
                  <path
                    d="M 115.5 526 L 152.5 526 L 152.5 540 Q 152.5 552 140 552 L 128 552 Q 115.5 552 115.5 540 Z"
                    fill="#7A4F28"
                  />
                  <g id="left-hand">
                    <ellipse cx="134" cy="576" rx="19" ry="24" fill="#FCDDB9" />
                    <ellipse cx="154" cy="568" rx="7" ry="13" fill="#FCDDB9" transform="rotate(-15 154 568)" />
                    <path
                      d="M126 592 L126 600 M134 594 L134 602 M142 592 L142 600"
                      stroke="#F2C79B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                </g>
              </g>

              {/* STATIC deltoid cap — right shoulder */}
              <path
                id="deltoid-right"
                fill="#A56C38"
                d="M 267 342 C 274 342.5 281.5 346 285.4 352.5 C 288.2 357.2 288.4 366 286.8 374.5 C 285.4 382.4 283.6 390.5 280.4 396.4 C 278.6 399.7 275.2 400.4 273 398.2 C 269.6 394.8 267.2 384 266.4 371 C 265.8 360.8 266 350 267 342 Z"
              />

              {/* ---------------- RIGHT ARM (mirror of the left chain) ---------------- */}
              <g id="right-arm">
                <g id="right-upper-arm">
                  <path
                    d="M 284 352 A 18 12 0 0 0 248 352 L 251 440 A 15 15 0 0 0 281 440 Z"
                    fill="#A56C38"
                  />
                </g>
                <g id="right-forearm">
                  <path
                    d="M 284.5 440 A 18.5 18.5 0 0 0 247.5 440 L 247.5 540 Q 247.5 552 260 552 L 272 552 Q 284.5 552 284.5 540 Z"
                    fill="#A56C38"
                  />
                  <path
                    d="M 284.5 526 L 247.5 526 L 247.5 540 Q 247.5 552 260 552 L 272 552 Q 284.5 552 284.5 540 Z"
                    fill="#8A5A2E"
                  />
                  <g id="right-hand">
                    <ellipse cx="266" cy="576" rx="19" ry="24" fill="#FCDDB9" />
                    <ellipse cx="246" cy="568" rx="7" ry="13" fill="#FCDDB9" transform="rotate(15 246 568)" />
                    <path
                      d="M258 592 L258 600 M266 594 L266 602 M274 592 L274 600"
                      stroke="#F2C79B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                </g>
              </g>

              {/* ---------------- HEAD (neck → skull → face chain) ---------------- */}
              <g id="head">
                <g id="ears">
                  <circle cx="134" cy="206" r="17" fill="#FCDDB9" />
                  <circle cx="266" cy="206" r="17" fill="#FCDDB9" />
                  <circle cx="135" cy="207" r="8" fill="#F2C79B" />
                  <circle cx="265" cy="207" r="8" fill="#F2C79B" />
                </g>
                <g id="face">
                  <path
                    d="M136 112 L264 112 L264 200 C264 246 240 282 200 282 C160 282 136 246 136 200 Z"
                    style={{ fill: "rgb(252, 221, 185)" }}
                  />
                  <path
                    d="M136 112 L158 112 C150 150 150 230 172 274 C150 264 136 240 136 200 Z"
                    fill="#F2C79B"
                  />
                  <path
                    style={{
                      stroke: "rgb(0, 0, 0)",
                      paintOrder: "stroke markers",
                      fillRule: "nonzero",
                      strokeWidth: "0px",
                      fill: "rgba(242, 199, 155, 0.68)",
                    }}
                    d="M 225.909 279.344 C 225.909 279.344 217.146 301.438 174.052 294.7 L 174.028 276.248 C 174.028 276.248 199.453 289.403 225.713 276.272 L 225.909 279.344 Z"
                  />
                </g>
                <g id="hair">
                  <g transform="translate(-56.5 278.5)">
                    <path
                      id="hair-shape"
                      fill="#2A2430"
                      stroke="#2A2430"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      d="M 179.286 -100.77 L 173.6 -116.9 L 177.279 -124.38 L 172.262 -134.67 L 166.243 -118.83 L 168.584 -149.12 L 161.896 -161.07 L 177.613 -173.02 C 177.613 -173.02 151.863 -167.88 151.529 -156.48 C 151.529 -156.48 153.2 -172.32 174.268 -179.27 L 187.98 -191.49 L 205.036 -203.17 L 225.769 -210.39 L 262.221 -212.89 C 262.221 -212.89 270.916 -212.89 276.266 -208.45 C 281.617 -204 277.604 -213.73 277.604 -213.73 C 277.604 -213.73 291.316 -215.4 293.991 -205.67 L 307.033 -202.9 L 329.439 -190.39 C 329.439 -190.39 345.825 -173.15 341.143 -157.32 L 338.802 -162.88 C 338.802 -162.88 324.757 -159.82 344.822 -148.99 L 338.802 -133.97 L 333.117 -116.46 L 326.095 -102.3 L 322.081 -93.407 L 319.406 -90.35 L 315.727 -97.858 L 317.399 -108.98 L 310.378 -116.19 L 304.357 -127.87 L 292.653 -135.36 L 269.911 -135.92 L 242.155 -137.31 L 229.782 -132.58 L 213.395 -125.08 C 213.395 -125.08 204.032 -121.74 203.697 -121.47 C 203.363 -121.19 194.333 -109.8 194.333 -109.8 C 194.333 -109.8 193.999 -102.85 193.999 -102.57 C 193.999 -102.3 193.664 -86.459 193.664 -86.459 L 187.646 -86.459 L 179.286 -100.77 Z"
                    />
                    <g clipPath="url(#hair-clip)">
                      <path d="M150 -216 L232 -216 C214 -190 206 -160 200 -86 L150 -86 Z" fill="#1B1720" />
                      <ellipse
                        cx="282"
                        cy="-196"
                        rx="42"
                        ry="11"
                        fill="#3F3745"
                        transform="rotate(-18 282 -196)"
                      />
                    </g>
                  </g>
                </g>
                {/* eyes with pupils as CHILDREN — pupils inherit every head,
                    torso and root transform and can never drift off the face */}
                <g id="left-eye" style={{ transformBox: "fill-box", transformOrigin: "6.5px 10px" }}>
                  <ellipse cx="170" cy="204" rx="6.5" ry="10" fill="#5A3A2E" />
                  <g id="left-pupil">
                    <circle cx="170.144" cy="204.572" r="3.5" fill="#111111" />
                    <circle cx="171.644" cy="202.072" r="1.5" fill="#FFFFFF" opacity="0.85" />
                  </g>
                </g>
                <g id="right-eye" style={{ transformBox: "fill-box", transformOrigin: "6.5px 10px" }}>
                  <ellipse cx="230" cy="204" rx="6.5" ry="10" fill="#5A3A2E" />
                  <g id="right-pupil">
                    <circle cx="230.158" cy="204.758" r="3.5" fill="#111111" />
                    <circle cx="231.658" cy="202.258" r="1.5" fill="#FFFFFF" opacity="0.85" />
                  </g>
                </g>
                <g id="mouth">
                  <path
                    d="M178 254 Q200 266 222 254"
                    stroke="#D29A73"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

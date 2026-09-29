/**
 * CHARACTER SVG — a lightweight vector guide inspired by Chinmai's portrait
 * (dark curly hair, warm skin tone, rust plaid shirt with navy collar).
 *
 * Built entirely from SVG primitives organized into independently transformable
 * nested groups (spec §6–7). The controller drives these groups via transform
 * attributes with ABSOLUTE pivot coordinates — no bbox drift, no redraws,
 * ~40 elements total.
 *
 * Group contract (ids the controller binds to):
 *   char-root, char-shadow, cj-bob, cj-torso, cj-head, cj-eyes,
 *   cj-armL (pivot 76,125)  > cj-armLelbow (76,172)
 *   cj-armR (pivot 124,125) > cj-armRelbow (124,172)
 *   cj-legL (pivot 88,189)  > cj-legLknee (88,246)
 *   cj-legR (pivot 112,189) > cj-legRknee (112,246)
 */

export function CharacterSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="50 25 100 300"
      className={className}
      role="img"
      aria-label="Illustrated guide character of Chinmai"
      // wide-safe: geometry spans x 66..134, y 33..321
    >
      <defs>
        <clipPath id="torsoClip">
          <rect x="68" y="112" width="64" height="88" rx="22" />
        </clipPath>
      </defs>

      <g id="char-root">
        {/* ground shadow — scales with jumps/breathing */}
        <ellipse
          id="char-shadow"
          cx="100"
          cy="315"
          rx="42"
          ry="6"
          fill="rgba(27,21,17,0.16)"
        />

        <g id="cj-bob">
          {/* ---------------- LEGS (behind torso) ---------------- */}
          <g id="cj-legL">
            <rect x="80.5" y="188" width="15" height="59" rx="7" fill="#2B2119" />
            <g id="cj-legLknee">
              <rect x="81.5" y="245" width="13" height="53" rx="6.5" fill="#2B2119" />
              <rect x="75" y="295" width="26" height="13" rx="6.5" fill="#3B2C21" />
              <rect x="75" y="303" width="26" height="5" rx="2.5" fill="#241A12" />
            </g>
          </g>
          <g id="cj-legR">
            <rect x="104.5" y="188" width="15" height="59" rx="7" fill="#2B2119" />
            <g id="cj-legRknee">
              <rect x="105.5" y="245" width="13" height="53" rx="6.5" fill="#2B2119" />
              <rect x="99" y="295" width="26" height="13" rx="6.5" fill="#3B2C21" />
              <rect x="99" y="303" width="26" height="5" rx="2.5" fill="#241A12" />
            </g>
          </g>

          {/* ---------------- TORSO ---------------- */}
          <g id="cj-torso">
            <rect x="68" y="112" width="64" height="88" rx="22" fill="#B4552D" />
            {/* plaid weave, clipped to torso */}
            <g clipPath="url(#torsoClip)" opacity="0.55">
              <g stroke="#8A3A1E" strokeWidth="1.3">
                <line x1="79" y1="112" x2="79" y2="200" />
                <line x1="90" y1="112" x2="90" y2="200" />
                <line x1="101" y1="112" x2="101" y2="200" />
                <line x1="112" y1="112" x2="112" y2="200" />
                <line x1="121" y1="112" x2="121" y2="200" />
                <line x1="68" y1="127" x2="132" y2="127" />
                <line x1="68" y1="143" x2="132" y2="143" />
                <line x1="68" y1="159" x2="132" y2="159" />
                <line x1="68" y1="175" x2="132" y2="175" />
                <line x1="68" y1="191" x2="132" y2="191" />
              </g>
            </g>
            {/* placket + buttons */}
            <line x1="100" y1="128" x2="100" y2="198" stroke="#8A3A1E" strokeWidth="2" opacity="0.75" />
            <circle cx="100" cy="141" r="1.7" fill="#6E2D14" />
            <circle cx="100" cy="161" r="1.7" fill="#6E2D14" />
            <circle cx="100" cy="181" r="1.7" fill="#6E2D14" />
            {/* hem shade */}
            <rect x="68" y="191" width="64" height="9" fill="rgba(0,0,0,0.08)" clipPath="url(#torsoClip)" />

            {/* ---------------- LEFT ARM ---------------- */}
            <g id="cj-armL">
              <rect x="69.5" y="124" width="13" height="48" rx="6.5" fill="#A34A26" />
              <g id="cj-armLelbow">
                <rect x="70.5" y="170" width="11" height="40" rx="5.5" fill="#C68B59" />
                <circle cx="76" cy="217" r="7" fill="#C68B59" />
              </g>
            </g>

            {/* ---------------- RIGHT ARM ---------------- */}
            <g id="cj-armR">
              <rect x="117.5" y="124" width="13" height="48" rx="6.5" fill="#A34A26" />
              <g id="cj-armRelbow">
                <rect x="118.5" y="170" width="11" height="40" rx="5.5" fill="#C68B59" />
                <circle cx="124" cy="217" r="7" fill="#C68B59" />
              </g>
            </g>

            {/* ---------------- HEAD (neck included) ---------------- */}
            <g id="cj-head">
              {/* neck */}
              <rect x="93" y="98" width="14" height="22" fill="#C68B59" />
              <rect x="93" y="98" width="14" height="7" fill="rgba(0,0,0,0.14)" />
              {/* ears */}
              <circle cx="70" cy="74" r="5.5" fill="#C68B59" />
              <circle cx="130" cy="74" r="5.5" fill="#C68B59" />
              <circle cx="70" cy="74" r="2.2" fill="#A96F45" />
              <circle cx="130" cy="74" r="2.2" fill="#A96F45" />
              {/* face */}
              <rect x="72" y="40" width="56" height="62" rx="27" fill="#C68B59" />
              {/* curly hair — base mass + curls + sideburns */}
              <ellipse cx="100" cy="45" rx="31" ry="16" fill="#191310" />
              <circle cx="80" cy="39" r="10" fill="#191310" />
              <circle cx="95" cy="33" r="11.5" fill="#191310" />
              <circle cx="111" cy="34" r="11.5" fill="#191310" />
              <circle cx="123" cy="43" r="9" fill="#191310" />
              <circle cx="75" cy="47" r="8" fill="#191310" />
              <circle cx="126" cy="52" r="7" fill="#191310" />
              <path d="M70,66 C69,76 70,84 73,90 L77,86 C74,80 73,73 74,66 Z" fill="#191310" />
              <path d="M130,66 C131,76 130,84 127,90 L123,86 C126,80 127,73 126,66 Z" fill="#191310" />
              {/* brows */}
              <rect x="83.5" y="65" width="12" height="3" rx="1.5" fill="#191310" />
              <rect x="104.5" y="65" width="12" height="3" rx="1.5" fill="#191310" />
              {/* eyes (blink + look) */}
              <g id="cj-eyes">
                <circle cx="89.5" cy="75" r="3.4" fill="#1B1511" />
                <circle cx="110.5" cy="75" r="3.4" fill="#1B1511" />
                <circle cx="90.7" cy="73.8" r="1.1" fill="#F2EDE3" opacity="0.9" />
                <circle cx="111.7" cy="73.8" r="1.1" fill="#F2EDE3" opacity="0.9" />
              </g>
              {/* nose */}
              <path d="M100,78 L100,86" stroke="#A96F45" strokeWidth="2" strokeLinecap="round" />
              <path d="M96,88 Q100,90.5 104,88" stroke="#A96F45" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              {/* mustache hint + mouth */}
              <path d="M93,91.5 Q100,94.5 107,91.5" stroke="rgba(25,19,16,0.45)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M93.5,96 Q100,100.5 106.5,96" stroke="#7A4630" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

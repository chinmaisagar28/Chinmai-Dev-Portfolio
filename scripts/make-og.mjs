// Generate 1200x630 Open Graph image: dark editorial card with portrait + name
import sharp from "sharp";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#161009"/>
      <stop offset="1" stop-color="#241a12"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1060" cy="80" r="200" fill="#d9482b" opacity="0.08"/>
  <circle cx="120" cy="580" r="160" fill="#f2ede3" opacity="0.04"/>

  <text x="80" y="140" font-family="DejaVu Serif, Georgia, serif" font-size="30" fill="#d9482b" letter-spacing="6">PORTFOLIO — 2026</text>
  <text x="76" y="290" font-family="DejaVu Serif, Georgia, serif" font-size="110" font-weight="bold" fill="#f2ede3">Chinmai</text>
  <text x="76" y="400" font-family="DejaVu Serif, Georgia, serif" font-size="110" font-style="italic" fill="#cfc5b4">Sagar A.V</text>
  <text x="80" y="480" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" fill="#97897a">Zoho Developer — CRM · Creator · Deluge · APIs</text>
  <text x="80" y="530" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#97897a">React · JavaScript · Python · Chennai, India</text>
  <rect x="80" y="560" width="120" height="4" fill="#d9482b"/>
</svg>`;

// portrait circle-cropped on the right
const portrait = await sharp("/home/z/my-project/public/images/chinmai-portrait.webp")
  .resize(460, 575, { fit: "cover", position: "top" })
  .toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 22, g: 16, b: 9, alpha: 1 } },
})
  .composite([
    { input: Buffer.from(svg), top: 0, left: 0 },
    {
      input: portrait,
      top: 27,
      left: 700,
    },
  ])
  .png({ quality: 90 })
  .toFile("/home/z/my-project/public/images/og-card.png");

console.log("OG image created ✓");

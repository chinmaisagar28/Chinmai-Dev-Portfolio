// Asset preparation: photo optimization, logo registry fetch
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = "/home/z/my-project";
const UP = path.join(ROOT, "upload");
const PUB = path.join(ROOT, "public");
const IMG = path.join(PUB, "images");
const LOGOS = path.join(PUB, "logos");

fs.mkdirSync(IMG, { recursive: true });
fs.mkdirSync(LOGOS, { recursive: true });
fs.mkdirSync(path.join(PUB, "resume"), { recursive: true });

// ---------- 1. PHOTO: convert passport photo to optimized WebP + AVIF ----------
const photoSrc = path.join(UP, "Chinmai Passport Photo.png");
const photoMeta = await sharp(photoSrc).metadata();
console.log("Photo original:", photoMeta.width, "x", photoMeta.height);

// Square-ish crop centered on face (passport photo already centered), generous headroom
await sharp(photoSrc)
  .resize(640, 800, { fit: "cover", position: "top" })
  .webp({ quality: 88 })
  .toFile(path.join(IMG, "chinmai-portrait.webp"));

await sharp(photoSrc)
  .resize(320, 400, { fit: "cover", position: "top" })
  .webp({ quality: 85 })
  .toFile(path.join(IMG, "chinmai-portrait-sm.webp"));

// OG image version
await sharp(photoSrc)
  .resize(640, 800, { fit: "cover", position: "top" })
  .jpeg({ quality: 82 })
  .toFile(path.join(IMG, "chinmai-portrait.jpg"));

console.log("Photo optimized ✓");

// ---------- 2. RESUME: convert V2 DOCX (most complete) to PDF ----------
try {
  execSync(
    `cd /tmp && soffice --headless --convert-to pdf --outdir ${path.join(PUB, "resume")} "${path.join(UP, "chinmai_resume-Zoho Developer V2.docx")}"`,
    { timeout: 120000 }
  );
  // rename to clean filename
  const generated = path.join(PUB, "resume", "chinmai_resume-Zoho Developer V2.pdf");
  const target = path.join(PUB, "resume", "Chinmai-Sagar-Resume.pdf");
  if (fs.existsSync(generated)) {
    fs.renameSync(generated, target);
    console.log("Resume PDF ✓", fs.statSync(target).size, "bytes");
  }
} catch (e) {
  console.error("Resume conversion failed:", e.message);
}

// ---------- 3. LOGOS: fetch simple-icons (official brand geometry) ----------
const icons = {
  react: "react",
  python: "python",
  javascript: "javascript",
  html5: "html5",
  css: "css",
  nodedotjs: "nodedotjs",
  express: "express",
  mongodb: "mongodb",
  mysql: "mysql",
  firebase: "firebase",
  tailwindcss: "tailwindcss",
  redux: "redux",
  git: "git",
  github: "github",
  opencv: "opencv",
  flask: "flask",
  zoho: "zoho",
  claude: "claude",
  cursor: "cursor",
  visualstudiocode: "visualstudiocode",
  bootstrap: "bootstrap",
  vercel: "vercel",
};

const failed = [];
for (const [name, slug] of Object.entries(icons)) {
  try {
    const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`);
    if (!res.ok) throw new Error(res.status.toString());
    let svg = await res.text();
    // simple-icons are single-path black glyphs; we inject currentColor for theming
    svg = svg.replace(/<path /, '<path fill="currentColor" ');
    fs.writeFileSync(path.join(LOGOS, `${name}.svg`), svg);
  } catch (e) {
    failed.push(name);
  }
}
console.log("Logos fetched ✓, failed:", failed.length ? failed : "none");

// ---------- 4. FAVICON: monogram "CS" mark ----------
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#161210"/>
  <text x="32" y="43" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="600" fill="#F5EFE6" text-anchor="middle">CS</text>
  <circle cx="52" cy="14" r="5" fill="#D9482B"/>
</svg>`;
fs.writeFileSync(path.join(PUB, "favicon.svg"), favicon);
console.log("Favicon ✓");
console.log("ALL ASSETS DONE");

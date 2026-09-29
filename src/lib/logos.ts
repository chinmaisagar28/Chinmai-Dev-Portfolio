/**
 * CENTRALIZED LOGO REGISTRY.
 * Every technology icon resolves through here — swap the SVG file in
 * /public/logos/ without touching a single component.
 *
 * Zoho product marks are custom letter-tiles (official per-product SVGs are not
 * freely redistributable); the base Zoho glyph is simple-icons geometry.
 */

export type LogoKey =
  | "react" | "python" | "javascript" | "html5" | "css"
  | "nodedotjs" | "express" | "mongodb" | "mysql" | "firebase"
  | "tailwindcss" | "redux" | "git" | "github" | "opencv" | "flask"
  | "zoho" | "claude" | "cursor" | "visualstudiocode" | "bootstrap"
  | "deluge" | "zoho-crm" | "zoho-creator" | "zoho-books";

export const technologyLogos: Record<LogoKey, string> = {
  react: "/logos/react.svg",
  python: "/logos/python.svg",
  javascript: "/logos/javascript.svg",
  html5: "/logos/html5.svg",
  css: "/logos/css.svg",
  nodedotjs: "/logos/nodedotjs.svg",
  express: "/logos/express.svg",
  mongodb: "/logos/mongodb.svg",
  mysql: "/logos/mysql.svg",
  firebase: "/logos/firebase.svg",
  tailwindcss: "/logos/tailwindcss.svg",
  redux: "/logos/redux.svg",
  git: "/logos/git.svg",
  github: "/logos/github.svg",
  opencv: "/logos/opencv.svg",
  flask: "/logos/flask.svg",
  zoho: "/logos/zoho.svg",
  claude: "/logos/claude.svg",
  cursor: "/logos/cursor.svg",
  visualstudiocode: "/logos/visualstudiocode.svg",
  bootstrap: "/logos/bootstrap.svg",
  deluge: "/logos/deluge.svg",
  "zoho-crm": "/logos/zoho-crm.svg",
  "zoho-creator": "/logos/zoho-creator.svg",
  "zoho-books": "/logos/zoho-books.svg",
};

export function logoUrl(key?: string | null): string | null {
  if (!key) return null;
  return technologyLogos[key as LogoKey] ?? null;
}

/**
 * TECHNOLOGIES — strictly from the resumes' Technical Skills sections.
 * Logo registry: every icon resolves through /public/logos — replace the file,
 * not the component (see src/lib/logos.ts).
 */

export interface TechGroup {
  id: string;
  title: string;
  caption: string;
  items: { name: string; logo?: string }[];
}

export const techGroups: TechGroup[] = [
  {
    id: "languages",
    title: "Languages & Core",
    caption: "What everything is written in",
    items: [
      { name: "Python", logo: "python" },
      { name: "JavaScript (ES6+)", logo: "javascript" },
      { name: "HTML5", logo: "html5" },
      { name: "CSS3", logo: "css" },
      { name: "Deluge", logo: "deluge" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & React",
    caption: "Interfaces that behave",
    items: [
      { name: "React.js", logo: "react" },
      { name: "Redux", logo: "redux" },
      { name: "Context API", logo: "react" },
      { name: "React Hooks", logo: "react" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "Responsive Design" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Databases",
    caption: "Where data lands",
    items: [
      { name: "Node.js", logo: "nodedotjs" },
      { name: "Express.js", logo: "express" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "MySQL", logo: "mysql" },
      { name: "SQL", logo: "mysql" },
      { name: "Firebase", logo: "firebase" },
      { name: "RESTful APIs" },
    ],
  },
  {
    id: "ai-tools",
    title: "AI, Agentic & Dev Tools",
    caption: "The modern toolkit",
    items: [
      { name: "Claude Code", logo: "claude" },
      { name: "Cursor / AI IDEs", logo: "cursor" },
      { name: "VS Code", logo: "visualstudiocode" },
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
    ],
  },
];

export interface ConstellationNode {
  id: string;
  name: string;
  logo?: string;
  x: number; // viewBox units (0..520)
  y: number; // viewBox units (0..420)
  primary?: boolean;
}

export const constellationNodes: ConstellationNode[] = [
  { id: "react", name: "React", logo: "react", x: 258, y: 96, primary: true },
  { id: "js", name: "JavaScript", logo: "javascript", x: 132, y: 168, primary: true },
  { id: "python", name: "Python", logo: "python", x: 388, y: 158, primary: true },
  { id: "node", name: "Node.js", logo: "nodedotjs", x: 226, y: 268, primary: true },
  { id: "deluge", name: "Deluge", logo: "deluge", x: 414, y: 292, primary: true },
  { id: "mongodb", name: "MongoDB", logo: "mongodb", x: 120, y: 330, primary: true },
  { id: "express", name: "Express", logo: "express", x: 318, y: 218 },
  { id: "rest", name: "REST APIs", x: 336, y: 366 },
  { id: "tailwind", name: "Tailwind", logo: "tailwindcss", x: 74, y: 96 },
  { id: "redux", name: "Redux", logo: "redux", x: 172, y: 52 },
  { id: "firebase", name: "Firebase", logo: "firebase", x: 62, y: 236 },
  { id: "git", name: "Git", logo: "git", x: 458, y: 84 },
];

/** Edges between constellation nodes (by id) */
export const constellationEdges: [string, string][] = [
  ["react", "js"],
  ["react", "redux"],
  ["react", "tailwind"],
  ["react", "express"],
  ["express", "node"],
  ["node", "mongodb"],
  ["node", "rest"],
  ["python", "rest"],
  ["python", "git"],
  ["python", "deluge"],
  ["js", "firebase"],
  ["node", "deluge"],
];

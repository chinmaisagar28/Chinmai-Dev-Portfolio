/**
 * PROJECTS — data-driven system. Adding a project = adding one object.
 * All content from the resumes; live URLs are the real embedded links from the resume files.
 * Both products are deployed on Zoho Catalyst serverless (visible from their URLs).
 */

export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  year?: string;
  role: string;
  technologies: string[];
  image: string;
  imageSmall: string;
  imageAlt: string;
  gallery?: { src: string; alt: string }[];
  github?: string;
  liveDemo?: string;
  accent: string;
  featured?: boolean;
  caseStudy: {
    overview: string;
    problem: string;
    approach: string;
    implementation: string[];
    result: string;
  };
}

export const projects: Project[] = [
  {
    id: "ai-dress-advisor",
    index: "01",
    title: "AI Dress Advisor",
    tagline: "Outfit recommendations, computed from a photograph",
    description:
      "A web application that analyses a user-uploaded photo with OpenCV — facial detection and skin-tone analysis — and returns personalized outfit recommendations through a Flask backend.",
    category: "AI / Computer Vision",
    role: "Frontend · Flask backend · CV pipeline",
    technologies: ["JavaScript", "HTML5", "CSS3", "Python", "Flask", "OpenCV"],
    image: "/images/project-ai-dress-advisor.webp",
    imageSmall: "/images/project-ai-dress-advisor-sm.webp",
    imageAlt: "AI Dress Advisor web application — upload interface for outfit recommendations",
    liveDemo:
      "https://ai-dress-advisor-60029485510.development.catalystserverless.in/app/index.html",
    accent: "#E85D3D",
    featured: true,
    caseStudy: {
      overview:
        "AI Dress Advisor is a responsive web application that gives personalized outfit recommendations based on images the user uploads. The browser side keeps the experience simple — pick a preference, drop a photo, preview the result — while a Python/Flask service does the heavy lifting: real-time facial detection and skin-tone analysis with OpenCV, then recommendation logic on top of those signals.",
      problem:
        "Outfit advice is usually generic. The team wanted recommendations driven by the user's own photo — their features and skin tone — instead of static rule lists, and it had to feel instant even though every upload runs through an image-processing pipeline.",
      approach:
        "Computer vision first, interface second. OpenCV handles facial detection and skin-tone extraction from the uploaded image; Flask orchestrates processing and data management behind a small, clean API; the frontend (JavaScript, HTML, CSS) focuses on a friendly, low-friction flow with clear preview states.",
      implementation: [
        "Developed a responsive web application in JavaScript providing personalized outfit recommendations from user-uploaded images.",
        "Implemented real-time facial detection and skin-tone analysis with OpenCV, improving the accuracy of recommendations.",
        "Integrated a Flask backend that streamlined image processing and data management, improving overall application efficiency by 25% through better response times.",
        "Engineered an asynchronous image-processing pipeline handling 200 requests per minute, reducing server response latency by 2.3 seconds and making new AI modules easy to plug in.",
        "Collaborated with peers to design and test the application, folding feedback back into functionality and user experience.",
      ],
      result:
        "Shipped live on Zoho Catalyst serverless. The async pipeline sustains roughly 200 requests per minute with a 2.3-second latency reduction, and the backend achieved a 25% overall application-efficiency improvement.",
    },
  },
  {
    id: "netbook",
    index: "02",
    title: "Net-Book",
    tagline: "A community website built for clarity and speed",
    description:
      "A responsive static community website designed around modern UI/UX principles — advanced CSS layout techniques, intuitive navigation and cross-browser performance optimization.",
    category: "Web / Frontend",
    role: "Design · Frontend",
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    image: "/images/project-netbook.webp",
    imageSmall: "/images/project-netbook-sm.webp",
    imageAlt: "Net-Book community website landing page",
    liveDemo:
      "https://netbook-60029485510.development.catalystserverless.in/app/index.html",
    accent: "#3E7BFA",
    caseStudy: {
      overview:
        "Net-Book is a static community website covering Home, Community, Blog and Events — designed and built from scratch with HTML5, CSS3, JavaScript and Bootstrap. It is a study in doing a lot with a little: no framework runtime, just well-structured markup and deliberate CSS.",
      problem:
        "A community hub needs to load fast on any device and any browser, communicate its purpose instantly, and stay visually consistent — without the maintenance weight of a full SPA.",
      approach:
        "Static-first. Semantic HTML5 for structure, advanced CSS techniques — flexbox and grid — for layout, Bootstrap where it genuinely accelerates delivery, and a performance-optimization mindset applied to every asset.",
      implementation: [
        "Designed and developed a responsive, static community website using HTML5 and CSS3.",
        "Focused on modern UI/UX principles, advanced CSS techniques like flexbox and grid, and performance optimization.",
        "Created intuitive navigation and engaging layouts, ensuring brand consistency and a polished user experience.",
        "Verified cross-browser behaviour as part of the optimization pass.",
      ],
      result:
        "Live on Zoho Catalyst serverless — a fast, brand-consistent community site that holds up across devices and browsers.",
    },
  },
];

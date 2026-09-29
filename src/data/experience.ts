/**
 * EXPERIENCE & EDUCATION — from both resumes (deduplicated, V2 preferred).
 */

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  kind: string;
  points: string[];
  tools: string[];
}

export const experience: ExperienceItem[] = [
  {
    company: "Elite Tech Corp",
    role: "Zoho Developer Intern",
    period: "Feb 2025 — Mar 2026",
    kind: "Internship · Zoho Ecosystem",
    points: [
      "Customized and implemented scalable Zoho CRM and Zoho Creator applications, using Zoho Deluge Script to automate workflows and integrating Zoho APIs to enhance system interoperability and business efficiency.",
      "Developed custom functions and automated workflows using Deluge across Zoho CRM and Creator — reducing manual effort and accelerating business processes.",
      "Integrated Zoho APIs with external systems to enable real-time data synchronization and extend CRM functionality.",
      "Integrated Zoho Books with Zoho CRM to automate invoicing, purchase returns and sales returns — streamlining financial data workflows.",
      "Designed ERP-style modules in Zoho Creator for inventory management and order tracking, giving teams real-time visibility into stock levels and order status.",
      "Provided technical support and troubleshooting for Zoho applications, resolving workflow issues and keeping systems running without interruption.",
      "Collaborated with stakeholders on requirement gathering, translating complex business needs into tailored CRM configurations.",
    ],
    tools: ["Zoho CRM", "Zoho Creator", "Deluge", "Zoho API", "Zoho Books", "ERP Modules"],
  },
  {
    company: "Shiash Info Solutions Private Limited",
    role: "Machine Learning Intern",
    period: "May 2024 — Jul 2024",
    kind: "Internship · Machine Learning",
    points: [
      "Enhanced model accuracy by 20% through optimizing the CNN architecture for Next Word Prediction tasks.",
      "Reduced model training time by 30% by implementing efficient preprocessing techniques.",
      "Collaborated with the team to smoothly implement machine learning models on real-world datasets such as movie scripts.",
    ],
    tools: ["Python", "CNN", "Data Preprocessing"],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  board?: string;
  period: string;
  score: string;
  detail?: string;
}

export const education: EducationItem[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "DRBCCC Hindu College",
    board: "University of Madras",
    period: "May 2024",
    score: "80.8%",
  },
  {
    degree: "Higher Secondary Education",
    institution: "Sri Venkateshwara Met. Hr. Sec. School",
    board: "Commerce with Computer Applications",
    period: "April 2021",
    score: "81%",
  },
];

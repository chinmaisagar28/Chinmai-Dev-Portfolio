/**
 * ZOHO ECOSYSTEM — only products/capabilities supported by the resumes:
 * Zoho CRM, Zoho Creator, Zoho Deluge Script, Zoho API, Zoho Books,
 * automated workflows / custom functions, ERP-style development.
 */

export interface ZohoNode {
  id: string;
  name: string;
  short: string;
  kind: "product" | "core" | "practice";
  color: string;
  /** position in % of the diagram box (left, top) */
  x: number;
  y: number;
  detail: string;
  evidence: string;
}

export const zohoNodes: ZohoNode[] = [
  {
    id: "crm",
    name: "Zoho CRM",
    short: "CRM",
    kind: "product",
    color: "#3E9B6E",
    x: 22,
    y: 24,
    detail: "Enterprise CRM customization",
    evidence:
      "Customized and implemented scalable Zoho CRM applications, tailored to business workflows; provided ongoing support and troubleshooting.",
  },
  {
    id: "creator",
    name: "Zoho Creator",
    short: "Creator",
    kind: "product",
    color: "#8A63D2",
    x: 78,
    y: 24,
    detail: "Low-code app building + ERP modules",
    evidence:
      "Designed ERP-style modules in Zoho Creator for inventory management and order tracking — real-time visibility into stock levels and order status.",
  },
  {
    id: "deluge",
    name: "Deluge Script",
    short: "Deluge",
    kind: "core",
    color: "#D9482B",
    x: 50,
    y: 52,
    detail: "The scripting thread through everything",
    evidence:
      "Developed custom functions and automated workflows in Deluge across CRM and Creator — reducing manual effort and accelerating business processes.",
  },
  {
    id: "books",
    name: "Zoho Books",
    short: "Books",
    kind: "product",
    color: "#2E8B8B",
    x: 16,
    y: 78,
    detail: "Finance, wired into the CRM",
    evidence:
      "Integrated Zoho Books with Zoho CRM to automate invoicing, purchase returns and sales returns — one continuous financial workflow.",
  },
  {
    id: "api",
    name: "Zoho API",
    short: "API",
    kind: "core",
    color: "#C77B3B",
    x: 84,
    y: 78,
    detail: "System-to-system interoperability",
    evidence:
      "Integrated Zoho APIs with external systems for real-time data synchronization, extending CRM functionality beyond the box.",
  },
  {
    id: "workflows",
    name: "Workflows & Functions",
    short: "Flows",
    kind: "practice",
    color: "#B4552D",
    x: 50,
    y: 88,
    detail: "Automation as the default",
    evidence:
      "Automated workflows and custom functions that remove repetitive steps and accelerate day-to-day business processes.",
  },
];

export const zohoEdges: [string, string][] = [
  ["deluge", "crm"],
  ["deluge", "creator"],
  ["deluge", "workflows"],
  ["crm", "books"],
  ["crm", "api"],
  ["creator", "api"],
  ["books", "workflows"],
];

export const zohoIntro =
  "Over a year of hands-on work inside one ecosystem — configuring it, scripting it, and wiring it to the outside world.";

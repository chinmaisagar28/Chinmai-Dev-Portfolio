/**
 * PROFILE — single source of truth.
 * Extracted from both resumes (chinmai_resume.pdf + chinmai_resume-Zoho Developer V2.docx).
 * Where the two differ, the newer "Zoho Developer V2" version is preferred.
 * Nothing here is invented.
 */

export const profile = {
  name: "Chinmai Sagar A.V",
  shortName: "Chinmai Sagar",
  firstName: "Chinmai",
  monogram: "CS",

  // Positioning derived from resume summary + experience
  role: "Zoho Developer",
  headline: "Developer in the Zoho ecosystem — building automated workflows, custom CRM solutions and clean API integrations.",
  subheadline:
    "Working across Zoho CRM, Creator and Deluge, with React, JavaScript and Python on the web side. Curious by default, precise by habit.",

  summary:
    "A developer with 1+ year of practical experience in the Zoho ecosystem, specializing in automated workflows, custom CRM solutions, and API integrations. Skilled in React, JavaScript, and Python, with a focus on building scalable SaaS features and responsive UI/UX. Passionate about problem-solving and eager to contribute to innovative software solutions.",

  email: "chinmai534@gmail.com",
  phone: "+91 90426 06010",
  location: "Avadi, Chennai — 62, India",
  timezone: "Asia/Kolkata",

  available: true, // open to opportunities

  stats: [
    { value: "1+", label: "year in the Zoho ecosystem" },
    { value: "2", label: "live products shipped" },
    { value: "6+", label: "Zoho products & tools in daily use" },
    { value: "200/min", label: "async requests handled in prod pipeline" },
  ],
} as const;

export const socials = {
  github: {
    label: "GitHub",
    handle: "@chinmaisagar28",
    url: "https://github.com/chinmaisagar28",
  },
  linkedin: {
    label: "LinkedIn",
    handle: "chinmai-sagar",
    url: "https://www.linkedin.com/in/chinmai-sagar-a576711ab/",
  },
  email: {
    label: "Email",
    handle: "chinmai534@gmail.com",
    url: "mailto:chinmai534@gmail.com",
  },
} as const;

export const resumePath = "/resume/Chinmai-Sagar-Resume.pdf";

export const navigation = [
  { id: "about", label: "About", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "zoho", label: "Zoho", index: "03" },
  { id: "stack", label: "Stack", index: "04" },
  { id: "projects", label: "Projects", index: "05" },
  { id: "resume", label: "Resume", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
] as const;

export type SectionId = (typeof navigation)[number]["id"] | "hero";

import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { profile, socials } from "@/data/profile";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE = `${profile.name} — ${profile.role}`;
const SITE_DESC =
  "Developer in the Zoho ecosystem: automated workflows, custom CRM solutions and API integrations — with React, JavaScript and Python on the web side.";

export const metadata: Metadata = {
  metadataBase: new URL("https://chinmaisagar.dev"), // canonical URL placeholder — update when domain is live
  title: {
    default: SITE_TITLE,
    template: `%s — ${profile.shortName}`,
  },
  description: SITE_DESC,
  keywords: [
    "Chinmai Sagar",
    "Zoho Developer",
    "Deluge",
    "Zoho CRM",
    "Zoho Creator",
    "React Developer",
    "Python",
    "API Integration",
    "Chennai",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: "/",
    siteName: `${profile.shortName} — Portfolio`,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/og-card.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/images/og-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2ede3",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.shortName,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressCountry: "IN",
  },
  sameAs: [socials.github.url, socials.linkedin.url],
  knowsAbout: [
    "Zoho CRM",
    "Zoho Creator",
    "Deluge Script",
    "React.js",
    "JavaScript",
    "Python",
    "Node.js",
    "REST APIs",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "DRBCCC Hindu College, University of Madras",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} grain antialiased bg-paper text-ink`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

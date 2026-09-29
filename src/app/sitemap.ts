import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://chinmaisagar.dev", // canonical URL placeholder — update when domain is live
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

import type { MetadataRoute } from "next";
import { areas, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => new URL(path, site.url).toString();

  const core: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/shutters"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/blinds"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/design-studio"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/gallery"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/commercial"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/reviews"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: url(`/areas/${a.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...core, ...areaPages];
}

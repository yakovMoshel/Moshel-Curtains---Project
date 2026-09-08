import type { MetadataRoute } from "next";

const BASE_URL = "https://moshelhavilonot.co.il";

// The */configure wizard routes are deliberately excluded — they're
// transactional UI, not distinct indexable content. They stay reachable via
// normal links; this just doesn't ask Google to prioritize crawling them.
const ROUTES = ["", "/curtains", "/blinds", "/upholstery", "/tablecloths", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}

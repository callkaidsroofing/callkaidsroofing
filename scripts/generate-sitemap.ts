// Runs before `vite dev` and `vite build`; writes public/sitemap.xml
// with all static public routes plus one entry per blog post slug.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { blogPosts } from "../src/data/blogPosts";

const BASE_URL = "https://callkaidsroofing.com.au";
const TODAY = new Date().toISOString().slice(0, 10);

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.9" },
  { path: "/services", changefreq: "weekly", priority: "0.95" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/emergency", changefreq: "monthly", priority: "0.9" },
  { path: "/warranty", changefreq: "monthly", priority: "0.7" },
  { path: "/book", changefreq: "monthly", priority: "0.85" },
  { path: "/booking", changefreq: "monthly", priority: "0.8" },
  { path: "/quote", changefreq: "monthly", priority: "0.9" },
  { path: "/thank-you", changefreq: "yearly", priority: "0.2" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },

  // Service pages
  { path: "/services/roof-restoration", changefreq: "monthly", priority: "0.95" },
  { path: "/services/roof-painting", changefreq: "monthly", priority: "0.95" },
  { path: "/services/roof-repairs", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-cleaning", changefreq: "monthly", priority: "0.9" },
  { path: "/services/gutter-cleaning", changefreq: "monthly", priority: "0.85" },
  { path: "/services/roof-repointing", changefreq: "monthly", priority: "0.85" },
  { path: "/services/valley-iron-replacement", changefreq: "monthly", priority: "0.85" },
  { path: "/services/tile-replacement", changefreq: "monthly", priority: "0.85" },
  { path: "/services/leak-detection", changefreq: "monthly", priority: "0.85" },

  // Suburb landing pages
  { path: "/services/roof-restoration-clyde-north", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-restoration-berwick", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-restoration-cranbourne", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-restoration-pakenham", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-restoration-mount-eliza", changefreq: "monthly", priority: "0.85" },
  { path: "/services/roof-painting-clyde-north", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-painting-cranbourne", changefreq: "monthly", priority: "0.9" },
  { path: "/services/roof-painting-pakenham", changefreq: "monthly", priority: "0.9" },
];

const blogEntries: Entry[] = blogPosts.map((p) => ({
  path: `/blog/${p.slug}`,
  lastmod: (p.publishDate || TODAY).slice(0, 10),
  changefreq: "monthly",
  priority: "0.7",
}));

const entries = [...staticEntries, ...blogEntries];

function render(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        `    <lastmod>${e.lastmod || TODAY}</lastmod>`,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

writeFileSync(resolve("public/sitemap.xml"), render(entries));
console.log(`sitemap.xml written (${entries.length} entries, ${blogEntries.length} blog posts)`);

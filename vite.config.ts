import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { buildPortfolioMeta, PORTFOLIO_BASE_PATH, type PortfolioPage } from "./src/lib/portfolioSeo";
import type { ArtistInfo, Project } from "./src/types/portfolio";

// Static per-route HTML shells. Crawlers (Googlebot, LinkedIn, Slack, etc.)
// that don't execute JS still see a real <title>, meta description, og tags,
// and a short H1 + hero paragraph for these routes. React hydrates client-side
// and takes over the DOM as normal.
interface Shell {
  route: string;                 // e.g. "oumuamua" (no leading slash)
  title: string;
  description: string;
  ogImage?: string;              // absolute https URL
  ogType?: string;               // defaults to "website"
  h1: string;
  bodyText: string;              // one paragraph of real, crawlable copy
  jsonLd?: Record<string, unknown>;
  links?: { href: string; text: string }[];   // crawlable list under the body text
  /** theSJMO pages: strip the MLP-specific head tags inherited from index.html */
  siteName?: string;
}

const SITE = "https://myliberalpony.co.uk";
const SHELLS: Shell[] = [
  {
    route: "",
    title: "OUMUAMUA - DEBUT SINGLE OUT NOW ON ALL STREAMING PLATFORMS",
    description:
      "Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.",
    h1: "MY LIBERAL PONY",
    bodyText:
      "Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: "MY LIBERAL PONY",
      url: SITE + "/",
    },
  },
  {
    route: "about",
    title: "OUMUAMUA - DEBUT SINGLE OUT NOW ON ALL STREAMING PLATFORMS - About",
    description:
      "Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.",
    h1: "About MY LIBERAL PONY",
    bodyText:
      "MY LIBERAL PONY is a multimedia, genre-bending artist creating experimental live music and social commentary from the perspective of a disabled member of the LGBT community in England.",
  },
  {
    route: "listen",
    title: "OUMUAMUA - DEBUT SINGLE OUT NOW ON ALL STREAMING PLATFORMS - Listen",
    description:
      "Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.",
    h1: "Listen",
    bodyText:
      "Full live videos on YouTube, the SoundCloud stream, and the Bandcamp catalogue — all in one place.",
  },
  {
    route: "oumuamua",
    title: "OUMUAMUA - DEBUT SINGLE OUT NOW ON ALL STREAMING PLATFORMS",
    description:
      "Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.",
    ogImage:
      "https://res.cloudinary.com/dpy87lbpt/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/mlp/oumuamua-cover.jpg",
    ogType: "music.song",
    h1: "OUMUAMUA",
    bodyText:
      "OUMUAMUA — the new single from MY LIBERAL PONY. Out now via Hot Earth Records. Listen on Spotify, Bandcamp, Apple Music, YouTube and SoundCloud.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: "OUMUAMUA",
      byArtist: { "@type": "MusicGroup", name: "MY LIBERAL PONY" },
      recordLabel: "Hot Earth Records",
      url: SITE + "/oumuamua",
    },
  },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function applyShell(indexHtml: string, shell: Shell): string {
  const url = SITE + "/" + shell.route;
  let html = indexHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(shell.title)}</title>`);
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/,
    `<meta name="description" content="${esc(shell.description)}">`,
  );
  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*\/?>/,
    `<meta property="og:title" content="${esc(shell.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*\/?>/,
    `<meta property="og:description" content="${esc(shell.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*\/?>/,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:type["'][^>]*\/?>/,
    `<meta property="og:type" content="${esc(shell.ogType || "website")}" />`,
  );
  if (shell.ogImage) {
    html = html.replace(
      /<meta\s+property=["']og:image["'][^>]*\/?>/,
      `<meta property="og:image" content="${esc(shell.ogImage)}" />`,
    );
  }
  if (shell.siteName) {
    // index.html carries MLP-only tags (keywords, music:musician, instagram,
    // MusicGroup JSON-LD). They must not leak onto theSJMO pages.
    html = html.replace(/<meta\s+name=["']keywords["'][^>]*>\s*/g, "");
    html = html.replace(/<meta\s+property=["']music:musician["'][^>]*\/?>\s*/g, "");
    html = html.replace(/<meta\s+property=["']instagram:account["'][^>]*\/?>\s*/g, "");
    html = html.replace(/<meta\s+property=["']og:image:(width|height)["'][^>]*\/?>\s*/g, "");
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
    html = html.replace(/<meta\s+name=["']author["'][^>]*>/, `<meta name="author" content="${esc(shell.siteName)}" />`);
    html = html.replace(/<meta\s+property=["']og:site_name["'][^>]*\/?>/, `<meta property="og:site_name" content="${esc(shell.siteName)}" />`);
    html = html.replace(/<meta\s+property=["']og:image:alt["'][^>]*\/?>/, `<meta property="og:image:alt" content="${esc(shell.title)}" />`);
    const tw = [
      ["twitter:card", "summary_large_image"],
      ["twitter:title", shell.title],
      ["twitter:description", shell.description],
      ...(shell.ogImage ? [["twitter:image", shell.ogImage]] : []),
    ]
      .map(([n, c]) => `<meta name="${n}" content="${esc(c)}" />`)
      .join("\n    ");
    html = html.replace(/<\/head>/, `    ${tw}\n</head>`);
  }

  // Per-route canonical (inject before </head>)
  const canonicalTag = `\n    <link rel="canonical" href="${esc(url)}" />\n`;
  html = html.replace(/<\/head>/, `${canonicalTag}</head>`);

  // Add per-route JSON-LD before </head>
  if (shell.jsonLd) {
    const ld = `<script type="application/ld+json">${JSON.stringify(shell.jsonLd)}</script>\n`;
    html = html.replace(/<\/head>/, `${ld}</head>`);
  }

  // Inject crawlable body content inside #root; React replaces it on mount.
  const paragraphs = shell.bodyText
    .split(/\n{2,}/)
    .map((t) => `<p>${esc(t)}</p>`)
    .join("");
  const list = shell.links?.length
    ? `<ul>${shell.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a></li>`).join("")}</ul>`
    : "";
  const shellBody = `<div id="prerender-shell"><h1>${esc(shell.h1)}</h1>${paragraphs}${list}</div>`;
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${shellBody}</div>`,
  );
  return html;
}

interface SjmoRow {
  projects?: Project[];
  artist_info?: Partial<ArtistInfo>;
  updated_at?: string;
}

// Portfolio content for the static shells. Order: live database, then the
// committed backup/ export, then nothing. Never throws: the build must not fail
// because Supabase is paused or unreachable. SJMO_CONFIG_FILE overrides the
// lookup (used to test from a machine that cannot reach Supabase).
async function loadSjmoRow(env: Record<string, string>): Promise<{ row: SjmoRow; source: string } | null> {
  const readJson = (file: string): SjmoRow | null => {
    try {
      const json = JSON.parse(fs.readFileSync(file, "utf8"));
      return (Array.isArray(json) ? json[0] : json) ?? null;
    } catch {
      return null;
    }
  };

  const override = process.env.SJMO_CONFIG_FILE;
  if (override) {
    const row = readJson(override);
    return row ? { row, source: `file ${override}` } : null;
  }

  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/sjmo_site_config?select=*&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows?.[0]) return { row: rows[0], source: "database" };
        console.warn("[mlp-static-shells] sjmo_site_config is empty");
      } else {
        console.warn(`[mlp-static-shells] database returned HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn(`[mlp-static-shells] database unreachable: ${(err as Error).message}`);
    }
  }

  const backup = readJson(path.resolve(__dirname, "backup/sjmo_site_config.json"));
  return backup ? { row: backup, source: "backup/sjmo_site_config.json" } : null;
}

const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function portfolioShells(row: SjmoRow): { shells: Shell[]; paths: string[] } | null {
  const info = row.artist_info as ArtistInfo | undefined;
  if (!info?.name) return null;
  const projects = (Array.isArray(row.projects) ? row.projects : []).filter((p) => {
    if (SAFE_SLUG.test(p?.slug ?? "")) return true;
    console.warn(`[mlp-static-shells] skipping project with unusable slug: ${JSON.stringify(p?.slug)}`);
    return false;
  });

  const pages: PortfolioPage[] = [
    { kind: "home" },
    { kind: "projects" },
    { kind: "about" },
    { kind: "contact" },
    ...projects.map((project): PortfolioPage => ({ kind: "project", project })),
  ];

  const shells = pages.map((page) => {
    const meta = buildPortfolioMeta(info, projects, page, SITE);
    return {
      route: meta.path.replace(/^\//, ""),
      title: meta.title,
      description: meta.description,
      ogImage: meta.image,
      ogType: meta.type,
      h1: meta.h1,
      bodyText: meta.bodyText,
      links: meta.links,
      jsonLd: meta.jsonLd,
      siteName: info.name,
    } satisfies Shell;
  });
  return { shells, paths: shells.map((x) => "/" + x.route) };
}

// The committed sitemap lists the MLP pages. Replace any theSJMO entries with
// the pages that actually got a static shell.
function rewriteSitemap(distDir: string, paths: string[], lastmod: string) {
  const file = path.join(distDir, "sitemap.xml");
  if (!fs.existsSync(file)) return;
  let xml = fs.readFileSync(file, "utf8");
  xml = xml.replace(/\s*<url>\s*<loc>[^<]*\/theSJMO[^<]*<\/loc>[\s\S]*?<\/url>/g, "");
  const entries = paths
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === PORTFOLIO_BASE_PATH ? "0.7" : "0.6"}</priority>\n  </url>`,
    )
    .join("\n");
  xml = xml.replace(/<\/urlset>/, `${entries}\n</urlset>`);
  fs.writeFileSync(file, xml, "utf8");
}

function prerenderPlugin(env: Record<string, string>) {
  return {
    name: "mlp-static-shells",
    apply: "build" as const,
    async closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const baseHtml = fs.readFileSync(indexPath, "utf8");

      const loaded = await loadSjmoRow(env);
      const portfolio = loaded ? portfolioShells(loaded.row) : null;
      if (portfolio) {
        console.log(`[mlp-static-shells] theSJMO content from ${loaded!.source}`);
      } else {
        console.warn("[mlp-static-shells] no theSJMO content available; skipping portfolio shells");
      }
      const allShells = [...SHELLS, ...(portfolio?.shells ?? [])];

      for (const shell of allShells) {
        const html = applyShell(baseHtml, shell);
        if (shell.route === "") {
          fs.writeFileSync(indexPath, html, "utf8");
        } else {
          const dir = path.join(distDir, shell.route);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
        }
      }

      if (portfolio) {
        rewriteSitemap(distDir, portfolio.paths, (loaded!.row.updated_at || new Date().toISOString()).slice(0, 10));

        // GitHub Pages paths are case-sensitive. Send /thesjmo to /theSJMO.
        // Skipped on case-insensitive filesystems, where it would overwrite
        // the real page.
        const lower = path.join(distDir, PORTFOLIO_BASE_PATH.slice(1).toLowerCase());
        if (!fs.existsSync(lower)) {
          fs.mkdirSync(lower, { recursive: true });
          fs.writeFileSync(
            path.join(lower, "index.html"),
            `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Redirecting</title>` +
              `<link rel="canonical" href="${SITE}${PORTFOLIO_BASE_PATH}" />` +
              `<meta http-equiv="refresh" content="0; url=${PORTFOLIO_BASE_PATH}" />` +
              `<script>location.replace(${JSON.stringify(PORTFOLIO_BASE_PATH)}+location.search+location.hash)</script>` +
              `</head><body><a href="${PORTFOLIO_BASE_PATH}">Continue</a></body></html>`,
            "utf8",
          );
        }
      }

      // SPA fallback for GitHub Pages: deep links to client-side routes
      // (/gallery, /admin, /login, /theSJMO/admin) are served this file with a
      // 404 status; React Router boots and renders the real page. noindex
      // keeps the 404-status copy out of search results. Every indexable
      // route has a prerendered 200 shell above.
      const fallback = baseHtml.replace(
        /<\/head>/,
        `  <meta name="robots" content="noindex">\n  </head>`,
      );
      fs.writeFileSync(path.join(distDir, "404.html"), fallback, "utf8");
      console.log(`[mlp-static-shells] wrote ${allShells.length} route shells + 404.html`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), prerenderPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

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
}

const SITE = "https://myliberalpony.co.uk";
const SHELLS: Shell[] = [
  {
    route: "",
    title: "MY LIBERAL PONY — experimental live music from the UK",
    description:
      "MY LIBERAL PONY is a multimedia, genre-bending artist. Stream the latest single Fingerprints, watch live videos, and find upcoming UK gigs.",
    h1: "MY LIBERAL PONY",
    bodyText:
      "Experimental freak pop from the UK. Louder in person. Stream the latest single Fingerprints on Spotify, watch live footage, and find every upcoming show.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: "MY LIBERAL PONY",
      url: SITE + "/",
    },
  },
  {
    route: "about",
    title: "About MY LIBERAL PONY",
    description:
      "MY LIBERAL PONY — a multimedia, genre-bending artist creating experimental live music and social commentary from the UK.",
    h1: "About MY LIBERAL PONY",
    bodyText:
      "MY LIBERAL PONY is a multimedia, genre-bending artist creating experimental live music and social commentary from the perspective of a disabled member of the LGBT community in England.",
  },
  {
    route: "listen",
    title: "MY LIBERAL PONY — Listen",
    description:
      "Listen to MY LIBERAL PONY — full YouTube live videos, SoundCloud stream and Bandcamp releases.",
    h1: "Listen",
    bodyText:
      "Full live videos on YouTube, the SoundCloud stream, and the Bandcamp catalogue — all in one place.",
  },
  {
    route: "oumuamua",
    title: "OUMUAMUA — new single from MY LIBERAL PONY",
    description:
      "OUMUAMUA — out now via Hot Earth Records. Listen on Spotify, Bandcamp, Apple Music, YouTube and SoundCloud.",
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
  // Per-route canonical (inject before </head>)
  const canonicalTag = `\n    <link rel="canonical" href="${esc(url)}" />\n`;
  html = html.replace(/<\/head>/, `${canonicalTag}</head>`);

  // Add per-route JSON-LD before </head>
  if (shell.jsonLd) {
    const ld = `<script type="application/ld+json">${JSON.stringify(shell.jsonLd)}</script>\n`;
    html = html.replace(/<\/head>/, `${ld}</head>`);
  }

  // Inject crawlable body content inside #root; React replaces it on mount.
  const shellBody = `<div id="prerender-shell"><h1>${esc(shell.h1)}</h1><p>${esc(shell.bodyText)}</p></div>`;
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${shellBody}</div>`,
  );
  return html;
}

function prerenderPlugin() {
  return {
    name: "mlp-static-shells",
    apply: "build" as const,
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const baseHtml = fs.readFileSync(indexPath, "utf8");

      for (const shell of SHELLS) {
        const html = applyShell(baseHtml, shell);
        if (shell.route === "") {
          fs.writeFileSync(indexPath, html, "utf8");
        } else {
          const dir = path.join(distDir, shell.route);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
        }
      }

      // SPA fallback for GitHub Pages: deep links to client-side routes
      // (/gallery, /admin, /login, /theSJMO/*) are served this file with a
      // 404 status; React Router boots and renders the real page. noindex
      // keeps the 404-status copy out of search results — indexable routes
      // all have prerendered 200 shells above.
      const fallback = baseHtml.replace(
        /<\/head>/,
        `  <meta name="robots" content="noindex">\n  </head>`,
      );
      fs.writeFileSync(path.join(distDir, "404.html"), fallback, "utf8");
      console.log(`[mlp-static-shells] wrote ${SHELLS.length} route shells + 404.html`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), prerenderPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

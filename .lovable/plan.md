## SEO Improvements

### Scope
Add per-route SEO control, expand sitemap coverage, and tighten on-page semantics. No backend or DB changes. No Twitter Card tags.

### Changes

**1. Per-route SEO via `react-helmet-async`**
- Install `react-helmet-async`.
- Wrap `<App />` in `<HelmetProvider>` in `src/main.tsx`.
- Add `src/components/SEO.tsx` — a small helper that renders `<title>`, `<meta name="description">`, `<link rel="canonical">`, and `og:title` / `og:description` / `og:url`. Optional `noindex` prop for admin routes.
- Remove the static `<link rel="canonical">` from `index.html` so each route owns its own canonical (avoids duplicate canonicals).
- Drop `<SEO>` into:
  - `Index.tsx` — home (title from admin-managed branding + spotlight)
  - `About.tsx`, `Gallery.tsx`, `Store.tsx`, `FAQ.tsx` — page-specific titles + descriptions
  - `MLPAdmin.tsx` — `noindex`

**2. Sitemap**
- Expand `public/sitemap.xml` with `/about`, `/gallery`, `/store`, `/faq`, and the `/theSJMO` portfolio routes (home, about, projects, contact). Keep current `lastmod`.

**3. `index.html` polish**
- Add `<meta name="robots" content="index, follow" />`.
- Add `og:image:alt`.
- Remove the canonical tag (moves to per-route).

**4. Homepage structured data (via Helmet)**
- Add `MusicRecording` and `BreadcrumbList` JSON-LD on `Index.tsx` (complements the existing sitewide `MusicGroup` in `index.html`).

**5. Image & performance polish**
- Add `loading="lazy"` to YouTube and Spotify iframes on `Index.tsx` / `SpotlightSection.tsx`.
- Audit `GigCard`, `SpotlightSection`, gallery thumbnails for missing or weak `alt` text.
- Add explicit `width`/`height` to the hero logo `<img>` to reduce CLS.

### Files touched
`package.json`, `src/main.tsx`, `src/components/SEO.tsx` (new), `index.html`, `public/sitemap.xml`, `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/Gallery.tsx`, `src/pages/Store.tsx`, `src/pages/FAQ.tsx`, `src/pages/MLPAdmin.tsx`, `src/components/SpotlightSection.tsx`, `src/components/GigCard.tsx`.

### Not included
Twitter Card tags (you're not on the platform — OG tags already cover Instagram, Facebook, LinkedIn, WhatsApp, Discord, iMessage previews).

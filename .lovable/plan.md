

## SEO-Optimised Single Release Layout + Admin Updates

### What we're doing

Restructuring the homepage to drive Spotify streams and YouTube views for the debut single, adding prominent press/radio credibility (BBC Introducing), and extending the admin panel so you can manage all of this yourself going forward.

### Homepage layout changes

The current page order is: Hero → Watch & Listen (2 videos) → Listen (SoundCloud) → Gigs → Contact → Footer.

New order, optimised for the single release:

```text
┌─────────────────────────────────┐
│  HERO (logo + title)            │
├─────────────────────────────────┤
│  🎵 NEW SINGLE — SPOTLIGHT      │  ← NEW section
│  Spotify embed (large)          │
│  "Listen on Spotify" CTA button │
│  BBC Introducing quote/badge    │
├─────────────────────────────────┤
│  WATCH — YouTube video          │  ← renamed, single featured video
│  (music video for the single)   │
├─────────────────────────────────┤
│  MORE MUSIC                     │  ← secondary section
│  Video 2 + SoundCloud embed     │
├─────────────────────────────────┤
│  GIGS                           │
├─────────────────────────────────┤
│  PRESS                          │  ← NEW section
│  BBC Introducing link + any     │
│  future press items             │
├─────────────────────────────────┤
│  CONTACT + FOOTER               │
└─────────────────────────────────┘
```

### SEO enhancements

- Add Spotify link to JSON-LD `sameAs` array and add a `MusicRecording` schema block for the single
- Update `<meta>` description and OG tags to mention the single name
- Add Spotify to `dns-prefetch` in `index.html`
- Add `<link rel="canonical">` dynamically
- Update `sitemap.xml` lastmod date
- Add Spotify link to footer navigation

### Data model changes

Extend `mlp_site_config` with two new JSONB columns:

| Column | Type | Purpose |
|--------|------|---------|
| `spotlight` | jsonb | `{ title, spotifyUrl, spotifyEmbedUrl, description }` — the featured release |
| `press` | jsonb | Array of `{ title, url, source, date }` — press mentions |

### Admin panel changes

Add two new tabs:

| Tab | Fields |
|-----|--------|
| **Spotlight** | Single/release title, Spotify track URL, Spotify embed URL, short description |
| **Press** | Add/remove press items (title, URL, source name, date) |

### Files to change

| File | What |
|------|------|
| **Migration** | `ALTER TABLE mlp_site_config ADD COLUMN spotlight jsonb`, `ADD COLUMN press jsonb`; seed with current Spotify + BBC data |
| `src/contexts/MLPContext.tsx` | Add `spotlight` and `press` interfaces and fields; update `rowToSiteData` and `updateSiteData` |
| `src/pages/Index.tsx` | Restructure layout: Spotlight section with Spotify embed + CTA at top, featured video below, secondary music section, new Press section before contact |
| `src/pages/MLPAdmin.tsx` | Add "Spotlight" and "Press" tabs with editable fields |
| `index.html` | Update meta description, add `MusicRecording` JSON-LD, add Spotify to `sameAs` and `dns-prefetch` |
| `public/sitemap.xml` | Update lastmod to current date |

### How the Spotify embed works

Spotify provides an oEmbed iframe. For the track `2MJXjtYkBRQYYLlyBTnXI0`, the embed URL is:
`https://open.spotify.com/embed/track/2MJXjtYkBRQYYLlyBTnXI0`

This renders a playable widget directly on the page — no API key needed.

### Press section

A simple list of linked items. The BBC Introducing entry would be:
- **Source**: BBC Introducing
- **Title**: (whatever the segment title is)
- **URL**: `https://www.bbc.co.uk/sounds/play/m002t20g`

Future press coverage gets added via the admin panel — no code changes needed.


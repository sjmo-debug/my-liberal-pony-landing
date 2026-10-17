# Admin editability audit

Status after the `admin-editable-content` change. "Admin" means `/login` then `/admin`.
"Sheet" means the Google Sheet `1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc`.

Where new values are stored: inside the existing `branding` JSON column of `mlp_site_config`
(keys `content` and `aboutParagraphs`). No database migration. Only values the owner changes
are stored; a blank box means "use the standard wording" (defaults live in `src/lib/siteContent.ts`).

## Home page (`/`, Index.tsx and shared components)

| Item | Where editable | Admin tab |
| --- | --- | --- |
| Hero photo | Admin (already) | Branding |
| Logo | Admin (already) | Branding |
| Main headline "MY LIBERAL PONY" | Admin (new) | Home Page Text |
| Tagline under headline | Admin (already) | Branding |
| Top menu labels and links | Admin (already) | Menu Links |
| Featured release header, title, description, button text, Spotify links, cover, press badge | Admin (already) | Featured Release |
| "OUMUAMUA →" link under the button | Admin (new) | Home Page Text |
| "As heard on ..." line (latest press item) | Admin (already, from first Press item) | Press |
| Newsletter title, sentence, email hint, button, success and error messages | Admin (new) | Home Page Text |
| Newsletter sign-ups themselves | Database table `newsletter_subscribers` | n/a |
| "Watch" title and featured video | Title: Admin (new). Video: Admin (already) | Home Page Text, Videos |
| Gig list (dates, venues, links, past photos) | Google Sheet, first tab | Gigs tab links to it |
| "UPCOMING GIGS", "Merch — At Shows Only.", "Previously" | Admin (new) | Home Page Text |
| Get in Touch title, two email labels | Admin (new) | Home Page Text |
| Contact email address | Admin (already) | Social & Contact |
| "Support the music", coffee button text | Admin (new) | Home Page Text |
| Coffee link | Admin (already) | Social & Contact |
| Footer links: Instagram, SoundCloud, Bandcamp, YouTube | Admin (already) | Social & Contact |
| Footer links: Spotify artist, Apple Music | Admin (new) | Home Page Text |
| Footer link labels ("About", "Instagram", ...) | Hardcoded: platform names, no reason to change | |
| "Photos: ..." credit | Admin (already) | Branding |
| Rainbow hover background words and videos | Google Sheet (tab gid 1394626976) | |
| Page `<title>` and meta description at runtime | Admin (new, see below) | Browser Tab & Google |
| Static SEO shells, `index.html` title, social-share tags | Hardcoded at build time (`vite.config.ts`, `index.html`) | |

## About (`/about`)

| Item | Where editable | Admin tab |
| --- | --- | --- |
| Page title, back button, portfolio button, "Press" title | Admin (new) | About Page Text |
| Bio paragraphs and italics | Sheet (tab gid 846546977) by default. Admin (new) overrides the sheet when any paragraph is saved | About Page Text |
| Press list entries | Admin (already) | Press |
| Portfolio button destination (`/theSJMO`) | Hardcoded: internal route | |

## Listen (`/listen`)

| Item | Where editable | Admin tab |
| --- | --- | --- |
| Page title, SoundCloud title, Bandcamp title and button | Admin (new) | Listen & Gallery Text |
| Second video (title and YouTube ID) | Admin (already) | Videos |
| SoundCloud embed | Admin (already) | Videos |
| Bandcamp link | Admin (already) | Social & Contact |

## Gallery (`/gallery`)

| Item | Where editable | Admin tab |
| --- | --- | --- |
| Page title | Admin (new) | Listen & Gallery Text |
| Photos, order, descriptions | Admin (already) | Gallery Photos |

## Oumuamua (`/oumuamua`)

| Item | Where editable | Admin tab |
| --- | --- | --- |
| Title, label, cover art | Admin (new) | Oumuamua Page |
| Streaming links (Spotify, Bandcamp, Apple Music, YouTube, SoundCloud) | Admin (new) | Oumuamua Page |
| Lyrics, credits and their headings, "Listen everywhere" heading | Admin (new) | Oumuamua Page |
| "Out now via" wording, "Released via" credit line wording | Hardcoded (label name is editable) | |
| Social-share image (`ogImage`) | Hardcoded (Cloudinary URL in `Oumuamua.tsx`) | |
| Spotify embed player | Hardcoded off (empty). The home page embed is Admin | |

## Not part of the MLP public pages

`/theSJMO` portfolio has its own admin (`/theSJMO/admin`) and is unchanged. `/admin`, `/login`,
`/reset-password` and the 404 page are not public content.

## Known limits

* A blank box falls back to the standard wording, so an item cannot be hidden by emptying it.
* Page title and description are changed at runtime by the page after it loads. Crawlers and link
  previews that do not run JavaScript still see the build-time text.
* Gigs are not in the database. See the PR description for what it would take.

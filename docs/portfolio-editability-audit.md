# Portfolio editability audit (/theSJMO)

Status after the `portfolio-admin-projects` change (project photos, manual order, Featured switch, project page wording). "Admin" means `/theSJMO/admin` (sign in at `/theSJMO/admin?login=1`).
The admin page has a Section dropdown on phones and a row of tabs on larger screens.

Where values are stored: inside the existing `artist_info` JSON of the single `sjmo_site_config` row.
No database migration. New optional keys: `heroImage` (photo) and `content` (a plain key to text map) in `artist_info`, and `featured` (true or absent) on each project inside the `projects` JSON.
Only values the owner changes are stored. A blank box means "use the standard wording", so clearing a box is a safe undo.
The standard wording lives in `src/lib/portfolioContent.ts`; every default is exactly the text that was hardcoded before.

## Home (`/theSJMO`)

| Item | Status | Admin section |
| --- | --- | --- |
| Hero photo (background) | Editable (new). Empty means plain black, no image | Hero & Photos |
| Hero photo credit | Editable (moved here from Bio) | Hero & Photos |
| Main headline | Editable (new) | Home Page Text |
| Tagline and introduction under the headline | Editable (already) | Bio |
| Hero alt text (screen readers) | Hardcoded, built from the Name | n/a |
| "Scroll" indicator and its label | Hardcoded, decorative | n/a |
| ABOUT MY WORK heading | Editable (new) | Home Page Text |
| First paragraph of the biography | Editable (already, first paragraph of Biography) | Bio |
| "Learn about the artist" button (link target is fixed to /theSJMO/about) | Text editable (new) | Home Page Text |
| WHAT I DO heading | Editable (new) | Home Page Text |
| Five service cards: title, description, which project type the card pre-selects | Editable (new) | Home Page Text |
| Card numbers 01 to 05 | Hardcoded (automatic) | n/a |
| Availability line under the cards | Editable (already) | Contact |
| Scrolling words (MUSIC, VISUALS, PRODUCTION, EVENTS, COLLABORATION, SOUND) | Hardcoded in `Marquee.tsx` | n/a |
| FEATURED heading | Editable (new) | Home Page Text |
| Which projects are featured | Editable (new). Rule: while no project has "Featured on Home" switched on, Home shows the first 4 projects in the saved order (today's behaviour). Once any project is switched on, Home shows only the switched-on ones, in the saved order, up to 6 (the first 6 if more are on). Switching all off returns to the first 4. | Projects |
| VIEW ALL PROJECTS button | Text editable (new); link fixed to /theSJMO/projects | Home Page Text |

## Menu (every portfolio page)

| Item | Status | Admin section |
| --- | --- | --- |
| Main Site button text (link goes to `/`) | Text editable (new), link fixed | Menu & Projects Text |
| Home, Projects, About, Contact labels (links fixed) | Text editable (new) | Menu & Projects Text |
| Aria label "Return to main site" | Hardcoded (screen readers) | n/a |

## Projects (`/theSJMO/projects`)

| Item | Status | Admin section |
| --- | --- | --- |
| Heading PROJECTS and subtitle | Editable (new) | Menu & Projects Text |
| Project cards: title, category, year, cover photo | Editable (already) | Projects |
| Order of the projects (also used by Home) | Editable (new): up and down arrows on each project | Projects |
| Featured on Home switch | Editable (new), on each project | Projects |
| A card whose cover is empty or fails to load | Shows title, role and year instead of a photo (nothing deleted) | n/a |
| Google description for the page | Hardcoded sentence, but now uses the Name from Bio | Bio |

## Project detail (`/theSJMO/projects/<slug>`)

| Item | Status | Admin section |
| --- | --- | --- |
| Title, year, category, description, role, location, medium | Editable (already) | Projects |
| Client | Editable (the box was missing from the admin until now) | Projects |
| Cover photo (big photo at the top, also the project card) | Editable (already). It is a separate field from the gallery. "Use as cover" on any gallery photo copies it there without removing anything | Projects |
| Gallery photos: add, replace, remove, reorder, shape, alt text, caption, credit | Editable (new). Photos with no image are skipped on the site; blank alt text becomes "Project title – photo N" | Projects |
| Caption | Shown when a photo is opened full screen (as before) | Projects |
| Credit | Shown small in the corner of the photo (as before) | Projects |
| Gallery photo that fails to load | Shows its description text in a box (as before) | n/a |
| Labels "Medium" and "Client" | Editable (new) | Project Page Text |
| Labels "Previous Project", "Next Project", "No Previous Project", "No Next Project" | Editable (new), but the previous/next links are NOT shown on the site at the moment (the component exists but is not used on the page). Nothing visible changes | Project Page Text |
| Project page tab title and link preview image | Unchanged (SEO is handled separately) | n/a |

## About (`/theSJMO/about`)

| Item | Status | Admin section |
| --- | --- | --- |
| ABOUT heading | Editable (new) | About Page Text |
| Tagline, name, location | Editable (already) | Bio, Contact |
| Portrait photo and credit | Editable (already) | Bio |
| Instagram and LinkedIn buttons | Links editable (already). Behance is stored but not shown on the site | Contact |
| Biography, Education, Email | Editable (already) | Bio, Contact |
| "Email:", "Location:", "Education:" labels | Hardcoded | n/a |
| SELECTED CLIENTS heading and list | Heading editable (new); list editable (new) | About Page Text; About Lists |
| SHARED STAGES WITH heading and list | Heading editable (new); list editable (new) | About Page Text; About Lists |
| HIGHLIGHTS heading and list (the `awards` list) | Heading editable (new); list editable (new) | About Page Text; About Lists |
| EXPERIENCE heading | Editable (new) | About Page Text |
| Experience sections and items | Editable (already) | Experience |
| SKILLS heading | Editable (new) | About Page Text |
| Skill groups and items | Editable (already) | Skills & Method |
| METHODOLOGY heading and "The Psychology Edge" subtitle | Editable (new) | About Page Text |
| Methodology cards | Editable (already) | Skills & Method |
| DISCOGRAPHY heading | Editable (new) | About Page Text |
| Discography table column titles (Project, Release, Role, Studio / Label) | Hardcoded | n/a |
| Discography rows | Editable (already) | Discography |
| THE JOURNEY heading | Editable (new) | About Page Text |
| Journey paragraph | Editable (already) | Bio |
| `approach` text | Editable in Bio but NOT shown anywhere on the public site | Bio |
| `phone` | Stored in the data type but has no editor and is NOT shown anywhere on the public site | n/a |

## Contact (`/theSJMO/contact`)

| Item | Status | Admin section |
| --- | --- | --- |
| GET IN TOUCH heading and subtitle | Editable (new) | Contact & Form Text |
| SEND A MESSAGE heading | Editable (new) | Contact & Form Text |
| "Fill out the form below ... 24-48 hours." sentence | Editable (new). The Availability line is added after it | Contact & Form Text; Contact |
| CONTACT INFO heading and its sentence | Editable (new) | Contact & Form Text |
| Email address and location | Editable (already) | Contact |
| "Email" and "Location" small labels | Hardcoded | n/a |
| Form labels: Name, Email, Project Type, Message | Editable (new) | Contact & Form Text |
| Form box hints (placeholders) | Editable (new) | Contact & Form Text |
| Project type choices (displayed words only; the stored values visuals, sound, production, performance, consultation, other are fixed) | Words editable (new) | Contact & Form Text |
| Send button, "Sending..." text | Editable (new) | Contact & Form Text |
| Success title and sentence | Editable (new) | Contact & Form Text |
| Message if sending fails | Editable (new) | Contact & Form Text |
| Form checking messages ("Name must be at least 2 characters", "Please enter a valid email address", "Message must be at least 10 characters", "Please select a project type") | Hardcoded (part of the form rules) | n/a |
| Where enquiries go (database table `portfolio_enquiries`, read in the Enquiries section) | Fixed | Enquiries |

## Page titles and link previews

| Item | Status |
| --- | --- |
| Browser tab title, Google description, link preview title and description (portfolio pages) | Now built from the live Name, Tagline and Hero Introduction from Bio (was the built-in text). Page words "About", "Contact", "Portfolio" in the tab title are hardcoded. |
| Link preview image | Page image if the page has one, else Hero photo, else Portrait, else none. The old template hero is gone. |
| Limitation | These are set by JavaScript after the page loads. Crawlers and link scanners that do not run JavaScript (some social sites, some search bots) read the static page shell built at deploy time, which still holds the old text and the main site's preview image. |

## Images that the data refers to

The default data (used until the owner saves something different) refers to Cloudinary account `dpy87lbpt`:

| Image id | Used by |
| --- | --- |
| `sjmo_portfolio/simon-portrait` | About portrait (default) and fallback share image |
| `portfolio/ayl-2024-cover`, `-stage`, `-crowd` | Project "Are You Listening?" |
| `portfolio/iridiphore-cover`, `-live`, `-detail` | Project Iridiphore |
| `portfolio/bob-vylan-cover`, `-stage` | Project Bob Vylan |
| `portfolio/south-street-cover`, `-event`, `-setup` | Project South Street |
| `sjmo_portfolio/hero-live` | REMOVED in this change (was the template hero photo) |

Load test: the build environment cannot reach Cloudinary (the network proxy answers 403 for `res.cloudinary.com`, including Cloudinary's own public demo image), and the web fetch tool failed for the same reason. So NONE of these could be confirmed or ruled out from here. A failure here says nothing about whether the image exists. To check, open each project page on a phone: a project whose top area shows only a title block (the page falls back to text when the cover fails to load) has a missing cover. Nothing in the project data was changed or deleted.

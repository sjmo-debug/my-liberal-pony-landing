
## Merge SJMO Portfolio into `/portfolio` subpage

### Overview
Copy the entire portfolio project's components, data, types, and pages into this project, nested under `/portfolio/*` routes. The current placeholder Portfolio page gets replaced.

### New dependency
- **framer-motion** — used throughout the portfolio project for animations

### Route structure
```text
/portfolio          → Portfolio home (hero + featured projects)
/portfolio/projects → Full portfolio grid
/portfolio/about    → Artist CV/about page
/portfolio/contact  → Contact form page
/portfolio/project/:slug → Individual project detail with lightbox
```

### Files to create

**Types & Data:**
- `src/types/portfolio.ts` — Project, ArtistInfo, and related interfaces
- `src/data/portfolio/projects.ts` — Project entries (updated to use current cloudinary helper)
- `src/data/portfolio/photographer.ts` — Artist info data

**Components:**
- `src/components/portfolio/PortfolioGrid.tsx` — Grid layout with animations
- `src/components/portfolio/ProjectCard.tsx` — Card with hover overlay
- `src/components/portfolio/CategoryFilter.tsx` — Category filter buttons
- `src/components/portfolio/ImageWithLightbox.tsx` — Image with zoom trigger
- `src/components/portfolio/Lightbox.tsx` — Full-screen image viewer
- `src/components/portfolio/ProjectNavigation.tsx` — Prev/next navigation
- `src/components/portfolio/ScrollReveal.tsx` — Scroll-triggered animation
- `src/components/portfolio/ScrollIndicator.tsx` — Hero scroll cue
- `src/components/portfolio/SEOHead.tsx` — Meta tag management
- `src/components/portfolio/ContactForm.tsx` — Validated contact form
- `src/components/portfolio/PortfolioLayout.tsx` — Wrapper with back-to-home nav (replaces the other project's Layout/Header/Footer with navigation consistent with this project's style)

**Pages:**
- `src/pages/portfolio/PortfolioHome.tsx` — Hero + featured projects
- `src/pages/portfolio/PortfolioProjects.tsx` — Full grid
- `src/pages/portfolio/PortfolioAbout.tsx` — Artist CV
- `src/pages/portfolio/PortfolioContact.tsx` — Contact form
- `src/pages/portfolio/PortfolioProjectDetail.tsx` — Project detail with gallery

### Files to modify

- `src/lib/cloudinary.ts` — Add `cloudinaryPresets` export (card, hero, thumbnail, portrait, full) using existing `CLOUD_NAME`
- `src/pages/Portfolio.tsx` — Replace placeholder with router outlet for sub-routes
- `src/App.tsx` — Add nested `/portfolio/*` routes, import new pages

### Integration approach
- All portfolio internal links prefixed with `/portfolio/` (e.g. `/portfolio/project/ayl-2024`)
- Portfolio pages get a "Back to Home" nav link consistent with existing project style (using BackgroundManager hover pattern)
- The other project's Layout/Header/Footer are **not** copied — instead a lightweight PortfolioLayout wraps the sub-pages with minimal navigation
- SEOHead copied as a portfolio-specific component to avoid conflicts with the main site
- Cloudinary uses the current project's `CLOUD_NAME` (`dpy87lbpt`)

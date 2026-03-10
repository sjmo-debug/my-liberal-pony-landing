

## Brutalist Overhaul for /theSJMO Pages

Keep the video hero banner as-is. Rework everything below it with a raw, punk-inspired brutalist aesthetic that matches the DIY music scene.

### Design Direction

- Heavy use of the existing **Ithaca** custom font (font-heading / font-body) — uppercase, large, confrontational
- Thick white borders, exposed grid lines, hard edges
- Oversized section headings with harsh contrast
- Raw horizontal dividers (thick solid lines, not subtle hairlines)
- Monospaced/typewriter feel for body text where appropriate
- Staggered/asymmetric layouts instead of everything centered
- Marquee/ticker-style scrolling text strip between sections
- Project cards keep hover-only info but get thicker borders and rawer feel

### Files to Modify

**1. `src/pages/portfolio/PortfolioHome.tsx`**
- "About My Work" section: left-align text, use oversized `font-heading uppercase` for heading, thick top border, rawer typography
- Add a scrolling marquee/ticker strip between intro and featured projects (repeating text like "MUSIC — VISUALS — PRODUCTION — EVENTS —")
- Featured Projects heading: massive uppercase font-heading, left-aligned
- "View All Projects" link: styled as a thick-bordered brutalist button

**2. `src/components/portfolio/ProjectCard.tsx`**
- Add thick white border (`border-2 border-white`) always visible around each card
- Remove rounded corners (already `rounded-sm` with `--radius: 0rem`, but make explicit `rounded-none`)

**3. `src/pages/portfolio/PortfolioProjects.tsx`**
- Page heading: left-aligned, massive, uppercase font-heading
- Remove centered layout, go left-aligned with thick top border

**4. `src/pages/portfolio/PortfolioAbout.tsx`**
- Section headings: uppercase font-heading, oversized
- Swap subtle `border-l-2` on experience items for thick `border-l-4 border-white`
- Skills tags: uppercase, thicker borders
- Methodology cards: thick borders, uppercase headings
- Discography table: rawer styling with visible grid lines

**5. `src/pages/portfolio/PortfolioContact.tsx`**
- Heading: left-aligned, uppercase, massive font-heading
- Contact info icons: remove soft bg-accent, use thick bordered squares instead
- Form area: thicker input borders

**6. `src/components/portfolio/PortfolioLayout.tsx`**
- Add a thick bottom border to the nav bar (`border-b-4 border-white`)
- Active nav link: filled white background with black text (inverted) instead of just bold

**7. New: `src/components/portfolio/Marquee.tsx`**
- Simple CSS-animated horizontal scrolling text strip
- White text on black, uppercase font-heading, separated by em dashes
- Used as a visual divider between sections

### Summary of Changes

All portfolio pages get: uppercase Ithaca headings, thick white borders, left-aligned layouts where appropriate, a raw marquee divider, and an inverted active-state nav. The hero video banner stays untouched.


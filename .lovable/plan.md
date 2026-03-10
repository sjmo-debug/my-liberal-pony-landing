

## Rebuild /theSJMO Admin Page

Create a local-only admin page at `/theSJMO/admin` that lets you edit all portfolio content in-browser. Changes persist via React context (reset on refresh). The admin page follows the same brutalist styling.

### Architecture

- **`src/contexts/PortfolioContext.tsx`** — React context holding editable copies of `photographerInfo` and `projects`, initialized from the static data files. All portfolio pages read from this context instead of importing data directly.
- **`src/pages/portfolio/PortfolioAdmin.tsx`** — Admin page with tabbed sections: Projects, Bio/About, Contact Info, Skills, Discography, Experience. Each section has inline editing with save/cancel.
- **Route** — Add `/theSJMO/admin` route in `App.tsx` and an "Admin" nav link in `PortfolioLayout.tsx`.

### Files to create
1. **`src/contexts/PortfolioContext.tsx`** — Context provider with state for `projects` and `photographerInfo`, plus updater functions
2. **`src/pages/portfolio/PortfolioAdmin.tsx`** — Tabbed admin interface with forms for all content sections

### Files to modify
1. **`src/App.tsx`** — Add admin route, wrap portfolio routes in context provider
2. **`src/components/portfolio/PortfolioLayout.tsx`** — Add "Admin" nav link
3. **`src/pages/portfolio/PortfolioHome.tsx`** — Read from context instead of static imports
4. **`src/pages/portfolio/PortfolioAbout.tsx`** — Read from context
5. **`src/pages/portfolio/PortfolioContact.tsx`** — Read from context
6. **`src/pages/portfolio/PortfolioProjects.tsx`** — Read from context
7. **`src/pages/portfolio/PortfolioProjectDetail.tsx`** — Read from context
8. **`src/data/portfolio/projects.ts`** — Keep as default data (no changes needed)

### Admin page sections (tabs)
- **Projects**: List of projects with edit/add/delete. Each project form: title, category, year, description, role, location, medium, slug, cover image URL, image URLs
- **Bio**: Name, tagline, hero introduction, biography, approach, journey, portrait image
- **Contact**: Email, phone, location, availability, social links
- **Skills & Method**: Editable skill groups, methodology cards
- **Discography**: Editable table rows
- **Experience**: Editable sections with bullet items

All forms use the brutalist styling (thick borders, uppercase headings, monospaced inputs, black/white palette).


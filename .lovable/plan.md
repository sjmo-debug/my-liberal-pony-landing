

## Rename `/portfolio` routes to `/theSJMO`

Update all route paths and internal links from `/portfolio` to `/theSJMO` across the project.

### Files to modify

1. **`src/App.tsx`** — Change parent route from `/portfolio` to `/theSJMO`
2. **`src/components/portfolio/PortfolioLayout.tsx`** — Update `navLinks` array paths (`/theSJMO`, `/theSJMO/projects`, etc.)
3. **`src/components/portfolio/ProjectCard.tsx`** — Update link to `/theSJMO/project/${slug}`
4. **`src/components/portfolio/ProjectNavigation.tsx`** — Update prev/next links to `/theSJMO/project/${slug}`
5. **`src/pages/portfolio/PortfolioProjectDetail.tsx`** — Update redirect to `/theSJMO/projects`
6. **`src/pages/portfolio/PortfolioHome.tsx`** — Update links to `/theSJMO/about` and `/theSJMO/projects`
7. **`src/pages/About.tsx`** — Update link from `/portfolio` to `/theSJMO`

All file names and component names stay the same — only the URL paths change.


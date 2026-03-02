

## Add Hidden Pages and Portfolio Button

### Overview
Create three new placeholder pages (`/store`, `/gallery`, `/portfolio`) with minimal "coming soon" content, register them as routes, and add a "Creative Portfolio" button on the About page. None of these pages will be linked from the main navigation (keeping them hidden like the existing FAQ page).

### New Files

**1. `src/pages/Store.tsx`**
- Minimal placeholder page styled consistently with the site (same fonts, uppercase, BackgroundManager, back-to-home link)
- Heading: "Store" with a "Coming Soon" message
- This will be the future home of Shopify integration

**2. `src/pages/Gallery.tsx`**
- Same consistent placeholder layout
- Heading: "Gallery" with a "Coming Soon" message
- Future home for photography/videography content

**3. `src/pages/Portfolio.tsx`**
- Same consistent placeholder layout
- Heading: "Creative Portfolio" with a "Coming Soon" message
- Could later link externally or host content directly

### Modified Files

**4. `src/App.tsx`**
- Import and add routes for `/store`, `/gallery`, and `/portfolio` above the catch-all route

**5. `src/pages/About.tsx`**
- Add a styled button/link below the about content that links to `/portfolio`
- Label: "Creative Portfolio"
- Styled consistently with the existing back button (bordered, uppercase, hover triggers rainbow background)
- Uses an arrow-right icon to indicate forward navigation

### Notes
- No links to these pages from the main nav or footer (hidden, as requested)
- All pages follow existing patterns: BackgroundManager, hover-triggered rainbow, consistent typography

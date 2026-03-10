

## Fix Browser Tab Title for Main Site

**Problem**: The `SEOHead` component on SJMO portfolio pages sets `document.title` to "Simon Oliver - Multi-Instrumentalist..." which persists in browser tab history/suggestions even when viewing the main MLP site. The main MLP pages never reset `document.title` back.

### Changes

**1. `src/pages/Index.tsx`**
- Add a `useEffect` that sets `document.title = "MY LIBERAL PONY - Watch & Listen - Upcoming Gigs"` on mount

**2. `src/pages/About.tsx`, `src/pages/Gallery.tsx`, `src/pages/Store.tsx`**
- Similarly set appropriate titles on mount (e.g. "MY LIBERAL PONY - About", "MY LIBERAL PONY - Gallery", "MY LIBERAL PONY - Store")

**3. `index.html`**
- Keep the existing `<title>` as-is (it already says "MY LIBERAL PONY - Experimental Live Music...") — this covers the initial load and browser suggestions

This ensures every MLP page actively claims its own title, preventing SJMO titles from leaking into browser suggestions.


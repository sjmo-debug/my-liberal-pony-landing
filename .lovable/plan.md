

## Mirror About Page Content from Google Sheet (ABOUT tab)

### What This Does
Instead of the About page text being hardcoded, it will be pulled dynamically from the **ABOUT** tab (gid=846546977) in your Google Sheet. This means you can update the About page content by editing the spreadsheet -- no code changes needed.

### How It Works

**1. Create a new hook: `src/hooks/useAboutContent.ts`**
- Follows the exact same pattern as the existing `useBackgroundText.ts` hook
- Fetches CSV from: `https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/export?format=csv&gid=846546977`
- Parses each row as a paragraph of text
- Checks for an "italic" or "style" column to preserve the italic styling on the copyright disclaimer
- Returns an array of `{ text: string, italic: boolean }` entries
- Refetches every 5 minutes (same as background text)

**2. Update `src/pages/About.tsx`**
- Import and use the new `useAboutContent` hook
- Replace the hardcoded paragraphs with a dynamic loop over the fetched entries
- Show a loading state while fetching
- Fall back to the current hardcoded text if the fetch fails (so the page never appears blank)
- Each paragraph keeps the same styling: `font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase`
- Paragraphs marked as italic get the additional `italic` class

### Expected Sheet Structure
The ABOUT tab should have rows where each row is one paragraph. For example:

| Text | Italic |
|------|--------|
| MY LIBERAL PONY IS A COLLECTION OF... | |
| MY LIBERAL PONY IS AT TIMES SERIOUS... | |
| MY LIBERAL PONY is not intended to be restricted... | |
| MY LIBERAL PONY shows are a safe space. | |
| MY LIBERAL PONY is not intended to infringe... | yes |

If there's no "Italic" column, all paragraphs render in normal weight. The column names are flexible -- the hook will try common variations.

### Technical Details
- No new dependencies needed (uses existing `@tanstack/react-query` and `papaparse`)
- Error handling mirrors the existing background text pattern
- Cache-busting timestamp parameter prevents stale data
- The title "About the Artist" and the back button remain hardcoded in the page (not from the sheet)


## Fix the favicon (root cause of Google showing the Lovable icon)

The current `public/mlp-favicon.png` is a PDF file with a `.png` extension. Browsers and Google's crawler can't decode it, so they fall back to the platform's default Lovable icon. No subpage references stray icons — the issue is entirely the one broken file at the site root.

### Changes

1. **Save the uploaded pony icon as proper image files in `public/`:**
   - `public/mlp-favicon.png` — real PNG, 512×512 (replaces the broken PDF-as-PNG)
   - `public/favicon.ico` — multi-size ICO (16/32/48), so Google's `/favicon.ico` request succeeds
   - `public/apple-touch-icon.png` — 180×180 PNG for iOS bookmarks/sharing

2. **Update `index.html` `<head>`:**
   - `<link rel="icon" type="image/x-icon" href="/favicon.ico">`
   - `<link rel="icon" type="image/png" sizes="512x512" href="/mlp-favicon.png">`
   - `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
   - Change the JSON-LD `Organization.logo` from `/mlp-favicon.png` to the absolute URL `https://myliberalpony.co.uk/mlp-favicon.png` (Google requires absolute URLs in structured data).

### Notes

- The uploaded image has a black background and white linework. I'll keep it as-is (no background removal) so it renders clearly in both light and dark browser chrome.
- Google re-crawls favicons on its own schedule (often days to weeks). The fix will go live immediately on the site, but search-result icons will lag. Once deployed, you can speed it up by requesting re-indexing of the homepage in Google Search Console.
- No subpage or component code changes are needed.

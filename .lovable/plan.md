

## Replace Placeholder Icons with MLP Icon

### What's Changing

The project currently uses generic/external placeholder icons in two places:

1. **Favicon** (`index.html` line 33) -- points to an external Google Storage URL. This is the browser tab icon visitors see.
2. **`public/favicon.ico`** -- the default Lovable favicon file sitting in the public folder (unused since the HTML overrides it with the external URL).

### Plan

1. **Copy the uploaded MLP icon** (the hand-drawn pony face) into the project as `public/mlp-favicon.png`
2. **Update `index.html`** to use the local icon file instead of the external URL:
   - Change the favicon `<link>` tag to point to `/mlp-favicon.png`
   - Also update the JSON-LD `"logo"` field to use the same local path
3. **Remove the old `public/favicon.ico`** since it will be replaced

This means the browser tab will show the MLP pony face icon instead of whatever the external URL currently serves.

### Notes
- The `og:image` (social sharing image) is a separate, wider banner image -- that should stay as-is since it's a different format/purpose
- No other placeholder icons were found in the UI components; all icons used are Lucide (arrow icons, etc.) which are functional, not branding placeholders




## Fix Newsletter: Styled IONOS Iframe Embed

### Problem
The custom form we built doesn't actually work because Maileon (IONOS's email service) is entirely JavaScript-driven. A plain HTML POST to their URL doesn't trigger the subscription -- only their own JS widget can do that. This is why no emails appeared in your IONOS account.

### Solution
Bring back the IONOS iframe but wrap it in a styled container that blends with your site's dark aesthetic.

### Changes

**`src/components/NewsletterSignup.tsx`** -- Rewrite to use a styled iframe approach:
- Keep the custom heading ("SUBSCRIBE TO THE NEWSLETTER") in your site's Ithaca font
- Embed the IONOS iframe inside a dark-themed container
- Add dark background wrapper, padding, and border styling that matches the rest of the site
- Use `filter: invert(1)` CSS on the iframe to flip its white background to dark (this also inverts the text colors to work on dark)
- Maintain the `showRainbow` theme toggle support
- Remove the broken hidden-iframe form submission code

**`src/pages/Index.tsx`** -- No changes needed, already imports and uses the component correctly.

### Visual result
- Section heading stays in your Ithaca font, uppercase, matching the site
- The IONOS form below it will appear with inverted colors (dark background, light text) via CSS filter
- Border styling matches the Bookings section above
- The signup actually works because IONOS's own JavaScript handles the subscription

### Trade-off
The `filter: invert(1)` trick does a good job of making the white form dark, but the IONOS button color may look slightly different. It's the most reliable approach without switching email providers.

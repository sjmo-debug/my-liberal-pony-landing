
## Replace IONOS iframe with custom-styled newsletter form

### Problem
The IONOS/Maileon iframe has a white background and default styling that clashes with the site's dark, minimal aesthetic. We can't style content inside a third-party iframe.

### Solution
Build a custom-styled email signup form that matches the site's look and feel. The actual subscription will still be handled by IONOS/Maileon via a hidden iframe technique.

### How it works
1. Remove the visible IONOS iframe
2. Create a custom form with an email input and "SIGN UP" button, styled to match the site (black background, white text, uppercase Ithaca font, border treatment)
3. When submitted, load the IONOS signup URL in a hidden iframe with the email as a parameter, preserving the subscription backend
4. Show success/error feedback styled consistently with the site

### Changes

**`src/pages/Index.tsx`**
- Replace the iframe-based newsletter section with a new `NewsletterSignup` component
- Keep the same position (after Bookings, before footer)

**`src/components/NewsletterSignup.tsx`** (new file)
- Custom form with email input field styled in the site's aesthetic (black bg, white borders, uppercase text)
- Submit handler that creates a hidden iframe to POST to the Maileon endpoint
- Loading, success, and error states with appropriate feedback messages
- Theme-aware styling (rainbow/dark toggle via `showRainbow` prop)

### Visual result
- Email input: full-width, white border, transparent background, white placeholder text, Ithaca font
- Button: uppercase "SIGN UP", white border, hover effect matching the site
- Success message: simple uppercase text confirmation
- Everything consistent with the existing Bookings section style

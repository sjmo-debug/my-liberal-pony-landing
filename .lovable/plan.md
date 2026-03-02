

## Replace IONOS with Mailchimp Newsletter Signup

### Overview
Remove the IONOS iframe entirely and build a custom-styled newsletter form that submits to Mailchimp. Mailchimp offers a simple embedded form action URL that works with a plain HTML POST -- no JavaScript widget required -- so we can fully control the styling.

### How Mailchimp Embedded Forms Work
Mailchimp provides a form action URL for each audience/list. A standard HTML form can POST an email address directly to it. No API key or backend needed for basic signups.

### What You Will Need
You will need to grab your Mailchimp form action URL:
1. Log into Mailchimp
2. Go to **Audience** > **Signup forms** > **Embedded forms**
3. Copy the form `action` URL -- it looks like: `https://XXXXX.us21.list-manage.com/subscribe/post?u=XXXXXXX&id=XXXXXXX`

### Changes

**`src/components/NewsletterSignup.tsx`**
- Remove the IONOS iframe completely
- Build a custom form with:
  - Email input: full-width, transparent background, themed border, uppercase placeholder, Ithaca font
  - "SIGN UP" button: bordered, uppercase, hover effect
  - The form POSTs directly to your Mailchimp action URL (opens in a hidden iframe so the page does not navigate away)
- Loading and success states with themed feedback text
- Maintains `showRainbow` / dark theme toggle support

**`src/pages/Index.tsx`**
- No changes needed -- already imports and uses the component correctly

### Technical Details
- The form uses `target` pointing to a hidden iframe so submission happens without page navigation
- A short timeout after submit shows a "Thank you" message
- Email validation via HTML5 `type="email"` and a simple regex check
- The Mailchimp action URL will be stored as a constant at the top of the component -- easy to update

### Visual Result
- Clean email input + button matching the Bookings section style
- No third-party branding or styling leaking through
- Fully theme-aware (dark mode and rainbow hover mode)


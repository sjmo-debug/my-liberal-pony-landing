

## Remove hover-triggered rainbow from Sign Up button

### What changes
**`src/components/NewsletterSignup.tsx`**:
- Remove `onMouseEnter` and `onMouseLeave` from the Sign Up button so hovering it no longer triggers the rainbow background
- On successful submission (inside `handleSubmit`), call `onHover(true)` to activate the rainbow -- it stays on until the user hovers over another element elsewhere on the page, which will naturally call `onHover(false)`

### Behavior after the change
- Hovering the Sign Up button: no rainbow effect
- Clicking Sign Up with a valid email: rainbow activates and persists
- Hovering any other interactive element on the page (nav links, email link, footer links): rainbow deactivates as usual via their own `onMouseLeave` handlers

### No other files change
The rainbow state is managed in `Index.tsx` via `isButtonHovered` -- the existing hover handlers on other elements already handle turning it off, so no changes needed there.


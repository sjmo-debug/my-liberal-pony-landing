

## Plain black background for all /theSJMO pages

Remove the `BackgroundManager` (video/text background effect) from the portfolio layout and set a plain black background. Remove all hover-triggered dynamic effects from the nav links.

### File to modify

**`src/components/portfolio/PortfolioLayout.tsx`**:
- Remove `BackgroundManager` import and rendering
- Remove `useState` for `isButtonHovered` and all `onMouseEnter`/`onMouseLeave` handlers
- Set a static `bg-black text-white` on the wrapper
- Use a static white border color for nav links


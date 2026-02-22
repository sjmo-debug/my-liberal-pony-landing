
## Add Full-Screen Video Section Below Hero

### What This Does
Adds a new full-viewport, autoplaying, looping, muted video section between the existing logo/hero and the "Watch & Listen" YouTube embeds. It includes a "WATCH NOW" CTA button that smoothly scrolls down to the Watch & Listen section. The existing hover-triggered background videos remain untouched.

### Layout After Change

```text
+---------------------------+
|  Nav (About / Instagram)  |
|                           |
|        [MLP Logo]         |
|     MY LIBERAL PONY       |  <-- existing hero (60vh)
|                           |
+---------------------------+
|                           |
|   [Full-screen video]     |
|                           |  <-- NEW section (100vh)
|      [ WATCH NOW ]        |
|                           |
+---------------------------+
|    Watch & Listen          |
|    [YouTube embed 1]      |  <-- existing content
|    [YouTube embed 2]      |
+---------------------------+
|    Gigs / Contact / etc   |
+---------------------------+
```

### Changes

**1. New component: `src/components/HeroVideo.tsx`**
- Full-viewport section (`h-screen w-full`) with a `<video>` element covering the background
- Video autoplays, loops, is muted, and uses `playsInline` for mobile compatibility
- Semi-transparent dark overlay for text contrast
- Centered "WATCH NOW" CTA button styled to match the site's black-and-white design system (uppercase, tracked, bordered -- consistent with the email CTA)
- CTA uses `scrollIntoView({ behavior: 'smooth' })` to scroll to the Watch & Listen section
- Accepts a `videoSrc` prop so you can swap the video file easily
- Initially uses a placeholder path (`/videos/hero-video.mp4`) -- you'll drop your new video file into `public/videos/` with that name

**2. Update: `src/pages/Index.tsx`**
- Import `HeroVideo` component
- Add an `id="watch-listen"` to the existing Watch & Listen `<section>` so the CTA can scroll to it
- Place `<HeroVideo />` between the hero `<section>` and the `<main>` content block
- No changes to the existing hover background system or any other sections

### Styling Details
- Video covers the full viewport with `object-cover` (crops to fill, no letterboxing)
- A dark overlay (`bg-black/40`) sits between the video and the CTA for readability
- The CTA button uses `font-body`, uppercase, wide tracking, and a white border on black -- matching the site's existing link/button aesthetic
- The section adapts to the `showRainbow` hover state for color consistency (white text/border normally, black when rainbow is active)

### What You'll Need to Do
- Upload your chosen video file to `public/videos/hero-video.mp4` (or let me know the filename and I'll update the path)
- Keep the file size reasonable (under 20MB ideally) for fast page loads

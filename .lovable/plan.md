
## Full-Screen Cinematic Video Section with Canvas Effects

### What This Does
Adds a new immersive, full-viewport video section between the existing hero (logo + title) and the "Watch & Listen" YouTube embeds. Inspired by tamber.music, it combines a looping background video with a subtle canvas particle/noise effect overlay and bold text statements that reveal on scroll or timer -- all with a dark cinematic feel. Importantly, it will be designed for smooth iOS/Instagram in-app browser compatibility (no complex gesture traps or scroll-hijacking).

### Layout After Change

```text
+---------------------------+
|  Nav (About / Instagram)  |
|        [MLP Logo]         |
|     MY LIBERAL PONY       |  <-- existing hero (60vh)
+---------------------------+
|                           |
|   [Full-screen video]     |
|   [Canvas particle layer] |  <-- NEW section (100vh)
|   [Animated text overlay] |
|      [ WATCH NOW ]        |
|                           |
+---------------------------+
|    Watch & Listen          |
|    [YouTube embed 1]      |  <-- existing content
|    [YouTube embed 2]      |
+---------------------------+
```

### New Components

**1. `src/components/HeroVideo.tsx`** -- The main container section
- Full-viewport section (`h-screen w-full`, `position: relative`)
- Contains three layers stacked with z-index:
  - Layer 0: `<video>` element -- autoplays, loops, muted, playsInline, object-cover
  - Layer 1: Canvas particle overlay (see below)
  - Layer 2: Text overlays + CTA button
- Dark overlay (`bg-black/40`) between video and text for readability
- "WATCH NOW" CTA button at center-bottom, styled like the existing email CTA (uppercase, tracked, bordered, white on dark)
- CTA scrolls smoothly to `#watch-listen` section
- Accepts `videoSrc` prop (defaults to `/videos/hero-video.mp4`)
- Uses CSS `scroll-snap` sparingly (or not at all) to avoid iOS in-app browser issues

**2. `src/components/CanvasParticles.tsx`** -- Subtle generative visual layer
- Renders a `<canvas>` element covering the full section
- Draws a subtle animated effect: floating particles or gentle noise grain that drifts across the screen
- Uses `requestAnimationFrame` for smooth 60fps animation
- Purely decorative (`pointer-events-none`, low opacity)
- Lightweight -- no heavy libraries, just vanilla Canvas API
- Cleans up animation frame on unmount to avoid memory leaks
- Particles will be white/semi-transparent to complement the dark overlay

**3. `src/components/ScrollingTextReveal.tsx`** -- Animated text statements
- Displays a sequence of bold text statements (e.g. artist taglines or lyrics) that fade/slide in one at a time
- Uses Intersection Observer or a simple interval timer to cycle through statements
- Text appears large, uppercase, in the site's heading font (`font-heading`)
- Each statement fades in, holds for ~3 seconds, then fades out as the next appears
- Positioned absolutely over the video, centered
- Text content can be hardcoded initially or pulled from the existing Google Sheets background entries
- Fully CSS-animated (opacity + translateY transitions) -- no heavy JS animation libraries

### Changes to Existing Files

**`src/pages/Index.tsx`**
- Import `HeroVideo`
- Place `<HeroVideo />` between the hero `<section>` closing tag and the `<main>` tag
- Add `id="watch-listen"` to the Watch & Listen `<section>` element so the CTA can scroll to it
- Pass `showRainbow` state to `HeroVideo` for color consistency on the CTA

No changes to the existing hover-triggered background system (`BackgroundManager`, `BackgroundText`, `VideoBackground`).

### iOS / Instagram In-App Browser Compatibility
- Video uses `playsInline` and `muted` attributes (required for autoplay on iOS)
- No scroll-hijacking or scroll-snap that could break swipe navigation
- No complex gesture detection
- CTA button has generous tap target size (`min-h-[44px]`, padded)
- Standard scrolling behavior -- the section is simply a tall block in the page flow

### Styling Details
- Video: `object-cover`, fills entire section, no letterboxing
- Canvas: `pointer-events-none`, `absolute inset-0`, subtle white particles at ~20% opacity
- Text: `font-heading`, white, large (responsive sizing), text-shadow for legibility
- CTA: White border, uppercase, tracked, slight hover scale -- matches the site's existing button language
- All layers use `transition-colors duration-500` to respect the `showRainbow` hover state

### What You Will Need to Do
- Upload your chosen video file to `public/videos/hero-video.mp4`
- Keep file size under 15-20MB for fast mobile loads
- Optionally provide a list of text statements for the scrolling reveal (otherwise I will use placeholder text that you can swap out)

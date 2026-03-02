

## Fix Background Video Playback

### Problem Summary
Background videos from Cloudinary aren't playing due to three compounding issues: unsupported `.mov` format, video element being destroyed/recreated on every hover, and lack of preloading.

### Changes

**1. Update `src/components/VideoBackground.tsx` -- Keep video mounted, fix format handling**
- Instead of returning `null` when not visible, keep the video element in the DOM but toggle its opacity/visibility. This allows the video to buffer and be ready instantly on hover.
- Remove the hardcoded `type="video/mp4"` from the `<source>` tag so the browser can auto-detect the format.
- Add `preload="auto"` to start buffering immediately.
- Use a `key` prop on the video tied to `videoUrl` so it properly swaps when a new video is selected.

**2. Update `src/components/BackgroundManager.tsx` -- Always render, toggle visibility via props**
- Pass the video URL even when not visible, so the video can preload in the background.
- Keep the existing random-selection logic unchanged.

**3. (Recommended) Convert `.mov` files to `.mp4` in Cloudinary**
- Cloudinary can transcode videos on the fly. We can append a format transformation to convert `.mov` URLs to `.mp4` automatically by modifying the URL.
- In the `VideoBackground` component or the hook, transform any URL ending in `.mov` to use Cloudinary's `f_mp4` transformation, ensuring cross-browser compatibility without needing to re-upload anything.

### Technical Details

For the `.mov` to `.mp4` conversion, Cloudinary supports on-the-fly transcoding. A URL like:
```text
https://res.cloudinary.com/dpy87lbpt/video/upload/v1772472846/file.mov
```
becomes:
```text
https://res.cloudinary.com/dpy87lbpt/video/upload/f_mp4,q_auto/v1772472846/file.mov
```
This tells Cloudinary to deliver it as MP4 format with automatic quality -- works in all browsers, no re-upload needed.

The `VideoBackground` component will be refactored to:
- Always render the container `div` (with `opacity-0`/`opacity-100` toggle instead of conditional render)
- Add `preload="auto"` for buffering
- Apply the Cloudinary `f_mp4,q_auto` transform to video URLs automatically
- Use a transition for smooth fade-in/out of the video

### Files Modified
- `src/components/VideoBackground.tsx` -- visibility toggle, format fix, preloading
- `src/components/BackgroundManager.tsx` -- always render video component

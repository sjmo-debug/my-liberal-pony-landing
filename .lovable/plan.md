

## Set Up Cloudinary Integration

### Overview
Integrate Cloudinary (cloud name: `dpy87lbpt`) across the project as a centralized media management solution. Since the cloud name is a public identifier, it's safe to store directly in code.

### What Gets Created

**1. `src/lib/cloudinary.ts` -- Cloudinary utility module**
- Export the cloud name constant and helper functions for building Cloudinary URLs
- `cloudinaryUrl(publicId, options?)` -- generates optimized delivery URLs with automatic format/quality
- `cloudinaryImage(publicId, width?, height?)` -- shorthand for image URLs with responsive sizing
- `cloudinaryVideo(publicId)` -- shorthand for video URLs
- This centralizes all Cloudinary URL logic so any component can import and use it

**2. `src/pages/Gallery.tsx` -- Upgrade from placeholder to Cloudinary-powered gallery**
- Replace "Coming Soon" with a grid layout ready to display Cloudinary-hosted images/videos
- Use a configurable array of Cloudinary public IDs (easy to update later)
- Start with a placeholder message ("Add images to your Cloudinary account to see them here") until content is uploaded
- Include responsive image loading with Cloudinary transformations (auto format, auto quality, responsive widths)

### What Gets Updated

**3. `src/pages/Index.tsx` -- Serve logo from Cloudinary**
- Replace the local import `@/assets/mlp-logo.png` with a Cloudinary URL
- Uses `cloudinaryImage()` helper for optimized delivery
- Note: You'll need to upload the logo to your Cloudinary account and provide the public ID. For now, the code will fall back to the local asset if a Cloudinary public ID isn't configured

### How It Works
- Cloudinary URLs follow the pattern: `https://res.cloudinary.com/dpy87lbpt/image/upload/f_auto,q_auto/v1/{public_id}`
- `f_auto` delivers the best format for each browser (WebP, AVIF, etc.)
- `q_auto` optimizes quality automatically
- Width/height transforms enable responsive images without serving oversized files
- No API key needed for delivery -- the cloud name is all that's required for public assets

### Technical Details
- The cloud name `dpy87lbpt` is a public identifier (appears in all asset URLs), safe to store in code
- No backend/edge function needed -- Cloudinary delivery URLs work directly from the browser
- Upload management can be done through the Cloudinary dashboard at cloudinary.com
- Future enhancement: could add an upload widget or admin page for direct uploads from the site


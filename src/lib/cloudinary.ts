const CLOUD_NAME = 'dpy87lbpt';

const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  format?: string;
  /** Render the asset in black & white via Cloudinary's e_grayscale effect */
  grayscale?: boolean;
}

/**
 * Build a full Cloudinary delivery URL with optional transformations.
 */
export function cloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const transforms: string[] = ['f_auto', 'q_auto'];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.grayscale) transforms.push('e_grayscale');

  const transformString = transforms.join(',');
  return `${BASE_URL}/image/upload/${transformString}/${publicId}`;
}

/**
 * Shorthand for responsive image URLs.
 */
export function cloudinaryImage(
  publicId: string,
  width?: number,
  height?: number,
  grayscale = false
): string {
  return cloudinaryUrl(publicId, {
    width,
    height,
    crop: width || height ? 'limit' : undefined,
    grayscale,
  });
}

/**
 * Shorthand for video delivery URLs.
 */
export function cloudinaryVideo(publicId: string): string {
  return `${BASE_URL}/video/upload/f_auto,q_auto/${publicId}`;
}

/**
 * Build a responsive srcset string across the given widths.
 */
export function cloudinarySrcset(
  publicId: string,
  widths: number[] = [800, 1200, 1600],
  grayscale = false
): string {
  return widths
    .map((w) => `${cloudinaryImage(publicId, w, undefined, grayscale)} ${w}w`)
    .join(', ');
}



/**
 * Convenience presets for common sizes used across the portfolio.
 */
export const cloudinaryPresets = {
  /** Grid thumbnail – 600px wide */
  thumbnail: (id: string) => cloudinaryUrl(id, { width: 600, crop: 'limit' }),
  /** Card cover – 900px wide */
  card: (id: string) => cloudinaryUrl(id, { width: 900, crop: 'limit' }),
  /** Hero / detail – 1600px wide */
  hero: (id: string) => cloudinaryUrl(id, { width: 1600, crop: 'limit' }),
  /** Full resolution – auto format & quality only */
  full: (id: string) => cloudinaryUrl(id),
  /** Portrait – 400×600 */
  portrait: (id: string) => cloudinaryUrl(id, { width: 400, height: 600, crop: 'fill', gravity: 'face' }),
  /** Portrait in black & white – 800×1067 for crisp retina rendering */
  portraitGrayscale: (id: string) =>
    cloudinaryUrl(id, { width: 800, height: 1067, crop: 'fill', gravity: 'auto', grayscale: true }),
  /** Hero / detail in black & white – 1600px wide */
  heroGrayscale: (id: string) => cloudinaryUrl(id, { width: 1600, crop: 'limit', grayscale: true }),
} as const;


export { CLOUD_NAME };

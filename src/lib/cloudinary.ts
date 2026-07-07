const CLOUD_NAME = 'dpy87lbpt';

const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  format?: string;
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

  const transformString = transforms.join(',');
  return `${BASE_URL}/image/upload/${transformString}/${publicId}`;
}

/**
 * Shorthand for responsive image URLs.
 */
export function cloudinaryImage(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinaryUrl(publicId, {
    width,
    height,
    crop: width || height ? 'limit' : undefined,
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
  widths: number[] = [800, 1200, 1600]
): string {
  return widths
    .map((w) => `${cloudinaryImage(publicId, w)} ${w}w`)
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
} as const;

export { CLOUD_NAME };

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

export { CLOUD_NAME };

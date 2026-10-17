import type { Project } from '@/types/portfolio';

/** Most projects the Home page's Featured block will show once projects are flagged. */
export const MAX_FEATURED = 6;
/** How many projects Home shows while NO project is flagged (the original behaviour). */
export const DEFAULT_FEATURED_COUNT = 4;

export const isFlaggedFeatured = (project: Project) => project.featured === true;

/**
 * Which projects the Home page features, in the owner's manual order.
 *  - If no project is flagged (all current live data): the first 4, exactly as before.
 *  - Once any project is flagged: only flagged projects, up to MAX_FEATURED.
 */
export function selectFeaturedProjects(projects: Project[]): Project[] {
  const flagged = projects.filter(isFlaggedFeatured);
  if (flagged.length === 0) return projects.slice(0, DEFAULT_FEATURED_COUNT);
  return flagged.slice(0, MAX_FEATURED);
}

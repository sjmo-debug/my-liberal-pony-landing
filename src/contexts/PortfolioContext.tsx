import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Project, ArtistInfo } from '@/types/portfolio';
import { projects as defaultProjects } from '@/data/portfolio/projects';
import { photographerInfo as defaultPhotographerInfo } from '@/data/portfolio/photographer';

interface PortfolioContextType {
  projects: Project[];
  photographerInfo: ArtistInfo;
  updateProjects: (projects: Project[]) => void;
  updatePhotographerInfo: (info: ArtistInfo) => void;
  getProjectBySlug: (slug: string) => Project | undefined;
  getFeaturedProjects: () => Project[];
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [photographerInfo, setPhotographerInfo] = useState<ArtistInfo>(defaultPhotographerInfo);

  const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
  const getFeaturedProjects = () => projects.slice(0, 4);

  return (
    <PortfolioContext.Provider value={{
      projects,
      photographerInfo,
      updateProjects: setProjects,
      updatePhotographerInfo: setPhotographerInfo,
      getProjectBySlug,
      getFeaturedProjects,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}

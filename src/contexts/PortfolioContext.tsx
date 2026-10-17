import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { Project, ArtistInfo } from '@/types/portfolio';
import { projects as defaultProjects } from '@/data/portfolio/projects';
import { photographerInfo as defaultPhotographerInfo } from '@/data/portfolio/photographer';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioContextType {
  projects: Project[];
  photographerInfo: ArtistInfo;
  isLoading: boolean;
  updateProjects: (projects: Project[]) => Promise<void>;
  updatePhotographerInfo: (info: ArtistInfo) => Promise<void>;
  getProjectBySlug: (slug: string) => Project | undefined;
  getFeaturedProjects: () => Project[];
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [photographerInfo, setPhotographerInfo] = useState<ArtistInfo>(defaultPhotographerInfo);
  const [isLoading, setIsLoading] = useState(true);
  const configId = useRef<string | null>(null);
  // Only allow writes once we have seen the database, so a failed fetch can
  // never overwrite saved content with the built-in defaults.
  const loaded = useRef(false);

  const applyRow = (row: any) => {
    configId.current = row.id;
    if (Array.isArray(row.projects) && row.projects.length) setProjects(row.projects as Project[]);
    if (row.artist_info && Object.keys(row.artist_info).length) {
      setPhotographerInfo({ ...defaultPhotographerInfo, ...row.artist_info } as ArtistInfo);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('sjmo_site_config')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (error) {
          console.error('Failed to fetch portfolio config:', error);
          return;
        }
        loaded.current = true;
        if (data && !cancelled) applyRow(data);
      } catch (err) {
        console.error('Failed to fetch portfolio config:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    const channel = supabase
      .channel('sjmo_site_config_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sjmo_site_config' }, (payload) => {
        if (payload.new && 'id' in payload.new) applyRow(payload.new);
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const save = async (next: { projects: Project[]; photographerInfo: ArtistInfo }) => {
    if (!loaded.current) {
      throw new Error('Could not reach the database, so nothing was saved. Reload and try again.');
    }
    const row = { projects: next.projects as any, artist_info: next.photographerInfo as any };
    if (configId.current) {
      const { data, error } = await supabase
        .from('sjmo_site_config')
        .update(row)
        .eq('id', configId.current)
        .select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Save was blocked. Check that this account is an admin.');
    } else {
      const { data, error } = await supabase.from('sjmo_site_config').insert(row).select('id').single();
      if (error) throw error;
      configId.current = data.id;
    }
    setProjects(next.projects);
    setPhotographerInfo(next.photographerInfo);
  };

  const updateProjects = (next: Project[]) => save({ projects: next, photographerInfo });
  const updatePhotographerInfo = (info: ArtistInfo) => save({ projects, photographerInfo: info });

  const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);
  const getFeaturedProjects = () => projects.slice(0, 4);

  return (
    <PortfolioContext.Provider value={{
      projects,
      photographerInfo,
      isLoading,
      updateProjects,
      updatePhotographerInfo,
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

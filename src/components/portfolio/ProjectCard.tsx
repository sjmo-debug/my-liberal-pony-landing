import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  showCategory?: boolean;
  index?: number;
}

export function ProjectCard({
  project,
  aspectRatio,
  showCategory = true,
  index = 0,
}: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ratio = aspectRatio || 'landscape';

  const aspectRatioClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[3/2]',
    square: 'aspect-square',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/theSJMO/project/${project.slug}`}
        className="group block relative overflow-hidden border-2 border-white"
      >
        <div className={cn('relative overflow-hidden bg-muted', aspectRatioClasses[ratio])}>
          {!isLoaded && <div className="absolute inset-0 bg-muted" />}

          <motion.img
            src={project.coverImage}
            alt={project.title}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-700',
              isLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-110'
            )}
            loading={index < 6 ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <h3 className="font-heading text-xl md:text-2xl uppercase tracking-widest" style={{ color: 'white' }}>
                {project.title}
              </h3>
              {showCategory && (
                <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <span>{project.category}</span>
                  <span>—</span>
                  <span>{project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

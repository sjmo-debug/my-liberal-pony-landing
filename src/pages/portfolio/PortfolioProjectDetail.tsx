import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Camera, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { ScrollReveal } from '@/components/portfolio/ScrollReveal';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ImageWithLightbox } from '@/components/portfolio/ImageWithLightbox';
import { Lightbox } from '@/components/portfolio/Lightbox';

export default function PortfolioProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getProjectBySlug } = usePortfolio();
  const project = slug ? getProjectBySlug(slug) : undefined;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [coverFailed, setCoverFailed] = useState(false);


  if (!project) {
    return <Navigate to="/theSJMO/projects" replace />;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEOHead title={project.title} description={project.description} image={project.coverImage} type="article" />

      <div className="min-h-screen">
        <motion.div className="relative w-full h-[70vh] overflow-hidden bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          {coverFailed ? (
            <div className="absolute inset-0 flex flex-col justify-end gap-3 p-8 md:p-12 border-b-4 border-white">
              <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest">{project.title}</h2>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                {project.role && <span>{project.role}</span>}
                {project.role && <span>—</span>}
                <span>{project.year}</span>
              </div>
            </div>
          ) : (
            <>
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" onError={() => setCoverFailed(true)} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </>
          )}
        </motion.div>


        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">{project.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-light">
                <div className="flex items-center gap-2"><Calendar className="size-4" /><span>{project.year}</span></div>
                <div className="flex items-center gap-2 capitalize"><span>•</span><span>{project.category}</span></div>
                {project.location && (<><span>•</span><div className="flex items-center gap-2"><MapPin className="size-4" /><span>{project.location}</span></div></>)}
              </div>
            </div>
            <Separator />
            <p className="text-lg md:text-xl font-light leading-relaxed text-foreground">{project.description}</p>
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {project.medium && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-light tracking-wide uppercase text-muted-foreground"><Camera className="size-4" /><span>Medium</span></div>
                  <p className="font-light text-foreground">{project.medium}</p>
                </div>
              )}
              {project.client && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-light tracking-wide uppercase text-muted-foreground"><User className="size-4" /><span>Client</span></div>
                  <p className="font-light text-foreground">{project.client}</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <section className="py-12 md:py-16">
          <div className="space-y-8 md:space-y-12">
            {project.images.map((image, index) => (
              <ScrollReveal key={image.id} delay={index * 0.1}>
                <ImageWithLightbox image={image} onClick={() => openLightbox(index)} priority={index === 0} index={0} className="w-full" />
              </ScrollReveal>
            ))}
          </div>
        </section>

        <Lightbox images={project.images} currentIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} onNavigate={setCurrentImageIndex} />
      </div>
    </>
  );
}

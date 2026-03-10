import { usePortfolio } from '@/contexts/PortfolioContext';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { motion } from 'framer-motion';

export default function PortfolioProjects() {
  const { projects } = usePortfolio();

  return (
    <>
      <SEOHead title="Portfolio" description="Browse Simon Oliver's portfolio of music, production, visual art, and collaborative creative projects." />

      <div className="min-h-screen">
        <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b-4 border-white">
          <div className="max-w-7xl mx-auto space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl uppercase tracking-widest">PROJECTS</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-mono uppercase tracking-wide mt-4">
                MUSIC — PRODUCTION — VISUAL ART
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16 px-2 md:px-4">
          <PortfolioGrid projects={projects} />
        </section>

        <div className="h-24" />
      </div>
    </>
  );
}

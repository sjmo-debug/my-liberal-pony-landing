import { projects } from '@/data/portfolio/projects';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { motion } from 'framer-motion';

export default function PortfolioProjects() {
  return (
    <>
      <SEOHead title="Portfolio" description="Browse Simon Oliver's portfolio of music, production, visual art, and collaborative creative projects." />

      <div className="min-h-screen">
        <section className="relative py-24 md:py-32 px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">Portfolio</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
                Music, production, and visual art — a collection of creative work
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

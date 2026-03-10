import { motion } from 'framer-motion';
import { photographerInfo } from '@/data/portfolio/photographer';
import { getFeaturedProjects } from '@/data/portfolio/projects';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ScrollIndicator } from '@/components/portfolio/ScrollIndicator';
import { ScrollReveal } from '@/components/portfolio/ScrollReveal';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortfolioHome() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <SEOHead />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay muted loop playsInline preload="metadata"
              poster="https://images.pexels.com/videos/2675516/free-video-2675516.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            >
              <source src="https://videos.pexels.com/video-files/2675516/2675516-sd_960_540_24fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          </div>

          <div className="relative h-full flex flex-col items-center justify-center px-6">
            <motion.div className="text-center space-y-6 max-w-4xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
              <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-widest" style={{ color: 'white' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                {photographerInfo.name.toUpperCase()}
              </motion.h1>
              <motion.p className="text-xl md:text-2xl font-light tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
                {photographerInfo.tagline}
              </motion.p>
              <motion.p className="text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
                {photographerInfo.heroIntroduction}
              </motion.p>
            </motion.div>

            <motion.div className="absolute bottom-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
              <ScrollIndicator />
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-24 md:py-32 px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide">About My Work</h2>
                <div className="space-y-4 text-lg font-light leading-relaxed text-muted-foreground">
                  <p>{photographerInfo.biography.split('\n\n')[0]}</p>
                </div>
                <Link to="/theSJMO/about" className="inline-flex items-center gap-2 text-base font-light tracking-wide text-foreground hover:text-muted-foreground transition-colors group">
                  <span>Learn More About Me</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 md:py-32 border-t border-border">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4 px-6">
              <h2 className="text-4xl md:text-5xl font-light tracking-wide">Featured Projects</h2>
              <p className="text-lg text-muted-foreground font-light tracking-wide">A selection of recent work</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} aspectRatio="landscape" showCategory={true} index={index} />
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="flex justify-center mt-16 px-6">
              <Link to="/theSJMO/projects" className="group inline-flex items-center gap-2 text-lg font-light tracking-wide text-foreground hover:text-muted-foreground transition-colors">
                <span>View All Projects</span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  );
}

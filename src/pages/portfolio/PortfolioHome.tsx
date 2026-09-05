import { motion } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ScrollIndicator } from '@/components/portfolio/ScrollIndicator';
import { ScrollReveal } from '@/components/portfolio/ScrollReveal';
import { SEOHead } from '@/components/portfolio/SEOHead';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Marquee } from '@/components/portfolio/Marquee';

const services = [
  { type: 'visuals', title: 'Live Visuals', description: 'Bespoke audio-reactive visual identities for bands and events, via Iridiphore. 100+ performances delivered.' },
  { type: 'sound', title: 'Live Sound & Stage', description: 'Front-of-house engineering, stage management and logistics for gigs and multi-stage festivals.' },
  { type: 'production', title: 'Recording & Production', description: 'Tracking, production and engineering for singles and EPs, from DIY sessions to full studio builds.' },
  { type: 'performance', title: 'Performance & Session', description: 'Double bass, bass, guitar, drums and vocals for live shows, dep work and studio sessions.' },
  { type: 'consultation', title: 'Consultation', description: 'Event planning, accessible and inclusive programming, and guidance for artists building a live show.' },
] as const;

export default function PortfolioHome() {

  const { photographerInfo, getFeaturedProjects } = usePortfolio();
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <SEOHead />

      <div className="min-h-screen">
        {/* Hero Section — untouched */}
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
              <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-heading uppercase tracking-widest" style={{ color: 'white' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
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

        {/* Introduction — brutalist */}
        <section className="border-t-4 border-white py-20 md:py-28 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="font-heading text-5xl md:text-7xl uppercase tracking-widest">ABOUT MY WORK</h2>
                <div className="max-w-3xl space-y-4 text-lg font-mono leading-relaxed text-muted-foreground">
                  <p>{photographerInfo.biography.split('\n\n')[0]}</p>
                </div>
                <Link
                  to="/theSJMO/about"
                  className="inline-flex items-center gap-3 font-heading text-lg uppercase tracking-widest border-2 border-white px-6 py-3 hover:bg-white hover:text-black transition-colors group"
                >
                  <span>LEARN MORE</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Services */}
        <section className="border-t-4 border-white py-20 md:py-28 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl uppercase tracking-widest">WHAT I DO</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
              {services.map((service, i) => (
                <ScrollReveal key={service.title} delay={i * 0.05}>
                  <Link
                    to={`/theSJMO/contact?type=${service.type}`}
                    className="group block h-full p-6 border-2 border-white hover:bg-white hover:text-black transition-colors space-y-3"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-black/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading text-2xl uppercase tracking-widest">{service.title}</h3>
                    <p className="font-mono text-sm leading-relaxed text-muted-foreground group-hover:text-black/70">{service.description}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <p className="font-mono text-sm uppercase tracking-wide text-muted-foreground">{photographerInfo.availability}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Marquee divider */}
        <Marquee />


        {/* Featured Projects — brutalist */}
        <section className="py-20 md:py-28">
          <ScrollReveal>
            <div className="mb-12 px-6 lg:px-8">
              <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase tracking-widest">FEATURED</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} aspectRatio="landscape" showCategory={true} index={index} />
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-12 px-6 lg:px-8">
              <Link
                to="/theSJMO/projects"
                className="inline-flex items-center gap-3 font-heading text-lg uppercase tracking-widest border-4 border-white px-8 py-4 hover:bg-white hover:text-black transition-colors group"
              >
                <span>VIEW ALL PROJECTS</span>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  );
}

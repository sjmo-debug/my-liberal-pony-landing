import { motion } from 'framer-motion';
import { Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { SEOHead } from '@/components/portfolio/SEOHead';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function PortfolioAbout() {
  const { photographerInfo } = usePortfolio();

  return (
    <>
      <SEOHead title="About" description={`Learn about ${photographerInfo.name}, ${photographerInfo.tagline}.`} image={photographerInfo.portraitImage} />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-20 md:py-28 px-6 lg:px-8 border-b-4 border-white">
          <div className="max-w-4xl mx-auto space-y-4">
            <motion.div initial={{ opacity: 0.8, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl uppercase tracking-widest">ABOUT</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-mono uppercase tracking-wide mt-4">{photographerInfo.tagline}</p>
            </motion.div>
          </div>
        </section>

        {/* Portrait and Biography */}
        <section className="py-16 md:py-24 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div className="space-y-6" initial={{ opacity: 0.8, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <div className="aspect-[3/4] relative overflow-hidden border-2 border-white bg-muted">
                  <video autoPlay muted loop playsInline preload="metadata" poster="https://images.pexels.com/videos/3888252/afro-hair-fashion-model-3888252.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }}>
                    <source src="https://videos.pexels.com/video-files/3888252/3888252-sd_426_226_25fps.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="flex items-center gap-3">
                  {photographerInfo.socialLinks.instagram && (
                    <a href={photographerInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-white hover:bg-white hover:text-black transition-colors" aria-label="Instagram"><Instagram className="size-5" /></a>
                  )}
                  {photographerInfo.socialLinks.linkedin && (
                    <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-white hover:bg-white hover:text-black transition-colors" aria-label="LinkedIn"><Linkedin className="size-5" /></a>
                  )}
                  {photographerInfo.socialLinks.linktree && (
                    <a href={photographerInfo.socialLinks.linktree} target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-white hover:bg-white hover:text-black transition-colors" aria-label="Linktree"><LinkIcon className="size-5" /></a>
                  )}
                </div>
              </motion.div>

              <motion.div className="space-y-8" initial={{ opacity: 0.8, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="space-y-3">
                  <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-widest">{photographerInfo.name.toUpperCase()}</h2>
                  <p className="text-xl text-muted-foreground font-mono uppercase tracking-wide">{photographerInfo.tagline}</p>
                </div>
                <div className="border-t-4 border-white pt-6 space-y-4">
                  {photographerInfo.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-base md:text-lg font-mono leading-relaxed text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
                <div className="pt-4 space-y-2 font-mono text-sm">
                  <div><span className="text-muted-foreground uppercase tracking-wide">Email: </span><a href={`mailto:${photographerInfo.email}`} className="text-foreground hover:text-muted-foreground transition-colors">{photographerInfo.email}</a></div>
                  <div><span className="text-muted-foreground uppercase tracking-wide">Location: </span><span className="text-foreground">{photographerInfo.location}</span></div>
                  <div><span className="text-muted-foreground uppercase tracking-wide">Education: </span><span className="text-foreground">{photographerInfo.education}</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t-4 border-white">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>EXPERIENCE</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {photographerInfo.experience.map((section, i) => (
                <motion.div key={section.title} className="space-y-4" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="font-heading text-xl uppercase tracking-widest">{section.title.toUpperCase()}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-sm md:text-base font-mono leading-relaxed text-muted-foreground pl-4 border-l-4 border-white">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t-4 border-white">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>SKILLS</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {photographerInfo.skills.map((group, i) => (
                <motion.div key={group.label} className="space-y-4" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="font-heading text-lg uppercase tracking-widest">{group.label.toUpperCase()}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 text-sm font-mono uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t-4 border-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div className="space-y-2" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest">METHODOLOGY</h2>
              <p className="text-muted-foreground font-mono uppercase tracking-wide">The NHS / Psychology Edge</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-0">
              {photographerInfo.methodology.map((item, i) => (
                <motion.div key={item.title} className="space-y-3 p-6 border-2 border-white" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="font-heading text-lg uppercase tracking-widest">{item.title.toUpperCase()}</h3>
                  <p className="text-sm font-mono leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Discography */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t-4 border-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>DISCOGRAPHY</motion.h2>
            <motion.div initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Table className="border-2 border-white">
                <TableHeader>
                  <TableRow className="border-b-2 border-white">
                    <TableHead className="font-heading uppercase tracking-widest text-white">Project</TableHead>
                    <TableHead className="font-heading uppercase tracking-widest text-white">Release</TableHead>
                    <TableHead className="font-heading uppercase tracking-widest text-white">Role</TableHead>
                    <TableHead className="font-heading uppercase tracking-widest text-white">Studio / Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {photographerInfo.discography.map((entry) => (
                    <TableRow key={entry.project} className="border-b border-white/30">
                      <TableCell className="font-mono">{entry.project}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{entry.release}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{entry.role}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{entry.studioLabel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </section>

        {/* Journey */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t-4 border-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.h2 className="font-heading text-4xl md:text-6xl uppercase tracking-widest" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>THE JOURNEY</motion.h2>
            <motion.p className="text-base md:text-lg font-mono leading-relaxed text-muted-foreground" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>{photographerInfo.journey}</motion.p>
          </div>
        </section>
      </div>
    </>
  );
}

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';
import { photographerInfo } from '@/data/portfolio/photographer';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/portfolio/SEOHead';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function PortfolioAbout() {
  return (
    <>
      <SEOHead title="About" description={`Learn about ${photographerInfo.name}, ${photographerInfo.tagline}.`} image={photographerInfo.portraitImage} />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-24 md:py-32 px-6 lg:px-8 border-b border-border">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div initial={{ opacity: 0.8, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">About</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">{photographerInfo.tagline}</p>
            </motion.div>
          </div>
        </section>

        {/* Portrait and Biography */}
        <section className="py-16 md:py-24 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div className="space-y-6" initial={{ opacity: 0.8, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <div className="aspect-[3/4] relative overflow-hidden rounded-sm bg-muted">
                  <video autoPlay muted loop playsInline preload="metadata" poster="https://images.pexels.com/videos/3888252/afro-hair-fashion-model-3888252.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }}>
                    <source src="https://videos.pexels.com/video-files/3888252/3888252-sd_426_226_25fps.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="flex items-center gap-4">
                  {photographerInfo.socialLinks.instagram && (
                    <a href={photographerInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 border border-border rounded-sm hover:bg-accent transition-colors" aria-label="Instagram"><Instagram className="size-5" /></a>
                  )}
                  {photographerInfo.socialLinks.linkedin && (
                    <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 border border-border rounded-sm hover:bg-accent transition-colors" aria-label="LinkedIn"><Linkedin className="size-5" /></a>
                  )}
                  {photographerInfo.socialLinks.linktree && (
                    <a href={photographerInfo.socialLinks.linktree} target="_blank" rel="noopener noreferrer" className="p-3 border border-border rounded-sm hover:bg-accent transition-colors" aria-label="Linktree"><LinkIcon className="size-5" /></a>
                  )}
                </div>
              </motion.div>

              <motion.div className="space-y-8" initial={{ opacity: 0.8, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-light tracking-wide">{photographerInfo.name}</h2>
                  <p className="text-xl text-muted-foreground font-light tracking-wide">{photographerInfo.tagline}</p>
                </div>
                <Separator />
                <div className="space-y-4">
                  {photographerInfo.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
                <div className="pt-4 space-y-2">
                  <div className="text-sm font-light tracking-wide"><span className="text-muted-foreground">Email: </span><a href={`mailto:${photographerInfo.email}`} className="text-foreground hover:text-muted-foreground transition-colors">{photographerInfo.email}</a></div>
                  <div className="text-sm font-light tracking-wide"><span className="text-muted-foreground">Location: </span><span className="text-foreground">{photographerInfo.location}</span></div>
                  <div className="text-sm font-light tracking-wide"><span className="text-muted-foreground">Education: </span><span className="text-foreground">{photographerInfo.education}</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.h2 className="text-3xl md:text-4xl font-light tracking-wide text-center" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Experience Highlights</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {photographerInfo.experience.map((section, i) => (
                <motion.div key={section.title} className="space-y-4" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="text-xl font-medium tracking-wide">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-sm md:text-base font-light leading-relaxed text-muted-foreground pl-4 border-l-2 border-border">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.h2 className="text-3xl md:text-4xl font-light tracking-wide text-center" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Core Skills</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {photographerInfo.skills.map((group, i) => (
                <motion.div key={group.label} className="space-y-4" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="text-lg font-medium tracking-wide">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 text-sm font-light border border-border rounded-sm bg-accent/50">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div className="text-center space-y-2" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">Methodology</h2>
              <p className="text-muted-foreground font-light">The NHS / Psychology Edge</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {photographerInfo.methodology.map((item, i) => (
                <motion.div key={item.title} className="space-y-3 p-6 border border-border rounded-sm" initial={{ opacity: 0.8, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <h3 className="text-lg font-medium tracking-wide">{item.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Discography */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2 className="text-3xl md:text-4xl font-light tracking-wide text-center" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Discography & Session Work</motion.h2>
            <motion.div initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-light tracking-wide">Project</TableHead>
                    <TableHead className="font-light tracking-wide">Release</TableHead>
                    <TableHead className="font-light tracking-wide">Role</TableHead>
                    <TableHead className="font-light tracking-wide">Studio / Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {photographerInfo.discography.map((entry) => (
                    <TableRow key={entry.project}>
                      <TableCell className="font-light">{entry.project}</TableCell>
                      <TableCell className="font-light text-muted-foreground">{entry.release}</TableCell>
                      <TableCell className="font-light text-muted-foreground">{entry.role}</TableCell>
                      <TableCell className="font-light text-muted-foreground">{entry.studioLabel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </section>

        {/* Journey */}
        <section className="py-16 md:py-24 px-6 lg:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <motion.h2 className="text-3xl md:text-4xl font-light tracking-wide" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>The Journey</motion.h2>
            <motion.p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>{photographerInfo.journey}</motion.p>
          </div>
        </section>
      </div>
    </>
  );
}

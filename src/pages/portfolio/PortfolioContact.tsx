import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ContactForm } from '@/components/portfolio/ContactForm';
import { SEOHead } from '@/components/portfolio/SEOHead';

export default function PortfolioContact() {
  const { photographerInfo } = usePortfolio();

  return (
    <>
      <SEOHead title="Contact" description={`Get in touch with ${photographerInfo.name} for collaborations, bookings, and creative projects.`} />

      <div className="min-h-screen">
        <section className="py-20 md:py-28 px-6 lg:px-8 border-b-4 border-white">
          <div className="max-w-4xl mx-auto space-y-4">
            <motion.div initial={{ opacity: 0.8, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase tracking-widest">GET IN TOUCH</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-mono uppercase tracking-wide mt-4">LET'S DISCUSS YOUR NEXT PROJECT</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <motion.div className="space-y-6" initial={{ opacity: 0.8, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <div className="space-y-3">
                  <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-widest">SEND A MESSAGE</h2>
                  <p className="text-muted-foreground font-mono text-sm">Fill out the form below and I'll get back to you within 24-48 hours. {photographerInfo.availability}</p>
                </div>
                <ContactForm />
              </motion.div>

              <motion.div className="space-y-8" initial={{ opacity: 0.8, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="space-y-3">
                  <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-widest">CONTACT INFO</h2>
                  <p className="text-muted-foreground font-mono text-sm">Prefer to reach out directly? Here's how.</p>
                </div>
                <div className="border-t-4 border-white pt-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 border-2 border-white"><Mail className="size-5" /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Email</p>
                      <a href={`mailto:${photographerInfo.email}`} className="text-base md:text-lg font-light hover:text-muted-foreground transition-colors">{photographerInfo.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 border-2 border-white"><Phone className="size-5" /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Phone</p>
                      <a href={`tel:${photographerInfo.phone}`} className="text-base md:text-lg font-light hover:text-muted-foreground transition-colors">{photographerInfo.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 border-2 border-white"><MapPin className="size-5" /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Location</p>
                      <p className="text-base md:text-lg font-light">{photographerInfo.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </>
  );
}

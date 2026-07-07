import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';
import { useMLP } from '@/contexts/MLPContext';
import SEO from '@/components/SEO';

const Listen = () => {
  const { siteData } = useMLP();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const showRainbow = isButtonHovered;

  const border = showRainbow ? 'border-2 border-black' : 'border-2 border-foreground';

  return (
    <div className="min-h-screen transition-all duration-500 relative">
      <SEO
        title={`${siteData.branding.siteTitle} - Listen`}
        description={`Listen to ${siteData.branding.siteTitle} — full YouTube, SoundCloud and Bandcamp.`}
        path="/listen"
      />
      <BackgroundManager isVisible={showRainbow} />
      <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${showRainbow ? 'text-black' : 'bg-background text-foreground'}`}>
        <article className="w-full max-w-5xl mx-auto text-center space-y-12 md:space-y-16">
          <nav className="flex justify-start">
            <Link to="/" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className={`inline-flex items-center gap-2 font-body text-base md:text-lg uppercase px-6 py-3 min-h-[44px] transition-all duration-300 ${border}`}>
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </nav>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider">
            Listen
          </h1>

          <section className="w-full space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider">
              {siteData.videos[1].title}
            </h2>
            <div className={`relative overflow-hidden ${border}`}>
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${siteData.videos[1].youtubeId}`} title={siteData.videos[1].title} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
          </section>

          <section className="w-full space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider">
              On SoundCloud
            </h2>
            <div className={`overflow-hidden ${border}`}>
              <iframe width="100%" height="166" scrolling="no" frameBorder="no" loading="lazy" allow="autoplay" src={siteData.soundcloudEmbedUrl} title={`${siteData.branding.siteTitle} on SoundCloud`} />
            </div>
          </section>

          {siteData.socialLinks.bandcamp && (
            <section className="w-full space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider">
                On Bandcamp
              </h2>
              <a
                href={siteData.socialLinks.bandcamp}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className={`inline-block font-heading text-lg md:text-2xl font-bold uppercase px-8 py-5 tracking-wider transition-all duration-300 ${showRainbow ? 'border-2 border-black hover:bg-black hover:text-white' : 'border-2 border-foreground hover:bg-foreground hover:text-background'}`}
              >
                Open Bandcamp
              </a>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};

export default Listen;
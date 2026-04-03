import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import mlpLogoLocal from '@/assets/mlp-logo.png';
import { cloudinaryImage } from '@/lib/cloudinary';
import GigSection from '@/components/GigSection';
import BackgroundManager from '@/components/BackgroundManager';
import { useMLP } from '@/contexts/MLPContext';
import SpotlightSection from '@/components/SpotlightSection';
import PressSection from '@/components/PressSection';

const Index = () => {
  const { siteData } = useMLP();
  const mlpLogo = siteData.branding.cloudinaryLogoId
    ? cloudinaryImage(siteData.branding.cloudinaryLogoId, 512)
    : mlpLogoLocal;
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hasGigs, setHasGigs] = useState(false);

  useEffect(() => {
    document.title = `${siteData.branding.siteTitle} - ${siteData.spotlight.title || siteData.branding.pageSubtitle}`;
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const showRainbow = isButtonHovered;

  return (
    <div className="transition-all duration-500 relative">
      <BackgroundManager isVisible={showRainbow} />
      
      {/* Hero */}
      <section className={`min-h-[60vh] flex flex-col items-center justify-center relative transition-colors duration-500 z-10 ${showRainbow ? '' : 'bg-background'}`}>
        <nav className={`absolute top-6 left-0 right-0 flex justify-between items-center px-6 md:px-12 transition-colors duration-500 ${showRainbow ? 'text-black' : 'text-foreground'}`}>
          <Link to="/about" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm uppercase tracking-widest hover:opacity-70 transition-opacity md:text-3xl">
            About
          </Link>
          <a href={siteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm uppercase tracking-widest hover:opacity-70 transition-opacity md:text-3xl">
            Instagram
          </a>
        </nav>

        <header className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} text-center ${showRainbow ? 'text-black' : 'text-foreground'}`}>
          <img src={mlpLogo} alt="MY LIBERAL PONY logo" className={`w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] object-contain mx-auto mb-6 transition-all duration-500 relative z-10 ${showRainbow ? '' : 'filter invert'}`} />
          <h1 className="font-heading text-4xl lg:text-7xl xl:text-8xl font-bold tracking-wider uppercase md:text-7xl">
            {siteData.branding.siteTitle}
          </h1>
        </header>
      </section>

      {/* Main Content */}
      <main className={`flex flex-col items-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${showRainbow ? 'text-black' : 'bg-background text-foreground'}`}>
        <div className="w-full max-w-6xl mx-auto text-center space-y-16 md:space-y-24">

          {/* Spotlight — New Single */}
          {siteData.spotlight.spotifyEmbedUrl && (
            <SpotlightSection spotlight={siteData.spotlight} press={siteData.press} showRainbow={showRainbow} onHover={setIsButtonHovered} />
          )}

          {/* Watch — Featured Video */}
          <section className="w-full space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
              Watch
            </h2>
            <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${siteData.videos[0].youtubeId}`} title={siteData.videos[0].title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
          </section>

          {/* More Music */}
          <section className="w-full space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
              More Music
            </h2>
            <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${siteData.videos[1].youtubeId}`} title={siteData.videos[1].title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src={siteData.soundcloudEmbedUrl} title="MY LIBERAL PONY on SoundCloud" />
            </div>
          </section>

          {/* Gigs */}
          <GigSection onButtonHover={setIsButtonHovered} isButtonHovered={isButtonHovered} showTitle={true} onGigsLoaded={setHasGigs} />

          {/* Press */}
          {siteData.press.length > 0 && (
            <PressSection press={siteData.press} showRainbow={showRainbow} onHover={setIsButtonHovered} />
          )}

          {/* Contact */}
          <section id="contact-section" className={`pt-16 border-t-4 py-16 transition-colors duration-500 ${showRainbow ? 'border-black bg-black/5' : 'border-foreground bg-foreground/5'}`}>
            <div className="text-center space-y-8">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
                BOOKINGS & ENQUIRIES
              </h2>
              <div className="space-y-4">
                <p className="font-body text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed uppercase">
                  FOR ALL BOOKING REQUESTS AND ENQUIRIES
                </p>
                <a href={`mailto:${siteData.contactEmail}`} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} aria-label={`Email ${siteData.branding.siteTitle} for bookings and enquiries`} className={`inline-block font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 min-h-[44px] transition-all duration-300 tracking-wider ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
                  {siteData.contactEmail.toUpperCase()}
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`py-8 flex flex-wrap justify-center gap-6 md:gap-12 transition-colors duration-500 ${showRainbow ? 'text-black' : 'text-foreground'}`}>
            <Link to="/about" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">About</Link>
            <a href={siteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Instagram</a>
            <a href={siteData.socialLinks.soundcloud} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Soundcloud</a>
            <a href={siteData.socialLinks.bandcamp} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Bandcamp</a>
            <a href={siteData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Youtube</a>
            {siteData.spotlight.spotifyUrl && (
              <a href={siteData.spotlight.spotifyUrl} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Spotify</a>
            )}
          </footer>

        </div>
      </main>
    </div>
  );
};

export default Index;

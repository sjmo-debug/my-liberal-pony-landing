import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mlpLogoLocal from '@/assets/mlp-logo.png';
import { cloudinaryImage, cloudinarySrcset } from '@/lib/cloudinary';
import GigSection from '@/components/GigSection';
import BackgroundManager from '@/components/BackgroundManager';
import { useMLP } from '@/contexts/MLPContext';
import SpotlightSection from '@/components/SpotlightSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import SEO from '@/components/SEO';

const APPLE_MUSIC_URL = 'https://music.apple.com/gb/artist/my-liberal-pony/1887096161';
const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/2BgfhrMJ3h63DMazpBwQwE';
const HERO_PUBLIC_ID = 'mlp/live-hero';

const isHashLink = (url: string) => url.startsWith('#');

const Index = () => {
  const { siteData } = useMLP();
  const mlpLogo = siteData.branding.cloudinaryLogoId
    ? cloudinaryImage(siteData.branding.cloudinaryLogoId, 512)
    : mlpLogoLocal;
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [loadSweep, setLoadSweep] = useState(false);
  const [touchLatched, setTouchLatched] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasGigs, setHasGigs] = useState(false);

  useEffect(() => {
    document.title = `${siteData.branding.siteTitle} - ${siteData.spotlight.title || siteData.branding.pageSubtitle}`;
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Detect touch + reduced motion once
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(rm);
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);
  }, []);

  // One-time load sweep (skipped if reduced motion)
  useEffect(() => {
    if (reducedMotion) return;
    const start = setTimeout(() => setLoadSweep(true), 700);
    const end = setTimeout(() => setLoadSweep(false), 700 + 1800);
    return () => { clearTimeout(start); clearTimeout(end); };
  }, [reducedMotion]);

  const showRainbow = isButtonHovered || loadSweep || touchLatched;

  const handleNavActivate = (url: string, e: React.MouseEvent) => {
    if (isTouch) setTouchLatched((v) => !v);
    if (isHashLink(url)) {
      e.preventDefault();
      const el = document.querySelector(url);
      if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const handleLogoTap = () => {
    if (isTouch) setTouchLatched((v) => !v);
  };

  const pageTitle = `${siteData.branding.siteTitle} - ${siteData.spotlight.title || siteData.branding.pageSubtitle}`;
  const pageDescription = siteData.spotlight.description
    || `Experimental live music & multimedia art from ${siteData.branding.siteTitle}. Stream the latest single and find upcoming gigs.`;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myliberalpony.co.uk/' },
      ],
    },
  ];
  if (siteData.spotlight.title && siteData.spotlight.spotifyUrl) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: siteData.spotlight.title,
      url: siteData.spotlight.spotifyUrl,
      byArtist: { '@type': 'MusicGroup', name: siteData.branding.siteTitle },
    });
  }

  return (
    <div className="transition-all duration-500 relative">
      <SEO title={pageTitle} description={pageDescription} path="/" jsonLd={jsonLd} />
      <BackgroundManager isVisible={showRainbow} />

      {/* Hero */}
      <section
        className="min-h-[70vh] flex flex-col items-center justify-center relative transition-colors duration-500 z-10 overflow-hidden bg-background"
        onClick={handleLogoTap}
      >
        {/* Hero photograph — grayscale at rest, full color during rainbow */}
        <img
          src={cloudinaryImage(HERO_PUBLIC_ID, 1600)}
          srcSet={cloudinarySrcset(HERO_PUBLIC_ID, [800, 1200, 1600])}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${showRainbow ? 'grayscale-0' : 'grayscale'}`}
        />
        {/* Subtle overlay for legibility */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${showRainbow ? 'bg-black/10' : 'bg-black/50'}`} aria-hidden="true" />

        <nav
          aria-label="Primary"
          className={`absolute top-6 left-0 right-0 flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-8 px-4 md:px-12 z-20 transition-colors duration-500 ${showRainbow ? 'text-black' : 'text-white'}`}
        >
          {siteData.navigation.map((item, i) => {
            const cls = `font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current px-2`;
            if (item.isExternal) {
              return (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onClick={(e) => { e.stopPropagation(); if (isTouch) setTouchLatched((v) => !v); }}
                  className={cls}
                >
                  {item.label}
                </a>
              );
            }
            if (isHashLink(item.url)) {
              return (
                <a
                  key={i}
                  href={item.url}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onClick={(e) => { e.stopPropagation(); handleNavActivate(item.url, e); }}
                  className={cls}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={i}
                to={item.url}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                onClick={(e) => { e.stopPropagation(); if (isTouch) setTouchLatched((v) => !v); }}
                className={cls}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <header className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} text-center px-4 ${showRainbow ? 'text-black' : 'text-white'}`}>
          <img
            src={mlpLogo}
            alt="MY LIBERAL PONY logo"
            width={512}
            height={512}
            className={`w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain mx-auto mb-6 transition-all duration-500 relative z-10 ${showRainbow ? '' : 'filter invert'}`}
          />
          <h1 className="font-heading text-4xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-wider uppercase">
            {siteData.branding.siteTitle}
          </h1>
          {reducedMotion && (
            <div
              aria-hidden="true"
              className="mx-auto mt-6 h-1 w-40 md:w-64"
              style={{
                background:
                  'linear-gradient(90deg,#ff0000,#ff8000,#ffee00,#00c853,#2979ff,#8e24aa)',
              }}
            />
          )}
        </header>
      </section>

      {/* Main Content */}
      <main className={`flex flex-col items-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${showRainbow ? 'text-black' : 'bg-background text-foreground'}`}>
        <div className="w-full max-w-6xl mx-auto text-center space-y-16 md:space-y-24">

          {/* Spotlight — New Single */}
          {siteData.spotlight.spotifyEmbedUrl && (
            <div id="spotlight-section" className="scroll-mt-24">
              <SpotlightSection spotlight={siteData.spotlight} showRainbow={showRainbow} onHover={setIsButtonHovered} />
            </div>
          )}

          {/* Newsletter — under Spotlight */}
          <NewsletterSignup id="newsletter-section" showRainbow={showRainbow} onHover={setIsButtonHovered} />

          {/* Watch — Featured Video */}
          <section id="watch-section" className="w-full space-y-8 scroll-mt-24">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
              Watch
            </h2>
            <div className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${siteData.videos[0].youtubeId}`} title={siteData.videos[0].title} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
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
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${siteData.videos[1].youtubeId}`} title={siteData.videos[1].title} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 w-full h-full" />
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
              <iframe width="100%" height="166" scrolling="no" frameBorder="no" loading="lazy" allow="autoplay" src={siteData.soundcloudEmbedUrl} title="MY LIBERAL PONY on SoundCloud" />
            </div>
          </section>

          {/* Gigs */}
          <div id="gigs-section" className="scroll-mt-24 w-full">
            <GigSection onButtonHover={setIsButtonHovered} isButtonHovered={isButtonHovered} showTitle={true} onGigsLoaded={setHasGigs} />
          </div>

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
                {siteData.socialLinks.buyMeACoffee && (
                  <div className="pt-6">
                    <p className="font-body text-base md:text-lg uppercase tracking-widest mb-3">
                      Support the music
                    </p>
                    <a
                      href={siteData.socialLinks.buyMeACoffee}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                      aria-label="Buy me a coffee"
                      className={`inline-block font-body text-lg md:text-xl lg:text-2xl font-bold uppercase px-6 py-4 md:px-8 md:py-5 min-h-[44px] transition-all duration-300 tracking-wider ${showRainbow ? 'border-2 border-black hover:bg-black hover:text-white' : 'border-2 border-foreground hover:bg-foreground hover:text-background'}`}
                    >
                      ☕ Buy Me a Coffee
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Newsletter — above footer */}
          <NewsletterSignup showRainbow={showRainbow} onHover={setIsButtonHovered} />

          {/* Footer */}
          <footer className={`py-8 flex flex-wrap justify-center gap-6 md:gap-12 transition-colors duration-500 ${showRainbow ? 'text-black' : 'text-foreground'}`}>
            <Link to="/about" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">About</Link>
            <a href={siteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Instagram</a>
            <a href={siteData.socialLinks.soundcloud} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Soundcloud</a>
            <a href={siteData.socialLinks.bandcamp} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Bandcamp</a>
            <a href={siteData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Youtube</a>
            <a href={SPOTIFY_ARTIST_URL} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Spotify</a>
            <a href={APPLE_MUSIC_URL} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className="font-body text-sm md:text-base uppercase tracking-widest hover:opacity-70 transition-opacity">Apple Music</a>
          </footer>

        </div>
      </main>
    </div>
  );
};

export default Index;

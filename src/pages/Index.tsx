import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import mlpLogo from '@/assets/mlp-logo.png';
import GigSection from '@/components/GigSection';
import BackgroundManager from '@/components/BackgroundManager';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const showRainbow = isButtonHovered;

  return (
    <div className="transition-all duration-500 relative">
      <BackgroundManager isVisible={showRainbow} />
      
      {/* Hero Section - Main Landing */}
      <section className={`min-h-screen flex flex-col items-center justify-center relative transition-colors duration-500 z-10 ${showRainbow ? '' : 'bg-background'}`}>
        <header className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } text-center ${showRainbow ? 'text-black' : 'text-foreground'}`}>
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY - Experimental multimedia artist and live music performer logo featuring bold artistic design" 
            className={`w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem] object-contain mx-auto mb-8 transition-all duration-500 relative z-10 ${showRainbow ? '' : 'filter invert'}`}
          />
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold tracking-wider uppercase">
            MY LIBERAL PONY
          </h1>
          
          {/* Instagram Link */}
          <nav className="mt-12">
            <a 
              href="https://instagram.com/myliberalpony" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow MY LIBERAL PONY on Instagram"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-block font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl uppercase px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 xl:px-12 xl:py-7 min-h-[44px] transition-all duration-300 ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}
            >
              FOLLOW ON INSTAGRAM
            </a>
          </nav>

          {/* Contact Button */}
          <div className="mt-6">
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              aria-label="Scroll to contact section for bookings"
              className={`inline-block font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl uppercase px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 xl:px-12 xl:py-7 min-h-[44px] transition-all duration-300 group ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}
            >
              <span className="inline-block animate-pulse group-hover:animate-bounce mr-3">↓</span>
              CONTACT FOR BOOKINGS
              <span className="inline-block animate-pulse group-hover:animate-bounce ml-3">↓</span>
            </button>
          </div>
        </header>
      </section>

      {/* Main Content Section */}
      <main className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${showRainbow ? 'text-black' : 'bg-background text-foreground'}`}>
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* About Section - Button to dedicated page */}
          <article className="space-y-6 md:space-y-8 w-full px-4 md:px-8">
            <Link 
              to="/about"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-block font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl uppercase px-6 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6 xl:px-12 xl:py-7 min-h-[44px] transition-all duration-300 ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}
              aria-label="Learn more about the artist"
            >
              ABOUT PAGE
            </Link>

            {/* Live Shows Section */}
            <section className="w-full mt-16">
              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider mb-8">
                Upcoming Live Shows
              </h3>
              <GigSection onButtonHover={setIsButtonHovered} isButtonHovered={isButtonHovered} showTitle={false} />
            </section>

            {/* Music Section */}
            <section className="w-full max-w-3xl mx-auto mt-12 space-y-8">
              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
                Listen to the Music
              </h3>
              
              {/* SoundCloud Embed */}
              <div>
                <iframe 
                  width="100%" 
                  height="166" 
                  scrolling="no" 
                  frameBorder="no" 
                  allow="autoplay"
                  src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chameleonpresents&color=%23ffffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
                  title="MY LIBERAL PONY on SoundCloud - Listen to experimental music tracks"
                  className="border border-foreground"
                />
              </div>

              {/* Bandcamp Embed */}
              <div>
                <iframe 
                  style={{border: 0, width: '100%', height: '120px'}} 
                  src="https://bandcamp.com/EmbeddedPlayer/album=YOUR_ALBUM_ID/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/" 
                  seamless
                  title="MY LIBERAL PONY on Bandcamp - Stream and purchase music"
                  className="border border-foreground"
                />
              </div>
            </section>


            {/* Contact Section */}
            <section id="contact-section" className={`mt-24 pt-16 border-t-4 -mx-4 md:-mx-8 px-4 md:px-8 py-16 mb-16 transition-colors duration-500 ${showRainbow ? 'border-black bg-black/5' : 'border-foreground bg-foreground/5'}`}>
              <div className="text-center space-y-8">
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold uppercase tracking-wider">
                  BOOKINGS & ENQUIRIES
                </h2>
                <div className="space-y-4">
                  <p className="font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed uppercase">
                    FOR ALL BOOKING REQUESTS AND ENQUIRIES
                  </p>
                  <a 
                    href="mailto:myliberalpony@gmail.com"
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    aria-label="Email MY LIBERAL PONY for bookings and enquiries"
                    className={`inline-block font-body text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold uppercase px-8 py-6 md:px-10 md:py-7 lg:px-12 lg:py-8 xl:px-14 xl:py-9 min-h-[44px] transition-all duration-300 tracking-wider ${showRainbow ? 'border-2 border-black' : 'border-2 border-foreground'}`}
                  >
                    MYLIBERALPONY@GMAIL.COM
                  </a>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
};

export default Index;
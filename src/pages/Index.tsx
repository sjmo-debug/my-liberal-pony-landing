import { useEffect, useState } from 'react';
import mlpLogo from '@/assets/mlp-logo-transparent.png';
import rainbowGradient from '@/assets/rainbow-gradient.jpg';
import GigSection from '@/components/GigSection';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="transition-all duration-500"
      style={isButtonHovered ? {
        backgroundImage: `url(${rainbowGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* First Section - Logo Only */}
      <section className={`min-h-screen flex flex-col items-center justify-center relative transition-colors duration-500 ${isButtonHovered ? '' : 'bg-background'}`}>
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } text-center ${isButtonHovered ? 'text-black' : 'text-foreground'}`}>
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY logo" 
            className={`w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem] object-contain mx-auto mb-8 transition-all duration-500 relative z-10 ${isButtonHovered ? '' : 'filter invert'}`}
          />
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider uppercase">
            MY LIBERAL PONY
          </h1>
          
          {/* Instagram Link */}
          <div className="mt-12">
            <a 
              href="https://instagram.com/myliberalpony" 
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-block font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border border-foreground'}`}
            >
              FOLLOW ON INSTAGRAM
            </a>
          </div>

          {/* Contact Button */}
          <div className="mt-6">
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-block font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 transition-all duration-300 group ${isButtonHovered ? 'border-2 border-black' : 'border border-foreground'}`}
            >
              <span className="inline-block animate-pulse group-hover:animate-bounce mr-3">↓</span>
              CONTACT FOR BOOKINGS
              <span className="inline-block animate-pulse group-hover:animate-bounce ml-3">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Second Section - Content */}
      <section className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Main Content */}
          <div className="space-y-6 md:space-y-8 w-full px-4 md:px-8">
            <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase">
              MY LIBERAL PONY IS A MULTIMEDIA, GENRE-BENDING, PERMANENT WORK IN PROGRESS, 
              NOW AVAILABLE TO REQUEST AT YOUR NEAREST LIVE MUSIC VENUE.
            </p>
            
            <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase">
              MY LIBERAL PONY IS THE INVITATION INTO AN MRI SCANNER THAT YOU DIDN'T KNOW YOU NEEDED.
            </p>
            
            <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase">
              MY LIBERAL PONY IS A COMMENTARY OF THE FALL OF DEMOCRATIC AND LIBERAL VALUES 
              IN LATE STAGE CAPITALISM FROM THE PERSPECTIVE OF A DISABLED MEMBER OF THE LGBT 
              COMMUNITY LIVING IN ENGLAND.
            </p>
            
            <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed italic uppercase">
              MY LIBERAL PONY IS NOT INTENDED TO INFRINGE ON ANY COPYRIGHTS AS OUTLINED BY 
              THE HASBRO CORPORATION HOWEVER IT WOULD ALSO BE QUITE FUNNY IF IT DID.
            </p>

            {/* SoundCloud Embed */}
            <div className="w-full max-w-3xl mx-auto mt-12">
              <iframe 
                width="100%" 
                height="166" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chameleonpresents&color=%23ffffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
                title="SoundCloud player"
                className="border border-foreground"
              />
            </div>

            {/* Bandcamp Embed */}
            <div className="w-full max-w-3xl mx-auto mt-8">
              <iframe 
                style={{border: 0, width: '100%', height: '120px'}} 
                src="https://bandcamp.com/EmbeddedPlayer/album=YOUR_ALBUM_ID/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/" 
                seamless
                title="Bandcamp player"
                className="border border-foreground"
              />
            </div>

            {/* Gigs Section */}
            <GigSection onButtonHover={setIsButtonHovered} isButtonHovered={isButtonHovered} />

            {/* Contact Information */}
            <div id="contact-section" className={`mt-24 pt-16 border-t-4 -mx-4 md:-mx-8 px-4 md:px-8 py-16 mb-16 transition-colors duration-500 ${isButtonHovered ? 'border-black bg-black/5' : 'border-foreground bg-foreground/5'}`}>
              <div className="text-center space-y-8">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider">
                  BOOKINGS & ENQUIRIES
                </h2>
                <div className="space-y-4">
                  <p className="font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed uppercase">
                    FOR ALL BOOKING REQUESTS AND ENQUIRIES
                  </p>
                  <a 
                    href="mailto:myliberalpony@gmail.com"
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    className={`inline-block font-body text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase px-8 py-6 transition-all duration-300 tracking-wider ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}
                  >
                    MYLIBERALPONY@GMAIL.COM
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
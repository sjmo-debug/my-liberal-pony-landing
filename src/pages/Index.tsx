import { useEffect, useState } from 'react';
import mlpLogo from '@/assets/mlp-logo.jpg';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* First Section - Logo Only */}
      <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative">
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } text-center`}>
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY logo" 
            className="w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem] object-contain filter invert mx-auto mb-8"
          />
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider uppercase">
            MY LIBERAL PONY
          </h1>
        </div>
      </section>

      {/* Second Section - Content */}
      <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Main Title */}
          <header>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider mb-8 md:mb-16 uppercase">
              MY LIBERAL PONY
            </h1>
          </header>

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
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/YOUR_USER_ID&color=%23ffffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
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

            {/* Instagram Link */}
            <div className="w-full max-w-3xl mx-auto mt-8">
              <a 
                href="https://instagram.com/myliberalpony" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block font-body text-lg md:text-xl lg:text-2xl uppercase border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                FOLLOW ON INSTAGRAM
              </a>
            </div>

            {/* Contact Information */}
            <div className="mt-16 pt-8 border-t border-foreground">
              <p className="font-body text-sm md:text-base lg:text-lg leading-relaxed uppercase">
                ( FOR BOOKINGS & ENQUIRIES, PLEASE CONTACT MYLIBERALPONY@GMAIL.COM )
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
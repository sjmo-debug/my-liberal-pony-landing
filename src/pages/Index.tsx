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
        }`}>
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY logo" 
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] object-contain filter invert"
          />
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground rounded-full mt-2 animate-pulse"></div>
          </div>
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
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
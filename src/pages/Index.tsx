import { useEffect, useState } from 'react';
import mlpLogo from '@/assets/mlp-logo.jpg';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8">
      <div className={`w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Logo */}
        <div className="flex justify-center mb-8 md:mb-16">
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY logo" 
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain filter invert"
          />
        </div>

        {/* Main Title */}
        <header>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider mb-8 md:mb-16 uppercase">
            MY LIBERAL PONY
          </h1>
        </header>

        {/* Main Content */}
        <section className="space-y-6 md:space-y-8 w-full px-4 md:px-8">
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
        </section>
      </div>
    </main>
  );
};

export default Index;
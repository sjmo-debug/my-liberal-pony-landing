import { useEffect, useState } from 'react';
import mlpLogo from '@/assets/mlp-logo.jpg';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 md:p-12">
      <div className={`max-w-4xl mx-auto text-center space-y-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Logo */}
        <div className="flex justify-center mb-16">
          <img 
            src={mlpLogo} 
            alt="MY LIBERAL PONY logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain filter invert"
          />
        </div>

        {/* Main Title */}
        <header>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-16">
            MY LIBERAL PONY
          </h1>
        </header>

        {/* Main Content */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <p className="font-body text-lg md:text-xl leading-relaxed">
            MY LIBERAL PONY is a multimedia, genre-bending, permanent work in progress, 
            now available to request at your nearest live music venue.
          </p>
          
          <p className="font-body text-lg md:text-xl leading-relaxed">
            MY LIBERAL PONY is the invitation into an MRI scanner that you didn't know you needed.
          </p>
          
          <p className="font-body text-lg md:text-xl leading-relaxed">
            MY LIBERAL PONY is a commentary of the fall of democratic and liberal values 
            in late stage capitalism from the perspective of a disabled member of the LGBT 
            community living in England.
          </p>
          
          <p className="font-body text-lg md:text-xl leading-relaxed italic">
            MY LIBERAL PONY is not intended to infringe on any copyrights as outlined by 
            the Hasbro corporation however it would also be quite funny if it did.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';

const Store = () => {
  useEffect(() => { document.title = "MY LIBERAL PONY - Store"; }, []);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div className="min-h-screen transition-all duration-500">
      <BackgroundManager isVisible={isButtonHovered} />
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 relative z-10 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        <article className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12 px-4 md:px-8">
          <nav className="flex justify-start mb-8">
            <Link to="/" onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} className={`inline-flex items-center gap-2 font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 md:px-8 md:py-4 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`} aria-label="Return to home page">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              BACK TO HOME
            </Link>
          </nav>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold uppercase tracking-wider">
            Store
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed uppercase">
            Coming Soon
          </p>
        </article>
      </div>
    </div>
  );
};

export default Store;

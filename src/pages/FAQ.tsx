import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import rainbowGradient from '@/assets/rainbow-gradient.jpg';

const FAQ = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={isButtonHovered ? {
        backgroundImage: `url(${rainbowGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 md:space-y-12 px-4 md:px-8">
          {/* Back Button */}
          <nav className="flex justify-start mb-8">
            <Link 
              to="/"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`inline-flex items-center gap-2 font-body text-lg md:text-xl lg:text-2xl uppercase px-6 py-3 md:px-8 md:py-4 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}
              aria-label="Return to home page"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              BACK TO HOME
            </Link>
          </nav>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold uppercase tracking-wider">
            Frequently Asked Questions
          </h1>
          
          <div className="text-left max-w-3xl mx-auto space-y-8 md:space-y-10">
            <article>
              <h2 className="font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase mb-3">
                What type of music is MY LIBERAL PONY?
              </h2>
              <p className="font-body text-base md:text-lg lg:text-xl uppercase leading-relaxed">
                Genre-bending experimental music combining multimedia elements with social commentary and live performance art.
              </p>
            </article>
            
            <article>
              <h2 className="font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase mb-3">
                How can I book MY LIBERAL PONY for a live show?
              </h2>
              <p className="font-body text-base md:text-lg lg:text-xl uppercase leading-relaxed">
                Email myliberalpony@gmail.com with your venue details, preferred dates, and event information for booking enquiries.
              </p>
            </article>
            
            <article>
              <h2 className="font-body text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold uppercase mb-3">
                Where does MY LIBERAL PONY perform?
              </h2>
              <p className="font-body text-base md:text-lg lg:text-xl uppercase leading-relaxed">
                Available for live music venues, festivals, and events across the UK and England.
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
